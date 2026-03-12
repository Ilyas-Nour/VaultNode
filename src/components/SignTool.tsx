"use client";

import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { useMotionValue } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { PenTool, Download, Trash2, Shield, Loader2, MousePointer2, ChevronLeft, ChevronRight, X, Check, Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

const UI_RENDER_SCALE = 1.5;

const SignTool = memo(() => {
    const t = useTranslations("Tools.sign");
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [selectedPage, setSelectedPage] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const sigX = useMotionValue(50);
    const sigY = useMotionValue(50);
    const [sigScale, setSigScale] = useState(1.0);
    const [pdfProxy, setPdfProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sigCanvasRef = useRef<HTMLCanvasElement>(null);
    const pagesContainerRef = useRef<HTMLDivElement>(null);
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

    const renderPage = useCallback(async (pdf: pdfjsLib.PDFDocumentProxy, pageNum: number) => {
        try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: UI_RENDER_SCALE });

            const canvas = canvasRefs.current[pageNum - 1];
            if (canvas) {
                const context = canvas.getContext("2d");
                if (context) {
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context, canvas, viewport }).promise;
                }
            }
        } catch (err) {
            console.error(`Error rendering page ${pageNum}:`, err);
        }
    }, []);

    const loadPdf = useCallback(async () => {
        if (!file) return;
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setPdfProxy(pdf);
            setNumPages(pdf.numPages);
        } catch (err) {
            console.error("PDF Load Error:", err);
        }
    }, [file]);

    useEffect(() => {
        if (file && file.type === "application/pdf") {
            loadPdf();
        }
    }, [file, loadPdf]);

    useEffect(() => {
        if (pdfProxy) {
            renderPage(pdfProxy, selectedPage + 1);
        }
    }, [pdfProxy, selectedPage, renderPage, isModalOpen]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setSignature(null);
            setSelectedPage(0);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent) => {
        const canvas = sigCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Calculate position relative to canvas display size
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Scale to internal canvas coordinates
        return {
            x: (x / rect.width) * canvas.width,
            y: (y / rect.height) * canvas.height
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const coords = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const coords = getCoordinates(e);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const saveSignature = () => {
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        setSignature(canvas.toDataURL("image/png"));
        sigX.set(50);
        sigY.set(50);
        setSigScale(1.0);
        setIsModalOpen(true);
    };

    const handleExport = useCallback(async () => {
        if (!file || !signature) return;
        setIsProcessing(true);

        try {
            const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
            const pages = pdfDoc.getPages();
            const page = pages[selectedPage];
            const { width, height } = page.getSize();

            const sigImage = await pdfDoc.embedPng(signature);

            const targetCanvas = canvasRefs.current[selectedPage];
            if (targetCanvas) {
                const rect = targetCanvas.getBoundingClientRect();
                const x = sigX.get();
                const y = sigY.get();

                // PDF-lib coordinates are from bottom-left
                const pdfX = (x / rect.width) * width;
                const sigWidthPdf = (120 * UI_RENDER_SCALE * sigScale / rect.width) * width;
                const sigHeightPdf = (60 * UI_RENDER_SCALE * sigScale / rect.height) * height;
                const pdfY = ((rect.height - y) / rect.height) * height - sigHeightPdf;

                page.drawImage(sigImage, {
                    x: pdfX,
                    y: pdfY,
                    width: sigWidthPdf,
                    height: sigHeightPdf,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `signed-${file.name}`;
            link.click();
        } catch (err) {
            console.error("Export Error:", err);
        } finally {
            setIsProcessing(false);
        }
    }, [file, signature, selectedPage, sigX, sigY, sigScale]);

    const clear = useCallback(() => {
        setFile(null);
        setSignature(null);
        setNumPages(0);
        setIsModalOpen(false);
        canvasRefs.current = [];
    }, []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={PenTool}
            category="docs"
            toolId="sign"
            settingsContent={
                file && (
                    <div className="space-y-6">
                        {!signature ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-white border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{t('drawSignature')}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                    <canvas
                                        ref={sigCanvasRef}
                                        width={800}
                                        height={400}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                        className="w-full aspect-[2/1] cursor-crosshair touch-none bg-white border border-zinc-100"
                                    />
                                </div>
                                <button
                                    onClick={saveSignature}
                                    className="w-full h-12 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all"
                                >
                                    {t('addSignature')}
                                </button>
                                <button
                                    onClick={() => {
                                        const ctx = sigCanvasRef.current?.getContext('2d');
                                        if (ctx) ctx.clearRect(0, 0, 800, 400);
                                    }}
                                    className="w-full h-12 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                                >
                                    {t('clear')}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                    <Shield className="w-5 h-5 text-emerald-500" />
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest leading-tight">
                                        {t('dropDesc')}
                                    </p>
                                </div>
                                <div className="p-3 bg-zinc-900 border border-white/5 rounded-lg space-y-1">
                                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">{t('placementTarget')}</label>
                                    <p className="text-[10px] text-white font-mono">{t('pageIndicator', { current: selectedPage + 1, total: numPages })}</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 rounded-xl"
                                >
                                    <MousePointer2 className="w-3.5 h-3.5" />
                                    {t('placeBtn')}
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={isProcessing}
                                    className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    {isProcessing ? t('processing') : t('saveBtn')}
                                </button>
                                <button
                                    onClick={() => {
                                        setSignature(null);
                                    }}
                                    className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors py-2"
                                >
                                    {t('drawSignature')}
                                </button>
                            </div>
                        )}
                        <div className="pt-4 border-t border-white/5">
                            <button onClick={clear} className="w-full h-12 border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                {t('clear')}
                            </button>
                        </div>
                    </div>
                )
            }
        >
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "w-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-20 gap-6",
                                    isDragActive ? "border-white bg-white/[0.05]" : "border-white/10 hover:border-white/20 bg-zinc-900/50"
                                )}
                            >
                                <input {...getInputProps()} />
                                <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded-full bg-white/5">
                                    <PenTool className={cn("w-8 h-8", isDragActive ? "text-white" : "text-white/40")} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-black text-white uppercase tracking-tighter">
                                        {isDragActive ? t('dropFiles') : t('dropTitle')}
                                    </p>
                                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col items-center gap-8 py-6"
                        >
                            <div className="w-full max-w-lg aspect-video bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 text-center p-8">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Shield className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-white uppercase tracking-widest">{t('docLoaded')}</p>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t('pagesDetected', { count: numPages })}</p>
                                </div>
                                {!signature && (
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">
                                        {t('sidebarHint')}
                                    </p>
                                )}
                                {signature && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="mt-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <MousePointer2 className="w-3 h-3" />
                                        {t('adjustBtn')}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Signing Workspace Modal */}
                <AnimatePresence>
                    {isModalOpen && signature && file && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
                        >
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)} />

                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="relative w-full max-w-5xl h-[90vh] bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                                            <PenTool className="w-4 h-4 text-black" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black text-white uppercase tracking-widest">{t('workspaceTitle')}</h3>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{t('pageIndicator', { current: selectedPage + 1, total: numPages })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                                            <Maximize2 className="w-3.5 h-3.5 text-zinc-500" />
                                            <input
                                                type="range"
                                                min="0.2"
                                                max="3.0"
                                                step="0.1"
                                                value={sigScale}
                                                onChange={(e) => setSigScale(parseFloat(e.target.value))}
                                                className="w-32 accent-white"
                                            />
                                            <span className="text-[10px] font-mono text-white min-w-[3ch]">x{sigScale.toFixed(1)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleExport}
                                                className="h-10 px-6 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors flex items-center gap-2 rounded-lg group"
                                            >
                                                <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                {t('finishBtn')}
                                            </button>
                                            <button
                                                onClick={() => setIsModalOpen(false)}
                                                className="w-10 h-10 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all rounded-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Body - Paginated Viewer */}
                                <div className="flex-1 relative bg-black/20 flex items-center justify-center overflow-hidden p-8 sm:p-12">
                                    <div
                                        className="relative bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out"
                                        style={{
                                            transform: `scale(${isProcessing ? 0.98 : 1})`,
                                            opacity: isProcessing ? 0.5 : 1
                                        }}
                                    >
                                        <canvas
                                            ref={el => { canvasRefs.current[selectedPage] = el; }}
                                            className="block max-h-[60vh] w-auto"
                                        />

                                        {/* Signature Overlaid on Active Page */}
                                        <motion.div
                                            drag
                                            dragMomentum={false}
                                            dragElastic={0}
                                            className="absolute cursor-move z-20 group"
                                            style={{ x: sigX, y: sigY, top: 0, left: 0, scale: sigScale }}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={signature}
                                                    alt="Signature"
                                                    className="object-contain select-none pointer-events-none"
                                                    style={{
                                                        width: 120 * UI_RENDER_SCALE,
                                                        height: 60 * UI_RENDER_SCALE,
                                                    }}
                                                />
                                                <div className="absolute -inset-2 border-2 border-dashed border-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[9px] font-black uppercase px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap shadow-xl flex items-center gap-2">
                                                    <MousePointer2 className="w-3 h-3" />
                                                    {t('dragToPosition')}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Pagination Controls */}
                                    {numPages > 1 && (
                                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
                                            <button
                                                disabled={selectedPage === 0}
                                                onClick={() => setSelectedPage(p => Math.max(0, p - 1))}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white disabled:opacity-20 hover:bg-white/10 transition-all"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <div className="px-4 text-[11px] font-black text-white uppercase tracking-widest min-w-[100px] text-center">
                                                {t('pageIndicator', { current: selectedPage + 1, total: numPages })}
                                            </div>
                                            <button
                                                disabled={selectedPage === numPages - 1}
                                                onClick={() => setSelectedPage(p => Math.min(numPages - 1, p + 1))}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white disabled:opacity-20 hover:bg-white/10 transition-all"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer / Hint */}
                                <div className="px-6 py-4 border-t border-white/5 bg-zinc-900/20 text-center">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                                        {t('hint')}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

SignTool.displayName = 'SignTool';
export default SignTool;
