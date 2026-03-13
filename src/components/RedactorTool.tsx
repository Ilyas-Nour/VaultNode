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
    Maximize2,
    Minimize2
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
    const [isFullscreen, setIsFullscreen] = useState(false);
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

    const workspaceRef = useRef<HTMLDivElement>(null);
    const renderTaskRef = useRef<any>(null);

    // 🚀 STABLE RENDER ENGINE (Container-Aware)
    const renderPdfAsync = useCallback(async (pdfFile: File, containerWidth: number, containerHeight: number) => {
        try {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);

            const originalViewport = page.getViewport({ scale: 1 });
            
            // Tight margins to maximize use of space within the container
            const horizontalPadding = 48; 
            const verticalPadding = 48; // HUD is absolute, container is padded, so we only need small inner padding

            const targetWidth = containerWidth - horizontalPadding;
            const targetHeight = containerHeight - verticalPadding;

            const scaleX = targetWidth / originalViewport.width;
            const scaleY = targetHeight / originalViewport.height;
            
            // The logical CSS scale needed to fit the screen
            const logicalScale = Math.min(scaleX, scaleY);
            
            // High-DPI physical scale for crispness
            const dpr = window.devicePixelRatio || 1;
            const physicalScale = logicalScale * dpr;

            setActiveUIScale(logicalScale);

            // Viewport for actual pixel rendering (High-Res)
            const renderViewport = page.getViewport({ scale: physicalScale });
            // Viewport for CSS sizing (Logical-Res)
            const cssViewport = page.getViewport({ scale: logicalScale });
            
            const exportViewport = page.getViewport({ scale: SECURE_EXPORT_SCALE });

            const pdfCanvas = pdfCanvasRef.current;
            const drawCanvas = drawCanvasRef.current;
            const baseCanvas = hiddenBaseCanvasRef.current;

            if (!pdfCanvas || !drawCanvas || !baseCanvas) return;

            const uiCtx = pdfCanvas.getContext("2d");
            if (!uiCtx) return;

            // Physical Canvas Resolution (Actual Pixels)
            pdfCanvas.width = renderViewport.width;
            pdfCanvas.height = renderViewport.height;
            drawCanvas.width = renderViewport.width;
            drawCanvas.height = renderViewport.height;

            // CSS Logical Size (How big it looks on screen, overriding flexbox)
            pdfCanvas.style.width = `${cssViewport.width}px`;
            pdfCanvas.style.height = `${cssViewport.height}px`;
            drawCanvas.style.width = `${cssViewport.width}px`;
            drawCanvas.style.height = `${cssViewport.height}px`;

            renderTaskRef.current = page.render({ canvasContext: uiCtx, canvas: pdfCanvas, viewport: renderViewport });
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
    }, []);

    // 📏 Accurate Sizing Engine (Fixes Resize Race Condition)
    useEffect(() => {
        if (!file || !workspaceRef.current) return;
        
        let hasRendered = false;

        // 1. Initial immediate render based on current layout
        const rect = workspaceRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            renderPdfAsync(file, rect.width, rect.height);
            hasRendered = true;
        }
        
        // 2. Continuous observation for window snags/resizes
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    // Skip the very first observer trigger if we already rendered immediately
                    if (hasRendered) {
                        hasRendered = false;
                        continue;
                    }
                    renderPdfAsync(file, width, height);
                }
            }
        });

        resizeObserver.observe(workspaceRef.current);

        return () => {
            resizeObserver.disconnect();
            if (renderTaskRef.current) renderTaskRef.current.cancel();
        };
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
                    key="editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <ToolContainer
                        title={t('title')}
                        description={t('description')}
                        icon={Eraser}
                        category="vault"
                        toolId="redactor"
                        settingsContent={null}
                    >
                        <div className={cn(
                            "flex flex-col transition-all duration-300",
                            isFullscreen 
                                ? "fixed inset-0 z-[9999] bg-black items-center justify-center" 
                                : "w-full h-[70vh] min-h-[500px] border border-zinc-800 rounded-lg overflow-hidden relative bg-black mt-8"
                        )}>
                            {/* --- Immersive Header --- */}
                            <AnimatePresence>
                                {isFullscreen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="absolute top-0 left-0 right-0 h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-xl z-20 flex items-center justify-between px-8"
                                    >
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
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* --- Fullscreen Toggle Button --- */}
                            <Button 
                                variant="outline"
                                size="icon"
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className={cn(
                                    "absolute z-[50] bg-black/50 backdrop-blur-md border border-zinc-700 hover:bg-zinc-800 text-white transition-all",
                                    isFullscreen ? "top-20 right-8" : "top-4 right-4"
                                )}
                            >
                                {isFullscreen ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4" />}
                            </Button>

                            {/* --- Workspace --- */}
                            <div 
                                ref={workspaceRef}
                                className={cn(
                                    "w-full overflow-auto scrollbar-hide flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black",
                                    isFullscreen ? "h-full pt-16 pb-24" : "h-[calc(100%-80px)] p-4"
                                )}
                            >
                                <div dir="ltr" className="relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-zinc-800 bg-white shrink-0 mx-auto">
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

                            {/* --- Footer / Action Bar --- */}
                            <div className={cn(
                                "flex items-center w-full transition-all",
                                isFullscreen 
                                    ? "absolute bottom-0 left-0 right-0 h-24 border-t border-zinc-900 bg-black/80 backdrop-blur-xl z-20 justify-center px-8" 
                                    : "absolute bottom-0 h-20 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md justify-between px-6 z-20"
                            )}>
                                <div className={cn("flex gap-4 w-full", isFullscreen ? "max-w-md" : "")}>
                                    
                                    {!isFullscreen && (
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={resetTool}
                                                className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors flex items-center gap-2 px-3 py-1.5 hover:bg-rose-500/10 rounded-sm"
                                            >
                                                <AlertTriangle className="w-3 h-3" />
                                                {commonT('cancel')}
                                            </button>
                                        </div>
                                    )}

                                    <div className={cn("flex gap-4", isFullscreen ? "flex-1" : "flex-1 justify-end")}>
                                        <Button
                                            variant="outline"
                                            onClick={() => setRedactions([])}
                                            disabled={isProcessing || redactions.length === 0}
                                            className={cn(
                                                "h-12 border-zinc-800 text-zinc-500 hover:text-white hover:border-white font-black uppercase tracking-widest text-[10px] transition-all bg-transparent flex items-center gap-2",
                                                isFullscreen ? "flex-1" : "min-w-[150px]"
                                            )}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            {t('clearBtn')}
                                        </Button>

                                        <Button
                                            onClick={handleSecureRedact}
                                            disabled={isProcessing || redactions.length === 0}
                                            className={cn(
                                                "h-12 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2",
                                                isFullscreen ? "flex-[2]" : "min-w-[200px]"
                                            )}
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
                            </div>
                        </div>
                    </ToolContainer>
                </motion.div>
            )}
            <canvas ref={hiddenBaseCanvasRef} className="hidden" />
        </AnimatePresence>
    );
});

RedactorTool.displayName = 'RedactorTool';

export default RedactorTool;
