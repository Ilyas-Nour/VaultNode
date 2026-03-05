/**
 * 🖼️ PRIVAFLOW | Secure Image Optimizer
 * ---------------------------------------------------------
 * A surgical, multithreaded compression engine for high-performance
 * asset optimization. Reduces bit-density without compromising
 * structural visual integrity.
 * 
 * Logic: Parallelized Browser Compression (Web Workers)
 * Performance: Peak (Fully Memoized State & Debounced Pipeline)
 * Aesthetics: Media-Industrial / Emerald-Tactile
 */

"use client";

import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import {
    Image as ImageIcon,
    Download,
    Loader2,
    Trash2,
    Zap,
    HardDrive,
    Info,
    ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface CompressionResult {
    originalUrl: string;
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    fileName: string;
}

/**
 * 🖼️ ImageCompressor Component
 * The definitive utility for local, zero-upload image optimization.
 * Orchestrates Web Workers to perform non-blocking pixel reduction.
 */
const ImageCompressor = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.compress");

    // 📂 STATE ORCHESTRATION
    const [file, setFile] = useState<File | null>(null);
    const [targetSizeMB, setTargetSizeMB] = useState(1.0);
    const [result, setResult] = useState<CompressionResult | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    /**
     * 📏 High-Precision Byte Formatter
     */
    const formatSize = useCallback((bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }, []);

    /**
     * ⚡ Compression Engine (High-Performance)
     * Handles the heavy lifting of bit-reduction via multithreaded Web Workers.
     * Logic: non-blocking asset reconstruction.
     */
    const handleCompression = useCallback(async (imgFile: File, targetSize: number) => {
        setIsCompressing(true);
        try {
            const options = {
                maxSizeMB: targetSize,
                maxWidthOrHeight: 2560, // Increased for 4K source integrity
                useWebWorker: true,
                initialQuality: 0.85,
            };

            const compressedFile = await imageCompression(imgFile, options);

            const originalUrl = URL.createObjectURL(imgFile);
            const compressedUrl = URL.createObjectURL(compressedFile);

            setResult({
                originalUrl,
                compressedUrl,
                originalSize: imgFile.size,
                compressedSize: compressedFile.size,
                fileName: imgFile.name
            });
        } catch (error) {
            console.error("Industrial Compression failure:", error);
        } finally {
            setIsCompressing(false);
        }
    }, []);

    /**
     * 🛰️ Event Listeners & Pipeline
     */
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            handleCompression(acceptedFiles[0], targetSizeMB);
        }
    }, [handleCompression, targetSizeMB]);

    // Pipeline Debounce: Stabilizes compression calls during slider manipulation
    useEffect(() => {
        if (file) {
            const timeout = setTimeout(() => {
                handleCompression(file, targetSizeMB);
            }, 450);
            return () => clearTimeout(timeout);
        }
    }, [file, targetSizeMB, handleCompression]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        multiple: false
    });

    const clear = useCallback(() => {
        setFile(null);
        setResult(null);
        setIsCompressing(false);
    }, []);

    const downloadResult = useCallback(() => {
        if (!result) return;
        const link = document.createElement("a");
        link.href = result.compressedUrl;
        link.download = `vaultnode-optimized-${result.fileName}`;
        link.click();
    }, [result]);

    /**
     * 📊 Dynamic Yield Metrics
     */
    const savingsPercent = useMemo(() => {
        if (!result) return 0;
        const savings = Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100);
        return savings > 0 ? savings : 0;
    }, [result]);

    /**
     * 📦 Metadata Registry
     */
    const howItWorks = useMemo(() => [
        { title: "Multithreaded Logic", description: "Orchestrates parallel Web Workers for zero-latency asset reconstruction." },
        { title: "Private Sandbox", description: "100% Client-side. Your visual data remains isolated in memory." },
        { title: "Adaptive Downsampling", description: "Dynamically maps bit-density to meet specific target metrics." }
    ], []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={ImageIcon}
            category="media"
            toolId="compress"
            settingsContent={
                <div className="space-y-8">
                    {/* 🎚️ TARGET OPTIMIZATION CONTROL */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">
                            <span>Target Threshold</span>
                            <span className="text-emerald-500 tabular-nums text-sm">{targetSizeMB.toFixed(1)} MB</span>
                        </div>
                        <Slider
                            value={[targetSizeMB]}
                            min={0.1}
                            max={5.0}
                            step={0.1}
                            onValueChange={(val) => setTargetSizeMB(val[0])}
                            className="py-4 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] font-black text-zinc-600 uppercase tracking-[0.1em]">
                            <span>{t('aggressive')}</span>
                            <span>{t('balanced')}</span>
                        </div>
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3.5">
                        <Button
                            onClick={downloadResult}
                            disabled={!result || isCompressing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
                        >
                            <Download className="w-4 h-4 me-2" />
                            {t('downloadSecurely')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={clear}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[11px] font-black uppercase tracking-widest italic transition-all rounded-xl"
                        >
                            <Trash2 className="w-4 h-4 me-2" />
                            Purge Buffer
                        </Button>
                    </div>

                    {/* 📊 OPTIMIZATION REPORT */}
                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-3.5 shadow-inner">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Info className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500/80">Optimization Protocol</span>
                        </div>
                        {result ? (
                            <div className="space-y-2.5">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-zinc-600 uppercase">Yield Saved:</span>
                                    <span className="text-emerald-500 text-sm">-{savingsPercent}%</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-zinc-600 uppercase">Final Payload:</span>
                                    <span className="text-zinc-400 tabular-nums">{formatSize(result.compressedSize)}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[11px] text-zinc-500 font-bold leading-relaxed pr-2 italic uppercase tracking-tight">
                                Initializing parallel Web Workers for atomic image reconstruction.
                            </p>
                        )}
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[420px] flex flex-col items-center justify-center p-6 md:p-10">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl"
                        >
                            {/* 🛸 DROPZONE ARCHITECTURE */}
                            <div className="relative group/dropzone w-full">
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
                                    <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl group-hover/dropzone:scale-110 transition-transform duration-500">
                                        <ImageIcon className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tight mb-2">{t('dropTitle')}</h3>
                                    <p className="text-zinc-500 text-sm lg:text-base font-bold uppercase tracking-widest text-center px-4">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col items-center space-y-8"
                        >
                            {/* 🖼️ COMPARISON VIEWPORT */}
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Original View */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">
                                        <span>Raw Buffer</span>
                                        <span className="bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-900">{formatSize(file.size)}</span>
                                    </div>
                                    <div className="aspect-square rounded-[2rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden relative flex items-center justify-center group shadow-2xl">
                                        <img
                                            src={result?.originalUrl || URL.createObjectURL(file)}
                                            className="w-full h-full object-contain grayscale opacity-30 contrast-125 transition-all duration-700 group-hover:opacity-50"
                                            alt="Original Stream"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-10 text-white -rotate-12 translate-y-6">
                                                Bit-Hard Copy
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Optimized View */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2 text-[11px] font-black uppercase tracking-widest text-emerald-500 italic">
                                        <span>Optimized Cluster</span>
                                        <div className="flex items-center gap-2">
                                            {result && <span className="bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 text-[10px]">-{savingsPercent}%</span>}
                                            <span className="tabular-nums">{formatSize(result?.compressedSize || 0)}</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "aspect-square rounded-[2rem] border overflow-hidden relative flex flex-col items-center justify-center transition-all duration-700 shadow-2xl",
                                        isCompressing ? "bg-zinc-900 border-zinc-800" : "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)]"
                                    )}>
                                        {result && !isCompressing ? (
                                            <img
                                                src={result.compressedUrl}
                                                className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-1000 p-6"
                                                alt="Optimized Stream"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-6 text-emerald-500">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-ping" />
                                                    <Loader2 className="w-12 h-12 animate-spin relative z-10" />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-[0.25em] animate-pulse">{t('processing')}</span>
                                            </div>
                                        )}

                                        {result && !isCompressing && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-500">
                                                <Button
                                                    onClick={downloadResult}
                                                    className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-xl uppercase italic tracking-tight"
                                                >
                                                    <Download className="w-6 h-6 me-4" />
                                                    {t('downloadSecurely')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 📟 FLOW MONITOR */}
                            <div className="flex items-center gap-10 px-10 py-5 bg-zinc-900/80 border border-zinc-800 rounded-[2rem] shadow-2xl backdrop-blur-md">
                                <div className="flex flex-col items-center gap-2 grayscale opacity-50">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Source Node</span>
                                    <HardDrive className="w-5 h-5 text-zinc-500" />
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <ArrowRightLeft className="w-5 h-5 text-emerald-500 animate-pulse" />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">Vault Registry</span>
                                    <Zap className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

ImageCompressor.displayName = 'ImageCompressor';

export default ImageCompressor;
