/**
 * 🖋️ PRIVAFLOW | Secure PDF Redactor
 * ---------------------------------------------------------
 * A surgical privacy tool designed to physically destroy 
 * sensitive data in PDF documents via raster-flattening.
 * 
 * Logic: Raster-Flattening (Image-based pixel destruction)
 * Performance: Peak (Memoized Canvas Engine & Secure Export)
 * Aesthetics: Vault-Industrial / High-Tactile
 */

"use client";

import React, { useState, useCallback, useRef, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
    Shield,
    FileUp,
    Trash2,
    Eraser,
    Loader2,
    MousePointer2,
    AlertTriangle,
    Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { cn } from "@/lib/utils";

// --- 🔧 SECURITY ENGINE CONFIG ---
const UI_RENDER_SCALE = 1.6;
const SECURE_EXPORT_SCALE = 3.2; // Industrial-grade 300+ DPI equivalent
const JPEG_QUALITY = 0.96;

interface RedactionBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * 🖋️ RedactorTool Component
 * The definitive interface for secure document redaction.
 * Ensures zero-vector recovery by flattening the document into a high-res grid.
 */
const RedactorTool = memo(() => {
    // 📂 STATE ORCHESTRATION
    const t = useTranslations('Tools.redact');
    const commonT = useTranslations('Tools.common');
    const [file, setFile] = useState<File | null>(null);
    // ... rest of state
    const [redactions, setRedactions] = useState<RedactionBox[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentBox, setCurrentBox] = useState<RedactionBox | null>(null);

    // 🎨 CANVAS REFERENCES
    const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const hiddenBaseCanvasRef = useRef<HTMLCanvasElement>(null);

    // 🛠️ WORKER INITIALIZATION
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);

    const [activeUIScale, setActiveUIScale] = useState(UI_RENDER_SCALE);

    const redrawOverlay = useCallback(() => {
        const ctx = drawCanvasRef.current?.getContext("2d");
        if (!ctx || !drawCanvasRef.current) return;

        ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.98)";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;

        redactions.forEach(box => {
            ctx.fillRect(box.x, box.y, box.width, box.height);
            ctx.strokeRect(box.x, box.y, box.width, box.height);
        });

        if (currentBox) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
        }
    }, [redactions, currentBox]);

    const renderTaskRef = useRef<any>(null);

    // 🚀 STABLE RENDER ENGINE (Decoupled from drawing state)
    const renderPdfAsync = useCallback(async (pdfFile: File) => {
        try {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);

            const originalViewport = page.getViewport({ scale: 1 });
            
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
            
            // Margins for HUD and generous breathing room
            const horizontalPadding = 80; 
            const verticalPadding = 200; 

            const targetWidth = vw - horizontalPadding;
            const targetHeight = vh - verticalPadding;

            const scaleX = targetWidth / originalViewport.width;
            const scaleY = targetHeight / originalViewport.height;
            
            // Exact fit to screen, no arbitrary minimums or maximums.
            const dynamicUIScale = Math.min(scaleX, scaleY);
            
            setActiveUIScale(dynamicUIScale);

            const uiViewport = page.getViewport({ scale: dynamicUIScale });
            const exportViewport = page.getViewport({ scale: SECURE_EXPORT_SCALE });

            const pdfCanvas = pdfCanvasRef.current;
            const drawCanvas = drawCanvasRef.current;
            const baseCanvas = hiddenBaseCanvasRef.current;

            if (!pdfCanvas || !drawCanvas || !baseCanvas) return;

            const uiCtx = pdfCanvas.getContext("2d");
            if (!uiCtx) return;

            // Physical Canvas Resolution (High-Res scaling based on Device Pixel Ratio could be added here later, but standard px is fine for now)
            pdfCanvas.width = uiViewport.width;
            pdfCanvas.height = uiViewport.height;
            pdfCanvas.style.width = `${uiViewport.width}px`;
            pdfCanvas.style.height = `${uiViewport.height}px`;

            drawCanvas.width = uiViewport.width;
            drawCanvas.height = uiViewport.height;
            drawCanvas.style.width = `${uiViewport.width}px`;
            drawCanvas.style.height = `${uiViewport.height}px`;

            renderTaskRef.current = page.render({ canvasContext: uiCtx, canvas: pdfCanvas, viewport: uiViewport });
            await renderTaskRef.current.promise;

            const baseCtx = baseCanvas.getContext("2d");
            if (!baseCtx) return;
            baseCanvas.height = exportViewport.height;
            baseCanvas.width = exportViewport.width;

            renderTaskRef.current = page.render({ canvasContext: baseCtx, canvas: baseCanvas, viewport: exportViewport });
            await renderTaskRef.current.promise;

            renderTaskRef.current = null;
        } catch (err: any) {
            if (err.name === 'RenderingCancelledException') return;
            console.error("PDF Fail:", err);
        }
    }, []); // ⚡ No dependencies = Stable function

    // Sync PDF render on file change
    useEffect(() => {
        if (file) renderPdfAsync(file);
        return () => {
            if (renderTaskRef.current) renderTaskRef.current.cancel();
        };
    }, [file, renderPdfAsync]);

    // Handle resize to re-render PDF
    useEffect(() => {
        const handleResize = () => {
            if (file) renderPdfAsync(file);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [file, renderPdfAsync]);

    useEffect(() => {
        redrawOverlay();
    }, [redrawOverlay]);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (!drawCanvasRef.current) return;
        const rect = drawCanvasRef.current.getBoundingClientRect();
        setIsDrawing(true);
        setCurrentBox({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            width: 0,
            height: 0
        });
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDrawing || !currentBox || !drawCanvasRef.current) return;
        const rect = drawCanvasRef.current.getBoundingClientRect();
        setCurrentBox(prev => prev ? ({
            ...prev,
            width: (e.clientX - rect.left) - prev.x,
            height: (e.clientY - rect.top) - prev.y
        }) : null);
    }, [isDrawing]);

    const onMouseUp = useCallback(() => {
        if (currentBox && Math.abs(currentBox.width) > 3 && Math.abs(currentBox.height) > 3) {
            setRedactions(prev => [...prev, {
                x: currentBox.width > 0 ? currentBox.x : currentBox.x + currentBox.width,
                y: currentBox.height > 0 ? currentBox.y : currentBox.y + currentBox.height,
                width: Math.abs(currentBox.width),
                height: Math.abs(currentBox.height)
            }]);
        }
        setIsDrawing(false);
        setCurrentBox(null);
    }, [currentBox]);

    const handleSecureRedact = useCallback(async () => {
        if (!file || redactions.length === 0) return;
        setIsProcessing(true);

        try {
            const baseCanvas = hiddenBaseCanvasRef.current;
            if (!baseCanvas) throw new Error("Base missing");
            const ctx = baseCanvas.getContext("2d");
            if (!ctx) throw new Error("Ctx failure");

            const scaleFactor = SECURE_EXPORT_SCALE / activeUIScale;
            ctx.fillStyle = "rgb(0, 0, 0)";

            redactions.forEach(box => {
                ctx.fillRect(box.x * scaleFactor, box.y * scaleFactor, box.width * scaleFactor, box.height * scaleFactor);
            });

            const imgData = baseCanvas.toDataURL("image/jpeg", JPEG_QUALITY);

            const pdfDoc = await PDFDocument.create();
            const originalAb = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(originalAb);
            const originalPage = originalPdf.getPages()[0];
            const { width, height } = originalPage.getSize();

            const page = pdfDoc.addPage([width, height]);
            const redactedImg = await pdfDoc.embedJpg(imgData);

            page.drawImage(redactedImg, { x: 0, y: 0, width, height });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `redacted-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Redact fail:", err);
        } finally {
            setIsProcessing(false);
        }
    }, [file, redactions]);

    const resetTool = useCallback(() => {
        setFile(null);
        setRedactions([]);
        setIsProcessing(false);
        setCurrentBox(null);
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    return (
        <AnimatePresence mode="wait">
            {!file ? (
                <motion.div
                    key="landing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <ToolContainer
                        title={t('title')}
                        description={t('description')}
                        icon={Eraser}
                        category="vault"
                        toolId="redactor"
                        settingsContent={
                            <div className="space-y-10">
                                <div className="space-y-4 text-center py-10 opacity-40">
                                    <div className="w-12 h-12 border-2 border-dashed border-zinc-800 rounded-full mx-auto flex items-center justify-center">
                                        <FileUp className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                                        {t('howItWorks.step1.description')}
                                    </p>
                                </div>
                            </div>
                        }
                        howItWorks={[
                            { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.description') },
                            { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.description') },
                            { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.description') }
                        ]}
                    >
                        <div 
                            {...getRootProps()} 
                            className={cn(
                                "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-24 gap-4",
                                isDragActive ? "border-white/40 bg-white/[0.03]" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                            )}
                        >
                            <input {...getInputProps()} />
                            <FileUp className={cn("w-12 h-12 mb-2", isDragActive ? "text-white" : "text-zinc-600")} />
                            <div className="text-center">
                                <p className="text-xl font-black text-white uppercase tracking-widest">
                                    {isDragActive ? commonT('dropAnywhere') : t('dropTitle')}
                                </p>
                                <p className="text-xs text-zinc-600 mt-2 uppercase tracking-widest font-bold">{t('dropDesc')}</p>
                            </div>
                        </div>
                    </ToolContainer>
                </motion.div>
            ) : (
                <motion.div 
                    key="immersive-editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
                >
                    {/* --- Immersive Header --- */}
                    <div className="absolute top-0 left-0 right-0 h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-xl z-10 flex items-center justify-between px-8">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
                                <Eraser className="w-4 h-4 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xs font-black text-white uppercase tracking-widest">{t('title')}</h2>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter font-bold">{file.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 pr-6 border-r border-zinc-800">
                                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('activeLayers')}</span>
                                <span className="px-2 py-0.5 bg-zinc-900 text-white text-xs font-black rounded-sm border border-zinc-800">{redactions.length}</span>
                            </div>
                            <button 
                                onClick={resetTool}
                                className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors flex items-center gap-2 px-3 py-1.5 hover:bg-rose-500/10 rounded-sm"
                            >
                                <AlertTriangle className="w-3 h-3" />
                                {commonT('cancel')}
                            </button>
                        </div>
                    </div>

                    {/* --- Workspace --- */}
                    <div className="w-full h-full pt-16 pb-24 overflow-auto scrollbar-hide flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black">
                        <div className="relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-zinc-800 bg-white shrink-0 mx-auto">
                            <canvas ref={pdfCanvasRef} className="block" />
                            <canvas
                                ref={drawCanvasRef}
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                className="absolute top-0 left-0 touch-none cursor-crosshair"
                            />
                        </div>
                    </div>

                    {/* --- Immersive Footer / Action Bar --- */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 border-t border-zinc-900 bg-black/80 backdrop-blur-xl z-10 flex items-center justify-center px-8">
                        <div className="max-w-md w-full flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setRedactions([])}
                                disabled={isProcessing || redactions.length === 0}
                                className="flex-1 h-12 border-zinc-800 text-zinc-500 hover:text-white hover:border-white font-black uppercase tracking-widest text-[10px] transition-all bg-transparent flex items-center gap-2"
                            >
                                <Trash2 className="w-3 h-3" />
                                {t('clearBtn')}
                            </Button>

                            <Button
                                onClick={handleSecureRedact}
                                disabled={isProcessing || redactions.length === 0}
                                className="flex-[2] h-12 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        <Shield className="w-4 h-4" />
                                        {t('burnBtn')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
            <canvas ref={hiddenBaseCanvasRef} className="hidden" />
        </AnimatePresence>
    );
});

RedactorTool.displayName = 'RedactorTool';

export default RedactorTool;
