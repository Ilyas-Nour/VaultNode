/**
 * 👤 SUBJECT ISOLATION | Local Background Remover
 * ---------------------------------------------------------
 * A WASM-powered engine for isolating subjects and removing
 * backgrounds entirely within the browser Sandbox.
 * 
 * Logic: AI Edge Detection (Local Inference)
 * Performance: Resource-Intensive (Local Model)
 * Aesthetics: Industrial-Steel / Emerald-Glow
 */

"use client";

import React, { useState, useCallback, useRef, memo, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from 'next-intl';
import {
    Loader2, Download, RefreshCw,
    UserCircle, FileUp, Shield, Image as ImageIcon,
    Maximize2, Minimize2, Settings, Undo2, Redo2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { removeBackground, Config } from "@imgly/background-removal";

/**
 * 👤 BackgroundRemoverTool Component
 * The primary utility for local background removal.
 */
const BackgroundRemoverTool = memo(() => {
    const t = useTranslations('Tools.bgRemover');
    const commonT = useTranslations('Tools.common');

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [exportBlob, setExportBlob] = useState<Blob | null>(null);
    const [exportUrl, setExportUrl] = useState<string | null>(null);
    const [modelType, setModelType] = useState<'isnet' | 'isnet_fp16' | 'isnet_quint8'>('isnet_fp16');
    
    // -- Immersive States --
    const [isImmersive, setIsImmersive] = useState(false);
    
    // -- Refinement States --
    const [isRefining, setIsRefining] = useState(false);
    const [brushSize, setBrushSize] = useState(30);
    const [refineMode, setRefineMode] = useState<'erase' | 'restore'>('erase');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
    const [isolatedImage, setIsolatedImage] = useState<HTMLImageElement | null>(null);
    
    // -- History States --
    const [undoStack, setUndoStack] = useState<ImageData[]>([]);
    const [redoStack, setRedoStack] = useState<ImageData[]>([]);

    // -- Cursor Tracking --
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const f = acceptedFiles[0];
            setFile(f);
            setPreviewUrl(URL.createObjectURL(f));
            setExportBlob(null);
            setExportUrl(null);
            setIsRefining(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        maxFiles: 1
    });

    /**
     * ⚡ Removal Engine
     * Executes the local WASM model to strip the background.
     */
    const handleRemove = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const blob = await removeBackground(file, {
                model: modelType,
                rescale: true,
                output: {
                    format: 'image/png',
                    quality: 1.0
                },
                progress: (key: string, current: number, total: number) => {
                    console.log(`Removal progress: ${key} ${current}/${total}`);
                }
            } as any);
            
            setExportBlob(blob);
            setExportUrl(URL.createObjectURL(blob));
            
            // Prepare images for refinement
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => setOriginalImage(img);
            
            const iso = new Image();
            iso.src = URL.createObjectURL(blob);
            iso.onload = () => setIsolatedImage(iso);

            setIsProcessing(false);
        } catch (error) {
            console.error("Background removal error:", error);
            setIsProcessing(false);
        }
    }, [file, modelType]);

    // -- Refinement Logic --
    const lastPos = useRef<{ x: number, y: number } | null>(null);

    const saveHistory = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setUndoStack(prev => [...prev, snapshot]);
        setRedoStack([]); // Clear redo on new action
    }, []);

    const handleUndo = useCallback(() => {
        if (undoStack.length === 0 || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setRedoStack(prev => [...prev, currentSnapshot]);

        const prevSnapshot = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));
        ctx.putImageData(prevSnapshot, 0, 0);
    }, [undoStack]);

    const handleRedo = useCallback(() => {
        if (redoStack.length === 0 || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setUndoStack(prev => [...prev, currentSnapshot]);

        const nextSnapshot = redoStack[redoStack.length - 1];
        setRedoStack(prev => prev.slice(0, -1));
        ctx.putImageData(nextSnapshot, 0, 0);
    }, [redoStack]);

    const startDrawing = (e: React.PointerEvent) => {
        saveHistory();
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        lastPos.current = {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        lastPos.current = null;
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
    };

    const draw = (e: React.PointerEvent) => {
        if (!isDrawing || !canvasRef.current || !isRefining || !lastPos.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        // Update cursor position
        setMousePos({ x: e.clientX, y: e.clientY });

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (refineMode === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.beginPath();
            ctx.moveTo(lastPos.current.x, lastPos.current.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            ctx.globalCompositeOperation = 'source-over';
            // Smooth restore using interpolation
            const dist = Math.sqrt(Math.pow(x - lastPos.current.x, 2) + Math.pow(y - lastPos.current.y, 2));
            const angle = Math.atan2(y - lastPos.current.y, x - lastPos.current.x);
            
            for (let i = 0; i < dist; i += brushSize / 4) {
                const _x = lastPos.current.x + Math.cos(angle) * i;
                const _y = lastPos.current.y + Math.sin(angle) * i;
                ctx.save();
                ctx.beginPath();
                ctx.arc(_x, _y, brushSize / 2, 0, Math.PI * 2);
                ctx.clip();
                if (originalImage) {
                    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
                }
                ctx.restore();
            }
        }

        lastPos.current = { x, y };
    };

    const handleApplyRefine = () => {
        if (!canvasRef.current) return;
        canvasRef.current.toBlob((blob) => {
            if (blob) {
                setExportBlob(blob);
                if (exportUrl) URL.revokeObjectURL(exportUrl);
                const newUrl = URL.createObjectURL(blob);
                setExportUrl(newUrl);
                
                const iso = new Image();
                iso.src = newUrl;
                iso.onload = () => setIsolatedImage(iso);
            }
            setIsRefining(false);
        }, 'image/png');
    };

    const initRefineCanvas = useCallback(() => {
        if (!isolatedImage) return;
        setIsRefining(true);
    }, [isolatedImage]);

    const handleToggleImmersive = useCallback(() => {
        if (!isImmersive) {
            if (!isRefining) initRefineCanvas();
            setIsImmersive(true);
        } else {
            setIsImmersive(false);
        }
    }, [isImmersive, isRefining, initRefineCanvas]);

    // Initialize canvas after it mounts
    useEffect(() => {
        if (isRefining && isolatedImage && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Use a smaller scale for display but maintain internal resolution?
                // Actually, let's just stick to isolatedImage dimensions for fidelity
                canvas.width = isolatedImage.width;
                canvas.height = isolatedImage.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(isolatedImage, 0, 0);
            }
        }
    }, [isRefining, isolatedImage, isImmersive]);

    const handleDownload = useCallback(() => {
        if (!exportUrl || !file) return;
        const link = document.createElement("a");
        link.href = exportUrl;
        link.download = `isolated_${file.name.split('.')[0]}.png`;
        link.click();
    }, [exportUrl, file]);

    const resetTool = useCallback(() => {
        setFile(null);
        setPreviewUrl(null);
        setExportBlob(null);
        setExportUrl(null);
        setIsRefining(false);
    }, []);

    const howItWorks = useMemo(() => [
        { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.desc') },
        { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.desc') },
        { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.desc') }
    ], [t]);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={UserCircle}
            category="media"
            toolId="bg-remover"
            settingsContent={
                <div className="space-y-6">
                    <div className="flex items-center justify-between pt-4">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">{t('mode')}</span>
                        <div className="flex gap-1.5">
                            {[
                                { id: 'isnet_quint8', label: 'Fast' },
                                { id: 'isnet_fp16', label: 'Balanced' },
                                { id: 'isnet', label: 'Ultra' }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setModelType(m.id as any)}
                                    className={cn(
                                        "px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                        modelType === m.id ? "bg-emerald-500 text-emerald-950" : "bg-zinc-900 text-zinc-500 hover:text-white"
                                    )}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3.5">
                        <Button
                            onClick={handleRemove}
                            disabled={!file || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5 me-2" />}
                            {isProcessing ? t('processing') : t('applyBtn')}
                        </Button>

                        {exportUrl && !isRefining && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={handleDownload}
                                    className="h-12 bg-white text-black hover:bg-zinc-200 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all shadow-xl"
                                >
                                    <Download className="w-4 h-4 me-2" />
                                    {t('downloadBtn')}
                                </Button>
                                <Button
                                    onClick={initRefineCanvas}
                                    className="h-12 bg-zinc-800 text-white hover:bg-zinc-700 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all"
                                >
                                    {t('refineBtn')}
                                </Button>
                            </div>
                        )}

                        {isRefining && (
                            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('refine')}</span>
                                    <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg">
                                        <button
                                            onClick={() => setRefineMode('erase')}
                                            className={cn(
                                                "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all",
                                                refineMode === 'erase' ? "bg-emerald-500 text-emerald-950" : "text-zinc-600 hover:text-white"
                                            )}
                                        >
                                            {t('erase')}
                                        </button>
                                        <button
                                            onClick={() => setRefineMode('restore')}
                                            className={cn(
                                                "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all",
                                                refineMode === 'restore' ? "bg-emerald-500 text-emerald-950" : "text-zinc-600 hover:text-white"
                                            )}
                                        >
                                            {t('restore')}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                                        <span>{t('brushSize')}</span>
                                        <span>{brushSize}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="100"
                                        value={brushSize}
                                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                        className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{t('history')}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUndo}
                                            disabled={undoStack.length === 0}
                                            className="p-2 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                                        >
                                            <Undo2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleRedo}
                                            disabled={redoStack.length === 0}
                                            className="p-2 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                                        >
                                            <Redo2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Button
                                        onClick={handleApplyRefine}
                                        className="h-10 bg-emerald-500 text-emerald-950 hover:bg-emerald-400 font-black rounded-lg text-[10px] uppercase tracking-widest"
                                    >
                                        {t('saveRefine')}
                                    </Button>
                                    <Button
                                        onClick={() => setIsRefining(false)}
                                        variant="ghost"
                                        className="h-10 text-zinc-500 hover:text-white font-black rounded-lg text-[10px] uppercase tracking-widest"
                                    >
                                        {commonT('cancel')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {file && (
                            <Button
                                variant="ghost"
                                onClick={resetTool}
                                className="w-full h-10 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest italic tracking-[0.15em]"
                            >
                                {t('resetBtn')}
                            </Button>
                        )}
                    </div>

                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-3.5 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{t('sandbox')}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                            {t('sandboxDesc')}
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[420px] flex flex-col items-center justify-center p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl"
                        >
                            <div className="relative group/dropzone w-full">
                                <AnimatePresence>
                                    {isDragActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse rounded-[2.7rem] blur-md -z-10"
                                        />
                                    )}
                                </AnimatePresence>
                                <div
                                    {...getRootProps()}
                                    className={cn(
                                        "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-10 gap-4",
                                        isDragActive ? "border-white/40 bg-white/[0.03]" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <FileUp className={cn("w-8 h-8", isDragActive ? "text-white" : "text-zinc-600")} />
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white uppercase tracking-widest">
                                            {isDragActive ? commonT('dropAnywhere') : t('dropTitle')}
                                        </p>
                                        <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">{t('dropDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('original')}</span>
                                    <div className="bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-900">
                                        <ImageIcon className="w-3.5 h-3.5 text-zinc-700" />
                                    </div>
                                </div>
                                <div className="aspect-square rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden relative shadow-2xl backdrop-blur-sm">
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            className="w-full h-full object-contain mix-blend-lighten opacity-80 p-4"
                                            alt="Original"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 italic">{t('output')}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2.5 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors group/eye">
                                                <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-tighter">{t('monitor')}</span>
                                                <UserCircle className="w-3.5 h-3.5 text-emerald-500 animate-pulse group-hover/eye:scale-110 transition-transform" />
                                            </div>
                                            {exportUrl && (
                                                <button
                                                    onClick={handleToggleImmersive}
                                                    className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-white transition-colors"
                                                    title={t('fullScreen')}
                                                >
                                                    <Maximize2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                </div>
                                <div className="aspect-square rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/10 overflow-hidden relative shadow-[0_40px_80px_-20px_rgba(16,185,129,0.1)] transition-all duration-700 hover:border-emerald-500/40 group bg-checkerboard">
                                    {exportUrl ? (
                                        <div className="w-full h-full relative p-4 group">
                                            {isRefining && !isImmersive ? (
                                                <div 
                                                    className="w-full h-full relative cursor-none"
                                                    onPointerMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                                                    onPointerLeave={() => setMousePos({ x: -100, y: -100 })}
                                                >
                                                    <canvas
                                                        ref={canvasRef}
                                                        onPointerDown={startDrawing}
                                                        onPointerMove={draw}
                                                        onPointerUp={stopDrawing}
                                                        onPointerLeave={stopDrawing}
                                                        className="w-full h-full object-contain touch-none relative z-20"
                                                    />
                                                    {/* Brush Cursor */}
                                                    <div 
                                                        className="fixed pointer-events-none z-[100] rounded-full border border-white/50 bg-white/10 backdrop-blur-[2px] shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                                        style={{
                                                            left: mousePos.x,
                                                            top: mousePos.y,
                                                            width: brushSize,
                                                            height: brushSize,
                                                            transform: 'translate(-50%, -50%)',
                                                            display: mousePos.x === -100 ? 'none' : 'block'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <img
                                                    src={exportUrl}
                                                    className="w-full h-full object-contain transition-all duration-500 transform scale-[1.05] group-hover:scale-[1.02]"
                                                    alt="Removed Background"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-40">
                                            <div className="w-32 h-32 bg-zinc-900 border border-zinc-800 rounded-3xl animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{t('encoding')}</span>
                                        </div>
                                    )}

                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl flex flex-col items-center justify-center gap-5 transition-all animate-in fade-in duration-500">
                                            <div className="relative">
                                                <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin relative" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 animate-pulse">{t('processing')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2 flex items-center justify-center gap-12 py-6 bg-zinc-900/80 border border-zinc-800 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl mt-4">
                                <div className="flex items-center gap-3.5 transition-all hover:scale-105">
                                    <div className="w-2.5 rounded-full h-2.5 bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest italic">{t('protocol')}</span>
                                </div>
                                <div className="w-px h-6 bg-zinc-800" />
                                <div className="flex items-center gap-3.5 transition-all hover:scale-105">
                                    <div className="w-2.5 rounded-full h-2.5 bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ animationDelay: '0.2s' }} />
                                    <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest italic">{t('integrity')}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* -- Immersive Overlay -- */}
            <AnimatePresence>
                {isImmersive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col md:flex-row overflow-hidden isolate"
                    >
                        {/* Immersive Header (Mobile) */}
                        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl z-20">
                            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 italic">{t('fullScreen')}</span>
                            <Button
                                variant="ghost"
                                onClick={() => setIsImmersive(false)}
                                className="h-8 text-zinc-500 hover:text-white text-[10px] font-black uppercase"
                            >
                                {commonT('cancel')}
                            </Button>
                        </div>

                        {/* Immersive Canvas Workspace */}
                        <div 
                            className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden bg-checkerboard cursor-none"
                            onPointerMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                            onPointerLeave={() => setMousePos({ x: -100, y: -100 })}
                        >
                            {isRefining ? (
                                <>
                                    <canvas
                                        ref={canvasRef}
                                        onPointerDown={startDrawing}
                                        onPointerMove={draw}
                                        onPointerUp={stopDrawing}
                                        onPointerLeave={stopDrawing}
                                        className="max-w-full max-h-full object-contain touch-none shadow-2xl z-10"
                                    />
                                    {/* Brush Cursor (Full Screen) */}
                                    <div 
                                        className="fixed pointer-events-none z-[110] rounded-full border border-white/80 bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                        style={{
                                            left: mousePos.x,
                                            top: mousePos.y,
                                            // Scale brush preview based on container scale? 
                                            // Simple CSS approach for now:
                                            width: brushSize, 
                                            height: brushSize,
                                            transform: 'translate(-50%, -50%)',
                                            display: mousePos.x === -100 ? 'none' : 'block'
                                        }}
                                    />
                                </>
                            ) : (
                                <img
                                    src={exportUrl || ''}
                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                    alt="Full Preview"
                                />
                            )}
                            
                            {/* Immersive Controls Tooltip */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 px-6 py-2.5 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-full z-20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('fullScreen')}</span>
                                <div className="w-px h-3 bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">{t('sandbox')}</span>
                            </div>
                        </div>

                        {/* Immersive Sidebar (Desktop) / HUD (Mobile) */}
                        <motion.aside
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            className="w-full md:w-80 h-auto md:h-full bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-900 p-6 md:p-8 flex flex-col gap-8 z-30"
                        >
                            <div className="hidden md:flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Settings className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white leading-none">{t('settings')}</h3>
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{t('refine')}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">{t('brushSize')}</span>
                                        <span className="text-[10px] font-black text-emerald-500">{brushSize}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="150"
                                        value={brushSize}
                                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                        className="w-full accent-emerald-500 h-1.5 bg-zinc-900 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-900">
                                    <button
                                        onClick={() => setRefineMode('erase')}
                                        className={cn(
                                            "h-10 flex items-center justify-center rounded-xl transition-all gap-2 border",
                                            refineMode === 'erase' 
                                                ? "bg-emerald-500 border-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/20" 
                                                : "bg-transparent border-transparent text-zinc-500 hover:text-white"
                                        )}
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('erase')}</span>
                                    </button>
                                    <button
                                        onClick={() => setRefineMode('restore')}
                                        className={cn(
                                            "h-10 flex items-center justify-center rounded-xl transition-all gap-2 border",
                                            refineMode === 'restore' 
                                                ? "bg-emerald-500 border-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/20" 
                                                : "bg-transparent border-transparent text-zinc-500 hover:text-white"
                                        )}
                                    >
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('restore')}</span>
                                    </button>
                                </div>

                                <div className="space-y-4 border-t border-zinc-900 pt-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">{t('history')}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleUndo}
                                                disabled={undoStack.length === 0}
                                                className="p-3 rounded-xl bg-zinc-900 text-zinc-500 hover:text-white disabled:opacity-30 transition-all active:scale-95"
                                            >
                                                <Undo2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={handleRedo}
                                                disabled={redoStack.length === 0}
                                                className="p-3 rounded-xl bg-zinc-900 text-zinc-500 hover:text-white disabled:opacity-30 transition-all active:scale-95"
                                            >
                                                <Redo2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto space-y-3">
                                <Button
                                    onClick={handleApplyRefine}
                                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black rounded-xl text-[11px] uppercase tracking-widest italic"
                                >
                                    {t('saveRefine')}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsImmersive(false)}
                                    className="w-full h-10 text-zinc-500 hover:text-red-400 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-colors"
                                >
                                    {t('exitEditor')}
                                </Button>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </ToolContainer>
    );
});

BackgroundRemoverTool.displayName = 'BackgroundRemoverTool';

export default BackgroundRemoverTool;
