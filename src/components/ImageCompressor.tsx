"use client";

import React, { useState, useCallback, useEffect } from "react";
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
    ArrowRightLeft,
    FileImage
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

export default function ImageCompressor() {
    const t = useTranslations("Tools.compress");
    const [file, setFile] = useState<File | null>(null);
    const [targetSizeMB, setTargetSizeMB] = useState(1.0);
    const [result, setResult] = useState<CompressionResult | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleCompression = useCallback(async (imgFile: File, targetSize: number) => {
        setIsCompressing(true);
        try {
            const options = {
                maxSizeMB: targetSize,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
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
            console.error("Compression Error:", error);
        } finally {
            setIsCompressing(false);
        }
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            handleCompression(acceptedFiles[0], targetSizeMB);
        }
    }, [handleCompression, targetSizeMB]);

    useEffect(() => {
        if (file) {
            const timeout = setTimeout(() => {
                handleCompression(file, targetSizeMB);
            }, 300);
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

    const clear = () => {
        setFile(null);
        setResult(null);
    };

    const downloadResult = () => {
        if (!result) return;
        const link = document.createElement("a");
        link.href = result.compressedUrl;
        link.download = `vaultnode-compressed-${result.fileName}`;
        link.click();
    };

    const savingsPercent = result ? Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100) : 0;

    return (
        <ToolContainer
            title={t('titleHighlight')}
            description={t('dropDesc')}
            icon={ImageIcon}
            category="media"
            settingsContent={
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <span>Target Size</span>
                            <span className="text-emerald-500">{targetSizeMB} MB</span>
                        </div>
                        <Slider
                            value={[targetSizeMB]}
                            min={0.1}
                            max={5.0}
                            step={0.1}
                            onValueChange={(val) => setTargetSizeMB(val[0])}
                            className="py-4"
                        />
                        <div className="flex justify-between text-[8px] font-black text-zinc-700 uppercase tracking-tighter">
                            <span>{t('aggressive')}</span>
                            <span>{t('balanced')}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={downloadResult}
                            disabled={!result || isCompressing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all shadow-lg shadow-emerald-500/10"
                        >
                            <Download className="w-4 h-4 me-2" />
                            {t('downloadSecurely')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={clear}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <Trash2 className="w-4 h-4 me-2" />
                            Discard File
                        </Button>
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Info className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Optimization Report</span>
                        </div>
                        {result ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-zinc-600">Saved:</span>
                                    <span className="text-emerald-500">{(savingsPercent > 0 ? savingsPercent : 0)}%</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-zinc-600">Final:</span>
                                    <span className="text-zinc-400">{formatSize(result.compressedSize)}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[9px] text-zinc-600 font-bold leading-tight pr-2 italic">
                                Calculated via browser-image-compression with multithreaded workers enabled.
                            </p>
                        )}
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Browser Logic", description: "Uses browser-image-compression with multithreaded workers." },
                { title: "Zero Uploads", description: "All pixel crunching happens in your local RAM." },
                { title: "Smart Resizing", description: "Maintains aspect ratio while aggressively optimizing data chunks." }
            ]}
        >
            <div className="relative min-h-[450px] flex flex-col items-center justify-center p-6 md:p-12">
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
                                        <ImageIcon className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">{t('dropTitle')}</h3>
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">{t('dropDesc')}</p>
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
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Original */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
                                        <span>Raw Source</span>
                                        <span>{formatSize(file.size)}</span>
                                    </div>
                                    <div className="aspect-square rounded-[2rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden relative flex items-center justify-center">
                                        <img
                                            src={result?.originalUrl || URL.createObjectURL(file)}
                                            className="w-full h-full object-contain grayscale opacity-30 contrast-125"
                                            alt="Original"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-10 text-white -rotate-12 translate-y-4">
                                                HARD COPY ONLY
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Compressed */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                                        <span>Optimized Asset</span>
                                        <div className="flex items-center gap-2">
                                            {result && <span className="bg-emerald-500/10 px-2 py-0.5 rounded-md">-{savingsPercent}%</span>}
                                            <span>{formatSize(result?.compressedSize || 0)}</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "aspect-square rounded-[2rem] border overflow-hidden relative flex flex-col items-center justify-center transition-all duration-700",
                                        isCompressing ? "bg-zinc-900 border-zinc-800" : "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                                    )}>
                                        {result && !isCompressing ? (
                                            <img
                                                src={result.compressedUrl}
                                                className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700"
                                                alt="Compressed"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-4 text-emerald-500">
                                                <Loader2 className="w-10 h-10 animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('processing')}</span>
                                            </div>
                                        )}

                                        {result && !isCompressing && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                                                <Button
                                                    onClick={downloadResult}
                                                    className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg uppercase italic"
                                                >
                                                    <Download className="w-6 h-6 me-3" />
                                                    {t('downloadSecurely')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 px-8 py-4 bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-xl">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Input Node</span>
                                    <HardDrive className="w-5 h-5 text-zinc-500" />
                                </div>
                                <ArrowRightLeft className="w-4 h-4 text-emerald-500 animate-pulse" />
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Vault Registry</span>
                                    <Zap className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
}
