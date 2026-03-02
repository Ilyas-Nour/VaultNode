"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
    Shield,
    FileUp,
    Trash2,
    Download,
    ChevronLeft,
    Loader2,
    Square,
    MousePointer2,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

// Configuration for High-Res Secure Flattening
const UI_RENDER_SCALE = 1.5;
const SECURE_EXPORT_SCALE = 3.0;
const JPEG_QUALITY = 0.95;

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

    // Canvas Refs
    const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const hiddenBaseCanvasRef = useRef<HTMLCanvasElement>(null);

    // Next.js pdfjs-dist Worker Fix (Crucial for build/runtime stability)
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }, []);

    /**
     * Render Engine: Renders the PDF onto a UI-layer and a hidden high-res layer.
     */
    const renderPdfAsync = useCallback(async (pdfFile: File) => {
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);

            const uiViewport = page.getViewport({ scale: UI_RENDER_SCALE });
            const exportViewport = page.getViewport({ scale: SECURE_EXPORT_SCALE });

            const pdfCanvas = pdfCanvasRef.current;
            const drawCanvas = drawCanvasRef.current;
            const baseCanvas = hiddenBaseCanvasRef.current;

            if (!pdfCanvas || !drawCanvas || !baseCanvas) return;

            // Initialize UI Canvas
            const uiCtx = pdfCanvas.getContext("2d");
            if (!uiCtx) return;
            pdfCanvas.height = uiViewport.height;
            pdfCanvas.width = uiViewport.width;
            drawCanvas.height = uiViewport.height;
            drawCanvas.width = uiViewport.width;

            await page.render({
                canvasContext: uiCtx,
                viewport: uiViewport,
            } as any).promise;

            // Initialize Hidden High-Res Canvas (Processing Layer)
            const baseCtx = baseCanvas.getContext("2d");
            if (!baseCtx) return;
            baseCanvas.height = exportViewport.height;
            baseCanvas.width = exportViewport.width;

            await page.render({
                canvasContext: baseCtx,
                viewport: exportViewport,
            } as any).promise;

            redrawOverlay();
        } catch (err) {
            console.error("PDF Render Error:", err);
            alert("Error: Document processing failed locally.");
        }
    }, []);

    useEffect(() => {
        if (file) renderPdfAsync(file);
    }, [file, renderPdfAsync]);

    /**
     * UI Interaction Layer: Handles redaction box drawing
     */
    const redrawOverlay = useCallback(() => {
        const ctx = drawCanvasRef.current?.getContext("2d");
        if (!ctx || !drawCanvasRef.current) return;

        ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);

        // Aesthetic Redaction Boxes
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.strokeStyle = "#10b981"; // emerald-500
        ctx.lineWidth = 2;

        redactions.forEach(box => {
            ctx.fillRect(box.x, box.y, box.width, box.height);
            ctx.strokeRect(box.x, box.y, box.width, box.height);
        });

        if (currentBox) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
            ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
        }
    }, [redactions, currentBox]);

    useEffect(() => {
        redrawOverlay();
    }, [redrawOverlay]);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!drawCanvasRef.current) return;
        const rect = drawCanvasRef.current.getBoundingClientRect();
        setIsDrawing(true);
        setCurrentBox({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            width: 0,
            height: 0
        });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !currentBox || !drawCanvasRef.current) return;
        const rect = drawCanvasRef.current.getBoundingClientRect();
        setCurrentBox({
            ...currentBox,
            width: (e.clientX - rect.left) - currentBox.x,
            height: (e.clientY - rect.top) - currentBox.y
        });
    };

    const onMouseUp = () => {
        if (currentBox && Math.abs(currentBox.width) > 5 && Math.abs(currentBox.height) > 5) {
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

    const onTouchStart = (e: React.TouchEvent) => {
        if (!drawCanvasRef.current) return;
        const rect = drawCanvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        setIsDrawing(true);
        setCurrentBox({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
            width: 0,
            height: 0
        });
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (!isDrawing || !currentBox || !drawCanvasRef.current) return;
        const rect = drawCanvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        setCurrentBox({
            ...currentBox,
            width: (touch.clientX - rect.left) - currentBox.x,
            height: (touch.clientY - rect.top) - currentBox.y
        });
    };

    const onTouchEnd = () => {
        onMouseUp();
    };

    /**
     * SECURITY ENGINE: Pixel-Flattening
     * Permanently destroys underlying text data.
     */
    const handleSecureRedact = async () => {
        if (!file || redactions.length === 0) return;
        setIsProcessing(true);

        try {
            const baseCanvas = hiddenBaseCanvasRef.current;
            if (!baseCanvas) throw new Error("Base canvas missing");
            const ctx = baseCanvas.getContext("2d");
            if (!ctx) throw new Error("Context failure");

            // 1. Scaled Pixel Redaction
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

            // 2. Rasterization (Vector-to-Image conversion)
            const imgData = baseCanvas.toDataURL("image/jpeg", JPEG_QUALITY);

            // 3. Document Reconstruction using pdf-lib
            const pdfDoc = await PDFDocument.create();
            const originalAb = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(originalAb);
            const originalPage = originalPdf.getPages()[0];
            const { width, height } = originalPage.getSize();

            const page = pdfDoc.addPage([width, height]);
            const redactedImg = await pdfDoc.embedJpg(imgData);

            page.drawImage(redactedImg, {
                x: 0,
                y: 0,
                width: width,
                height: height,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `vaultnode-secured-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Security Engine Error:", err);
            alert("Flattening failed. Please try again.");
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
        <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 flex flex-col items-center selection:bg-emerald-500/30">
            <div className="w-full max-w-6xl flex flex-col space-y-6 sm:y-8">

                {/* Navigation & Brand */}
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all h-10 px-3 sm:px-4">
                            <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Back Home</span>
                            <span className="sm:hidden">Home</span>
                        </Button>
                    </Link>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-zinc-900/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-zinc-800">
                        <Shield className="text-emerald-500 w-4 h-4 sm:w-5 sm:h-5 fill-emerald-500/10" />
                        <h1 className="text-sm sm:text-lg font-bold italic tracking-tighter">VaultNode <span className="text-emerald-500">Secure</span></h1>
                    </div>
                </div>

                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full pt-8 sm:pt-12"
                    >
                        <div
                            {...getRootProps()}
                            className={`
                w-full max-w-2xl mx-auto aspect-[4/3] sm:aspect-[16/9] rounded-[2rem] sm:rounded-[2.5rem] border-2 border-dashed 
                transition-all duration-700 cursor-pointer flex flex-col items-center justify-center space-y-4 sm:space-y-6
                ${isDragActive ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_80px_rgba(16,185,129,0.1)]" : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/30"}
              `}
                        >
                            <input {...getInputProps()} />
                            <div className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-zinc-900/80 border border-zinc-800 shadow-2xl">
                                <FileUp className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-500 ${isDragActive ? "text-emerald-500" : "text-zinc-600"}`} />
                            </div>
                            <div className="text-center space-y-1 sm:space-y-2 px-6">
                                <p className="text-lg sm:text-xl font-bold tracking-tight">Drop Secure PDF</p>
                                <p className="text-zinc-500 text-xs sm:text-sm max-w-[320px] leading-relaxed mx-auto">
                                    Rasterized flattening permanently destroys underlying data for 100% security.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 sm:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Main Interactive Work Area */}
                        <div className="flex flex-col items-center space-y-6 order-2 lg:order-1">
                            <div className="relative w-full bg-zinc-900 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 border border-zinc-800 shadow-2xl overflow-auto max-h-[60vh] sm:max-h-[75vh] custom-scroll">
                                <div className="min-w-fit mx-auto">
                                    <canvas ref={pdfCanvasRef} className="block rounded-lg sm:rounded-xl shadow-inner bg-white" />
                                    <canvas
                                        ref={drawCanvasRef}
                                        onMouseDown={onMouseDown}
                                        onMouseMove={onMouseMove}
                                        onMouseUp={onMouseUp}
                                        onTouchStart={onTouchStart}
                                        onTouchMove={onTouchMove}
                                        onTouchEnd={onTouchEnd}
                                        className="absolute top-3 sm:top-4 left-3 sm:left-4 cursor-crosshair touch-none"
                                    />
                                </div>
                            </div>
                            <canvas ref={hiddenBaseCanvasRef} className="hidden" />

                            <div className="flex items-center space-x-3 text-zinc-500 bg-zinc-900/80 px-5 py-2.5 rounded-2xl border border-zinc-800 shadow-lg">
                                <MousePointer2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-bold uppercase tracking-widest leading-none">Drawing Redaction Zones</span>
                            </div>
                        </div>

                        {/* Optimized Control Sidebar */}
                        <aside className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                            <Card className="p-6 sm:p-8 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl space-y-6 sm:space-y-8">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="inline-flex items-center space-x-2 text-emerald-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                        <Shield className="w-3.5 h-3.5" />
                                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Privacy Sandbox Active</span>
                                    </div>

                                    <div className="flex lg:flex-col items-baseline lg:items-start justify-between lg:justify-start space-x-2 lg:space-x-0 lg:space-y-1 pl-1">
                                        <h3 className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Layers</h3>
                                        <p className="text-4xl sm:text-6xl font-black text-white tracking-tighter">{redactions.length}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <Button
                                        onClick={handleSecureRedact}
                                        disabled={isProcessing || redactions.length === 0}
                                        className="w-full group bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black h-14 sm:h-16 rounded-xl sm:rounded-2xl transition-all duration-500 shadow-lg hover:shadow-emerald-500/20 active:scale-95 text-base sm:text-lg"
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="mr-2 sm:mr-3 h-5 w-5 animate-spin" /> Flattening...</>
                                        ) : (
                                            <><Download className="mr-2 sm:mr-3 h-5 w-5 group-hover:-translate-y-1 transition-transform" /> Secure & Export</>
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={() => setRedactions([])}
                                        disabled={isProcessing || redactions.length === 0}
                                        className="w-full text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl sm:rounded-2xl h-12 sm:h-14 font-bold text-sm"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Clear All
                                    </Button>
                                </div>

                                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-950/50 border border-zinc-800/80 space-y-3 sm:space-y-4">
                                    <div className="flex items-center space-x-2 text-amber-500">
                                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500/10" />
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Security Protocol</span>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-relaxed font-semibold italic">
                                        Original text data will be permanently overwritten by rasterization at 3.0x density.
                                    </p>
                                </div>
                            </Card>

                            {/* Minimalist Sidebar Logo/Brand - Hidden on super small mobiles */}
                            <div className="hidden sm:flex w-full h-[150px] lg:h-[200px] bg-zinc-900/10 border border-dashed border-zinc-800 rounded-[2rem] lg:rounded-[2.5rem] flex-col items-center justify-center space-y-3 opacity-40 hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-zinc-800 rounded-xl rotate-45 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-emerald-500 rounded-full" />
                                </div>
                                <p className="text-[9px] lg:text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Secured by VaultNode</p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
