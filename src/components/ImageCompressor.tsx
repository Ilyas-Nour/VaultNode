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
        { title: 'Drop Your Image', description: 'Pick any JPG, PNG, or WebP photo. It stays completely on your device — nothing is sent to a server.' },
        { title: 'Set the Target Size', description: 'Use the slider to choose how small you’d like the file to be. Lower means a smaller file, higher keeps more quality.' },
        { title: 'Download the Compressed File', description: 'Your image is ready instantly. Download it and it’ll look great while taking up much less space.' }
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
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
                            <span>Target Size</span>
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
                    <div className="space-y-3">
                        <button
                            onClick={downloadResult}
                            disabled={!result || isCompressing}
                            className="w-full h-10 bg-white hover:bg-zinc-100 disabled:opacity-40 text-black font-black rounded-sm text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download Compressed Image
                        </button>

                        <button
                            onClick={clear}
                            className="w-full h-10 border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                        >
                            <Trash2 className="w-3.5 h-3.5 inline mr-2" />
                            Clear
                        </button>
                    </div>

                    {/* 📊 OPTIMIZATION REPORT */}
                    <div className="border border-zinc-800 bg-zinc-950 space-y-3 p-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Result</span>
                        {result ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-zinc-500 uppercase">Space Saved:</span>
                                    <span className="text-emerald-400 text-sm">-{savingsPercent}%</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-zinc-500 uppercase">Final Size:</span>
                                    <span className="text-zinc-300 tabular-nums">{formatSize(result.compressedSize)}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                Drop an image to see the compression results here.
                            </p>
                        )}
                    </div>
                </div>
            }
            howItWorks={howItWorks}
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
                                    "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-10 gap-4",
                                    isDragActive
                                        ? "border-white/40 bg-white/[0.03]"
                                        : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                                )}
                            >
                                <input {...getInputProps()} />
                                <ImageIcon className={cn("w-8 h-8", isDragActive ? "text-white" : "text-zinc-600")} />
                                <div className="text-center">
                                    <p className="text-sm font-bold text-white uppercase tracking-widest">
                                        {isDragActive ? 'Drop it here' : 'Drop your image here'}
                                    </p>
                                    <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">JPG · PNG · WebP</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col gap-6"
                        >
                            {/* Before / After */}
                            <div className="w-full grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                        <span>Original</span>
                                        <span className="tabular-nums">{formatSize(file.size)}</span>
                                    </div>
                                    <div className="aspect-square bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center">
                                        <img
                                            src={result?.originalUrl || URL.createObjectURL(file)}
                                            className="w-full h-full object-contain"
                                            alt="Original"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white">
                                        <span>Compressed</span>
                                        <div className="flex items-center gap-2">
                                            {result && <span className="text-emerald-400">-{savingsPercent}%</span>}
                                            <span className="tabular-nums text-zinc-400">{formatSize(result?.compressedSize || 0)}</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "aspect-square border overflow-hidden flex items-center justify-center transition-all",
                                        isCompressing ? "bg-zinc-900 border-zinc-800" : "bg-zinc-950 border-zinc-700"
                                    )}>
                                        {result && !isCompressing ? (
                                            <img src={result.compressedUrl} className="w-full h-full object-contain" alt="Compressed" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-zinc-600">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span className="text-[10px] uppercase tracking-widest">Compressing…</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={downloadResult}
                                    disabled={!result || isCompressing}
                                    className="flex-1 h-10 bg-white hover:bg-zinc-100 disabled:opacity-40 text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </button>
                                <button
                                    onClick={clear}
                                    className="h-10 px-5 border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    Clear
                                </button>
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
