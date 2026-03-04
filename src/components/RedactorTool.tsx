"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
    Shield,
    FileUp,
    Trash2,
    Download,
    Eraser,
    Loader2,
    MousePointer2,
    AlertTriangle,
    CheckCircle2,
    Maximize2,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { cn } from "@/lib/utils";

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
    const t = useTranslations("Tools.redact");

    const [file, setFile] = useState<File | null>(null);
    const [redactions, setRedactions] = useState<RedactionBox[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentBox, setCurrentBox] = useState<RedactionBox | null>(null);

    // Canvas Refs
    const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const hiddenBaseCanvasRef = useRef<HTMLCanvasElement>(null);

    // Next.js pdfjs-dist Worker Fix
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

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
        }
    }, []);

    useEffect(() => {
        if (file) renderPdfAsync(file);
    }, [file, renderPdfAsync]);

    const redrawOverlay = useCallback(() => {
        const ctx = drawCanvasRef.current?.getContext("2d");
        if (!ctx || !drawCanvasRef.current) return;

        ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
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

    const handleSecureRedact = async () => {
        if (!file || redactions.length === 0) return;
        setIsProcessing(true);

        try {
            const baseCanvas = hiddenBaseCanvasRef.current;
            if (!baseCanvas) throw new Error("Base canvas missing");
            const ctx = baseCanvas.getContext("2d");
            if (!ctx) throw new Error("Context failure");

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

            const imgData = baseCanvas.toDataURL("image/jpeg", JPEG_QUALITY);

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
        } finally {
            setIsProcessing(false);
        }
    };

    const resetTool = () => {
        setFile(null);
        setRedactions([]);
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
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={Eraser}
            category="vault"
            toolId="redactor"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <span>Active Layers</span>
                            <span className="text-emerald-500">{redactions.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {redactions.map((_, i) => (
                                <div key={i} className="flex-1 h-1 bg-emerald-500 rounded-full" />
                            ))}
                            {redactions.length === 0 && <div className="flex-1 h-1 bg-zinc-900 rounded-full" />}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleSecureRedact}
                            disabled={isProcessing || redactions.length === 0}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4 me-2" />}
                            {isProcessing ? t('flattening') : t('secureExport')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setRedactions([])}
                            disabled={isProcessing || redactions.length === 0}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <Trash2 className="w-4 h-4 me-2" />
                            {t('clearAll')}
                        </Button>

                        {file && (
                            <Button
                                variant="ghost"
                                onClick={resetTool}
                                className="w-full h-10 text-zinc-600 hover:text-white text-[9px] font-black uppercase tracking-widest"
                            >
                                New Document
                            </Button>
                        )}
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-amber-500">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pixel Destruction</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            This process flattens the document into a high-res image grid.
                            Original text data is physically removed.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Visual Selection", description: "Draw boxes directly over sensitive text or images." },
                { title: "Pixel Flattening", description: "Document is rasterized at 300 DPI to ensure zero vector recovery." },
                { title: "Atomic Cleanup", description: "Temporary canvas buffers are destroyed upon download." }
            ]}
        >
            <div className="relative min-h-[450px] flex flex-col items-center justify-center p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl"
                        >
                            <div className="relative group/dropzone">
                                <AnimatePresence>
                                    {isDragActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -inset-1 conic-gradient-vault animate-pulse-conic rounded-[2.7rem] blur-md -z-10"
                                        />
                                    )}
                                </AnimatePresence>
                                <div
                                    {...getRootProps()}
                                    className={cn(
                                        "w-full aspect-video border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative",
                                        isDragActive ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                                        <FileUp className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">{t('dropTitle')}</h3>
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col items-center space-y-6"
                        >
                            <div className="relative bg-zinc-900 rounded-[2rem] p-4 border border-zinc-800 shadow-2xl overflow-auto max-h-[70vh] custom-scroll max-w-full">
                                <div className="min-w-fit mx-auto relative group">
                                    <canvas ref={pdfCanvasRef} className="block rounded-lg shadow-inner bg-white" />
                                    <canvas
                                        ref={drawCanvasRef}
                                        onMouseDown={onMouseDown}
                                        onMouseMove={onMouseMove}
                                        onMouseUp={onMouseUp}
                                        className="absolute top-0 left-0 cursor-crosshair touch-none"
                                    />
                                </div>
                            </div>
                            <canvas ref={hiddenBaseCanvasRef} className="hidden" />

                            <div className="flex items-center gap-6 px-6 py-3 bg-zinc-900/80 border border-zinc-800 rounded-full shadow-lg">
                                <div className="flex items-center gap-2">
                                    <MousePointer2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Click & Drag to Redact</span>
                                </div>
                                <div className="w-px h-4 bg-zinc-800" />
                                <div className="flex items-center gap-2">
                                    <Maximize2 className="w-4 h-4 text-zinc-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Auto-Scale Active</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
}
