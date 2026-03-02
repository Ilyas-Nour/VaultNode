"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { FileUp, ShieldCheck, Eraser, Loader2, Download, ChevronLeft, Square, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import * as pdfjs from "pdfjs-dist";
import { PDFDocument, rgb } from "pdf-lib";

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
    const [viewScale, setViewScale] = useState(1.5);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize pdfjs worker on mount
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }, []);

    // Render PDF to Canvas
    const renderPage = useCallback(async (pdfFile: File) => {
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1); // Render first page for now

            const viewport = page.getViewport({ scale: viewScale });
            const canvas = canvasRef.current;
            const overlay = overlayRef.current;

            if (!canvas || !overlay) return;

            const context = canvas.getContext("2d");
            if (!context) return;

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            overlay.height = viewport.height;
            overlay.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport,
            } as any).promise;

            drawRedactions(); // Redraw boxes if scale changes
        } catch (error) {
            console.error("Error rendering PDF:", error);
            alert("Failed to render PDF. It might be password protected or invalid.");
        }
    }, [viewScale]);

    useEffect(() => {
        if (file) renderPage(file);
    }, [file, renderPage]);

    // Drawing Logic
    const drawRedactions = useCallback(() => {
        const ctx = overlayRef.current?.getContext("2d");
        if (!ctx || !overlayRef.current) return;

        ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

        // Draw existing boxes
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;

        redactions.forEach(box => {
            ctx.fillRect(box.x, box.y, box.width, box.height);
            ctx.strokeRect(box.x, box.y, box.width, box.height);
        });

        // Draw current active box
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
            // Normalize negative dimensions
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

    // Redaction Logic
    const handleRedact = async () => {
        if (!file || redactions.length === 0) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const { width, height } = firstPage.getSize();

            // Viewport normalization
            const canvas = canvasRef.current;
            if (!canvas) return;

            const scaleX = width / canvas.width;
            const scaleY = height / canvas.height;

            redactions.forEach(box => {
                // Translate Canvas (Top-Left) to PDF (Bottom-Left)
                const pdfX = box.x * scaleX;
                const pdfY = height - (box.y * scaleY) - (box.height * scaleY);
                const pdfW = box.width * scaleX;
                const pdfH = box.height * scaleY;

                firstPage.drawRectangle({
                    x: pdfX,
                    y: pdfY,
                    width: pdfW,
                    height: pdfH,
                    color: rgb(0, 0, 0),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `redacted-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Redaction error:", error);
            alert("Error securing document.");
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
                        <h1 className="text-xl font-bold italic tracking-tighter">VaultNode <span className="text-emerald-500">Redactor</span></h1>
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
                            <p className="text-lg font-medium">Drop a PDF to start redacting</p>
                            <p className="text-zinc-500 text-sm">Security first: No file info ever leaves your device.</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

                        {/* Redaction Canvas Area */}
                        <div className="flex flex-col items-center space-y-4">
                            <div
                                ref={containerRef}
                                className="relative bg-zinc-900 rounded-xl overflow-auto border border-zinc-800 shadow-2xl max-h-[80vh] custom-scroll"
                            >
                                <canvas ref={canvasRef} className="block" />
                                <canvas
                                    ref={overlayRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    className="absolute top-0 left-0 cursor-crosshair touch-none"
                                />
                            </div>
                            <p className="text-zinc-500 text-xs flex items-center">
                                <MousePointer2 className="w-3 h-3 mr-1" />
                                Click and drag to draw redaction boxes on the document.
                            </p>
                        </div>

                        {/* Sidebar Controls */}
                        <aside className="space-y-6">
                            <Card className="p-6 bg-zinc-900/50 border-zinc-800/50 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-white">Active Redactions</h3>
                                    <p className="text-2xl font-bold text-emerald-500">{redactions.length}</p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleRedact}
                                        disabled={isProcessing || redactions.length === 0}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold h-12 rounded-xl"
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Securing...</>
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
                                        Clear Boxes
                                    </Button>
                                </div>

                                <hr className="border-zinc-800" />

                                <div className="space-y-4">
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Once clicked, VaultNode will flatten these shapes into solid black rectangles using <b>pdf-lib</b>. Text underneath becomes unrecoverable.
                                    </p>
                                </div>
                            </Card>

                            {/* Ad Placeholder */}
                            <div className="w-full h-[300px] bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-[10px] text-zinc-700 font-bold tracking-widest uppercase">
                                Redactor Sidebar Ad
                            </div>
                        </aside>
                    </div>
                )}

            </div>
        </main>
    );
}
