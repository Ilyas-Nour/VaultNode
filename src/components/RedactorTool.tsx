"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
    FileUp,
    ShieldCheck,
    Eraser,
    Loader2,
    Download,
    ChevronLeft,
    Square,
    MousePointer2,
    AlertTriangle,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

// Constants for Coordinate Translation & Security
const UI_RENDER_SCALE = 1.5;
const SECURE_EXPORT_SCALE = 3.0;

interface RedactionBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function RedactorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [redactions, setRedactions] = useState<RedactionBox[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentBox, setCurrentBox] = useState<RedactionBox | null>(null);

    // Canvas refs for the Two-Layer & Secure-Rendering system
    const uiCanvasRef = useRef<HTMLCanvasElement>(null);
    const interactiveOverlayRef = useRef<HTMLCanvasElement>(null);
    const hiddenBaseCanvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize pdf.js worker locally from CDN (Next.js 15 Fix)
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }, []);

    /**
     * Renders the PDF page to both the UI canvas (visiblity) and 
     * a high-res hidden canvas (for the final secure export).
     */
    const renderPdfToCanvas = useCallback(async (pdfFile: File) => {
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1); // Redacting page 1 for initial release

            const uiViewport = page.getViewport({ scale: UI_RENDER_SCALE });
            const exportViewport = page.getViewport({ scale: SECURE_EXPORT_SCALE });

            const uiCanvas = uiCanvasRef.current;
            const overlay = interactiveOverlayRef.current;
            const baseCanvas = hiddenBaseCanvasRef.current;

            if (!uiCanvas || !overlay || !baseCanvas) return;

            // 1. Setup UI Viewport
            const uiCtx = uiCanvas.getContext("2d");
            if (!uiCtx) return;
            uiCanvas.height = uiViewport.height;
            uiCanvas.width = uiViewport.width;
            overlay.height = uiViewport.height;
            overlay.width = uiViewport.width;

            await page.render({
                canvasContext: uiCtx,
                viewport: uiViewport,
            } as any).promise;

            // 2. Setup High-Res Base Canvas (Prerequisite for Flattening)
            const baseCtx = baseCanvas.getContext("2d");
            if (!baseCtx) return;
            baseCanvas.height = exportViewport.height;
            baseCanvas.width = exportViewport.width;

            await page.render({
                canvasContext: baseCtx,
                viewport: exportViewport,
            } as any).promise;

            refreshOverlay();
        } catch (error) {
            console.error("Secure Render Error:", error);
            alert("Security Error: Unable to render document locally.");
        }
    }, []);

    useEffect(() => {
        if (file) renderPdfToCanvas(file);
    }, [file, renderPdfToCanvas]);

    /**
     * Interaction Logic: Handles drawing redaction rectangles
     */
    const refreshOverlay = useCallback(() => {
        const ctx = interactiveOverlayRef.current?.getContext("2d");
        if (!ctx || !interactiveOverlayRef.current) return;

        ctx.clearRect(0, 0, interactiveOverlayRef.current.width, interactiveOverlayRef.current.height);

        // Draw existing redaction zones
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;

        redactions.forEach(box => {
            ctx.fillRect(box.x, box.y, box.width, box.height);
            ctx.strokeRect(box.x, box.y, box.width, box.height);
        });

        // Draw active drawing preview
        if (currentBox) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
            ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
        }
    }, [redactions, currentBox]);

    useEffect(() => {
        refreshOverlay();
    }, [refreshOverlay]);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!interactiveOverlayRef.current) return;
        const rect = interactiveOverlayRef.current.getBoundingClientRect();
        setIsDrawing(true);
        setCurrentBox({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            width: 0,
            height: 0
        });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !currentBox || !interactiveOverlayRef.current) return;
        const rect = interactiveOverlayRef.current.getBoundingClientRect();
        setCurrentBox({
            ...currentBox,
            width: (e.clientX - rect.left) - currentBox.x,
            height: (e.clientY - rect.top) - currentBox.y
        });
    };

    const onMouseUp = () => {
        if (currentBox && Math.abs(currentBox.width) > 4 && Math.abs(currentBox.height) > 4) {
            setRedactions(prev => [...prev, {
                x: currentBox.width > 0 ? currentBox.x : currentBox.x + currentBox.width,
                y: currentBox.height > 0 ? currentBox.y : currentBox.y + currentBox.height,
                width: Math.abs(currentBox.width),
                height: Math.abs(currentBox.height)
            }]);
        }
        setIsDrawing(false);
        setCurrentBox(null);
    };

    /**
     * THE CORE SECURITY LOGIC: Canvas Flattening & Rasterization
     * This permanently destroys underlying text data by reconstructing the PDF as an image.
     */
    const handleSecureRedact = async () => {
        if (!file || redactions.length === 0) return;
        setIsProcessing(true);

        try {
            const baseCanvas = hiddenBaseCanvasRef.current;
            if (!baseCanvas) throw new Error("Base canvas missing");
            const ctx = baseCanvas.getContext("2d");
            if (!ctx) throw new Error("Context failure");

            // 1. Pixel-Level Redaction: Draw solid black onto high-res canvas
            const scaleFactor = SECURE_EXPORT_SCALE / UI_RENDER_SCALE;
            ctx.fillStyle = "rgb(0, 0, 0)";

            redactions.forEach(box => {
                ctx.fillRect(
                    box.x * scaleFactor,
                    box.y * scaleFactor,
                    box.width * scaleFactor,
                    box.height * scaleFactor
                );
            });

            // 2. Image Flattening: Convert to high-quality JPEG (Destructive export at 0.95 quality)
            const imgData = baseCanvas.toDataURL("image/jpeg", 0.95);

            // 3. Document Reconstruction: Build final PDF from the flattened image
            const pdfDoc = await PDFDocument.create();

            // Load original for dimension matching
            const originalAb = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(originalAb);
            const originalPage = originalPdf.getPages()[0];
            const { width, height } = originalPage.getSize();

            const page = pdfDoc.addPage([width, height]);
            const redactedImage = await pdfDoc.embedJpg(imgData);

            page.drawImage(redactedImage, {
                x: 0,
                y: 0,
                width: width,
                height: height,
            });

            // Serialize and download
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `vaultnode-secured-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Flattening failure:", err);
            alert("Failed to securely flatten the document.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col space-y-8">

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" className="text-zinc-400 hover:text-white transition-colors">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Main Dashboard
                        </Button>
                    </Link>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <Lock className="text-emerald-500 w-4 h-4" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Secure <span className="text-emerald-500">Redactor</span></h1>
                    </div>
                </div>

                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-[60vh] flex flex-col items-center justify-center pt-20"
                    >
                        <div
                            {...getRootProps()}
                            className={`
                w-full max-w-2xl aspect-[16/9] rounded-[2rem] border-2 border-dashed 
                transition-all duration-700 cursor-pointer flex flex-col items-center justify-center space-y-6
                ${isDragActive ? "border-emerald-500 bg-emerald-500/5 scale-102 shadow-2xl" : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700"}
              `}
                        >
                            <input {...getInputProps()} />
                            <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
                                <FileUp className={`w-10 h-10 transition-colors duration-500 ${isDragActive ? "text-emerald-500" : "text-zinc-600"}`} />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-semibold">Drop sensitive PDF</p>
                                <p className="text-zinc-500 text-sm max-w-[280px] leading-relaxed">
                                    Pixels are flattened locally. Original text data is <b>never</b> recoverable.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

                        {/* Logic Area: Visualization + Interaction Layer */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative group bg-zinc-900 rounded-3xl overflow-auto border-4 border-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[75vh] custom-scroll">
                                <canvas ref={uiCanvasRef} className="block rounded-lg" />
                                <canvas
                                    ref={interactiveOverlayRef}
                                    onMouseDown={onMouseDown}
                                    onMouseMove={onMouseMove}
                                    onMouseUp={onMouseUp}
                                    className="absolute top-0 left-0 cursor-crosshair touch-none"
                                />
                            </div>
                            {/* Hidden Secure Canvas (Internal Processing Only) */}
                            <canvas ref={hiddenBaseCanvasRef} className="hidden" />

                            <div className="flex items-center space-x-4 text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                                <MousePointer2 className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Drawing Redaction Boxes</span>
                            </div>
                        </div>

                        {/* Controls Sidebar */}
                        <aside className="space-y-6">
                            <Card className="p-8 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl rounded-[2rem] space-y-8">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center space-x-2 text-emerald-500 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">Zero-Trace Active</span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Layers</h3>
                                        <p className="text-5xl font-black text-white tracking-tighter">{redactions.length}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        onClick={handleSecureRedact}
                                        disabled={isProcessing || redactions.length === 0}
                                        className="w-full group bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black h-16 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/10"
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Securing & Flattening...</>
                                        ) : (
                                            <><Download className="mr-3 h-5 w-5 group-hover:-translate-y-1 transition-transform" /> Secure & Download</>
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={() => setRedactions([])}
                                        disabled={isProcessing || redactions.length === 0}
                                        className="w-full text-zinc-500 hover:text-white hover:bg-zinc-800/50 rounded-2xl h-12"
                                    >
                                        <Eraser className="mr-2 h-4 w-4" />
                                        Clear Redactions
                                    </Button>
                                </div>

                                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                                    <div className="flex items-center space-x-2 text-amber-500">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase">Technical Notice</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                                        This implementation destroys underlying vector text data by rasterizing the page to a high-density canvas before PDF reconstruction.
                                    </p>
                                </div>
                            </Card>

                            {/* Sidebar Branding/Ad */}
                            <div className="w-full h-[250px] bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center space-y-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                                <p className="text-[10px] font-bold text-zinc-700 uppercase">Secure Environment by VaultNode</p>
                                <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
