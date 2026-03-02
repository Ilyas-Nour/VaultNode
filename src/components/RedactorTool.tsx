"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { FileUp, ShieldCheck, Eraser, Loader2, Download, ChevronLeft, Square, MousePointer2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import * as pdfjs from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

interface RedactionBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

const UI_SCALE = 1.5;
const EXPORT_SCALE = 3.0;

export default function RedactorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [redactions, setRedactions] = useState<RedactionBox[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentBox, setCurrentBox] = useState<RedactionBox | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const exportCanvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize pdfjs worker on mount
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }, []);

    // Render PDF to Canvas
    const renderPage = useCallback(async (pdfFile: File) => {
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1); // Process first page

            const uiViewport = page.getViewport({ scale: UI_SCALE });
            const exportViewport = page.getViewport({ scale: EXPORT_SCALE });

            const canvas = canvasRef.current;
            const overlay = overlayRef.current;
            const exportCanvas = exportCanvasRef.current;

            if (!canvas || !overlay || !exportCanvas) return;

            // Setup UI Canvas
            const uiCtx = canvas.getContext("2d");
            if (!uiCtx) return;
            canvas.height = uiViewport.height;
            canvas.width = uiViewport.width;
            overlay.height = uiViewport.height;
            overlay.width = uiViewport.width;

            await page.render({
                canvasContext: uiCtx,
                viewport: uiViewport,
            } as any).promise;

            // Setup Export Canvas (Hidden)
            const exportCtx = exportCanvas.getContext("2d");
            if (!exportCtx) return;
            exportCanvas.height = exportViewport.height;
            exportCanvas.width = exportViewport.width;

            await page.render({
                canvasContext: exportCtx,
                viewport: exportViewport,
            } as any).promise;

            drawRedactions();
        } catch (error) {
            console.error("Error rendering PDF:", error);
            alert("Failed to render PDF for secure processing.");
        }
    }, []);

    useEffect(() => {
        if (file) renderPage(file);
    }, [file, renderPage]);

    // Drawing UI Logic (Overlay)
    const drawRedactions = useCallback(() => {
        const ctx = overlayRef.current?.getContext("2d");
        if (!ctx || !overlayRef.current) return;

        ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.strokeStyle = "#10b981";
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
        drawRedactions();
    }, [drawRedactions]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setIsDrawing(true);
        setCurrentBox({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !currentBox || !overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentBox({
            ...currentBox,
            width: x - currentBox.x,
            height: y - currentBox.y
        });
    };

    const handleMouseUp = () => {
        if (currentBox && Math.abs(currentBox.width) > 5 && Math.abs(currentBox.height) > 5) {
            const normalized = {
                x: currentBox.width > 0 ? currentBox.x : currentBox.x + currentBox.width,
                y: currentBox.height > 0 ? currentBox.y : currentBox.y + currentBox.height,
                width: Math.abs(currentBox.width),
                height: Math.abs(currentBox.height)
            };
            setRedactions(prev => [...prev, normalized]);
        }
        setIsDrawing(false);
        setCurrentBox(null);
    };

    // The Secure Implementation: Rasterization Flattening
    const handleRedact = async () => {
        if (!file || redactions.length === 0) return;
        setIsProcessing(true);

        try {
            const exportCanvas = exportCanvasRef.current;
            if (!exportCanvas) throw new Error("Export canvas not ready");

            const ctx = exportCanvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context failed");

            // 1. Draw solid black boxes on the high-res baseCanvas
            const scaleFactor = EXPORT_SCALE / UI_SCALE;
            ctx.fillStyle = "rgb(0, 0, 0)";

            redactions.forEach(box => {
                ctx.fillRect(
                    box.x * scaleFactor,
                    box.y * scaleFactor,
                    box.width * scaleFactor,
                    box.height * scaleFactor
                );
            });

            // 2. Convert high-res baseCanvas to a high-quality JPEG (Destroys underlying vector text)
            const imgData = exportCanvas.toDataURL("image/jpeg", 1.0);

            // 3. Rebuild PDF using pdf-lib
            const pdfDoc = await PDFDocument.create();

            // Get original PDF to preserve page dimensions if possible
            const originalArrayBuffer = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(originalArrayBuffer);
            const originalPage = originalPdf.getPages()[0];
            const { width, height } = originalPage.getSize();

            const page = pdfDoc.addPage([width, height]);
            const embeddedImage = await pdfDoc.embedJpg(imgData);

            page.drawImage(embeddedImage, {
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
        } catch (error) {
            console.error("Redaction error:", error);
            alert("Error generating secured document.");
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
        <main className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col space-y-8">

                {/* Nav */}
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" className="text-zinc-400 hover:text-white">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="text-emerald-500 w-5 h-5" />
                        <h1 className="text-xl font-bold italic tracking-tighter">VaultNode <span className="text-emerald-500">Secure Redactor</span></h1>
                    </div>
                </div>

                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                    >
                        <div
                            {...getRootProps()}
                            className={`
                mt-20 w-full max-w-2xl mx-auto aspect-[16/8] rounded-3xl border-2 border-dashed 
                transition-all duration-500 cursor-pointer flex flex-col items-center justify-center space-y-4
                ${isDragActive ? "border-emerald-500 bg-emerald-500/5 shadow-lg" : "border-zinc-800 bg-zinc-900/30"}
              `}
                        >
                            <input {...getInputProps()} />
                            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                                <Square className="w-8 h-8 text-zinc-500" />
                            </div>
                            <p className="text-lg font-medium">Drop a PDF to secure & redact</p>
                            <p className="text-zinc-500 text-sm italic">Uses "Pixel-Flattening" to permanently destroy underlying text data.</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

                        {/* Redaction Canvas Area */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative bg-zinc-900 rounded-xl overflow-auto border border-zinc-800 shadow-2xl max-h-[80vh] custom-scroll">
                                <canvas ref={canvasRef} className="block" />
                                <canvas
                                    ref={overlayRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    className="absolute top-0 left-0 cursor-crosshair touch-none"
                                />
                            </div>
                            {/* Hidden Export Canvas */}
                            <canvas ref={exportCanvasRef} className="hidden" />
                            <p className="text-zinc-500 text-xs flex items-center">
                                <MousePointer2 className="w-3 h-3 mr-1" />
                                Select sensitive areas. Export will be rasterized for 100% security.
                            </p>
                        </div>

                        {/* Sidebar Controls */}
                        <aside className="space-y-6">
                            <Card className="p-6 bg-zinc-900/50 border-zinc-800/50 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-emerald-500 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Secure Mode Active</span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xs font-semibold text-zinc-500 uppercase">Active Boxes</h3>
                                        <p className="text-3xl font-bold text-white tracking-tighter">{redactions.length}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleRedact}
                                        disabled={isProcessing || redactions.length === 0}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold h-12 rounded-xl"
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Flattening...</>
                                        ) : (
                                            <><Download className="mr-2 h-4 w-4" /> Secure & Download</>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => setRedactions([])}
                                        disabled={isProcessing || redactions.length === 0}
                                        className="w-full border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                                    >
                                        <Eraser className="mr-2 h-4 w-4" />
                                        Clear All
                                    </Button>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                                    <div className="flex items-center space-x-2 text-amber-500">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase">Security Note</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                                        This method converts your PDF pages to high-resolution images. Underlying text will be <b>permanently destroyed</b> and cannot be recovered via copy/paste.
                                    </p>
                                </div>
                            </Card>

                            <div className="w-full h-[300px] bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-[10px] text-zinc-800 font-bold tracking-widest uppercase">
                                Ad Slot
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}

