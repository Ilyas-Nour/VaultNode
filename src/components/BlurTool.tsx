/**
 * 🌫️ PRIVAFLOW | Local Graphic Obfuscator
 * ---------------------------------------------------------
 * A performance-tuned canvas utility for selective image blurring.
 * Uses hardware-accelerated filters to shroud sensitive visual
 * data within the browser Sandbox.
 * 
 * Logic: Canvas Gaussian Kernel
 * Performance: Optimized (Memoized Callbacks)
 * Aesthetics: Media-Industrial / Emerald-Mist
 */

"use client";

import React, { useState, useCallback, useRef, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from 'next-intl';
import {
    Loader2, Download, RefreshCw,
    Eye, FileUp, Shield, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 🌫️ BlurTool Component
 * The primary utility for local image obfuscation.
 */
const BlurTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations('HomePage');

    // 📂 STATE ORCHESTRATION
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [blurAmount, setBlurAmount] = useState([10]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [exportBlob, setExportBlob] = useState<Blob | null>(null);

    // 📂 Drop Handler
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const f = acceptedFiles[0];
            setFile(f);
            setPreviewUrl(URL.createObjectURL(f));
            setExportBlob(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        maxFiles: 1
    });

    /**
     * ⚡ Synthesis Engine
     * Projects the image into a headless canvas and applies
     * hardware-accelerated Gaussian filters.
     */
    const handleExport = useCallback(async () => {
        if (!file || !previewUrl) return;
        setIsProcessing(true);

        try {
            const img = new Image();
            img.src = previewUrl;
            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;

            // Apply filter via canvas context
            ctx.filter = `blur(${blurAmount[0]}px)`;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) {
                    setExportBlob(blob);
                }
                setIsProcessing(false);
            }, file.type, 0.95);
        } catch (error) {
            console.error("Blur export error:", error);
            setIsProcessing(false);
        }
    }, [file, previewUrl, blurAmount]);

    const handleDownload = useCallback(() => {
        if (!exportBlob || !file) return;
        const url = URL.createObjectURL(exportBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `blurred_${file.name}`;
        link.click();
    }, [exportBlob, file]);

    const resetTool = useCallback(() => {
        setFile(null);
        setPreviewUrl(null);
        setExportBlob(null);
        setBlurAmount([10]);
    }, []);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: "Heuristic Processing", description: "Injects the image bitstream into a headless canvas instance." },
        { title: "Gaussian Kernel", description: "Applies a variable-radius Gaussian blur filter to the pixel matrix." },
        { title: "Atomic Export", description: "Re-serializes the filtered matrix into a binary payload." }
    ], []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={Eye}
            category="media"
            toolId="blur"
            settingsContent={
                <div className="space-y-6">
                    {/* 🎚️ INTENSITY CONTROL */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">Blur Intensity</span>
                            <span className="text-sm font-black text-emerald-500 tabular-nums">{blurAmount[0]}px</span>
                        </div>
                        <Slider
                            value={blurAmount}
                            onValueChange={(val) => { setBlurAmount(val); setExportBlob(null); }}
                            max={50}
                            step={1}
                            className="py-6"
                        />
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3.5 pt-4">
                        <Button
                            onClick={handleExport}
                            disabled={!file || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5 me-2" />}
                            {isProcessing ? "Synthesizing..." : "Apply Buffer Blur"}
                        </Button>

                        {exportBlob && (
                            <Button
                                onClick={handleDownload}
                                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all shadow-xl"
                            >
                                <Download className="w-4 h-4 me-2" />
                                Download Node
                            </Button>
                        )}

                        {file && (
                            <Button
                                variant="ghost"
                                onClick={resetTool}
                                className="w-full h-10 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest italic tracking-[0.15em]"
                            >
                                New Sequence
                            </Button>
                        )}
                    </div>

                    {/* 📊 SANDBOX REPORT */}
                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-3.5 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Canvas Sandbox</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                            Pixels are transformed in a volatile HTML5 canvas.
                            Zero persistent artifacts.
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
                                        <FileUp className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tight mb-2">Stage Your Media</h3>
                                    <p className="text-zinc-500 text-sm lg:text-base font-bold uppercase tracking-widest text-center px-4">Select an image to obfuscate locally.</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* 📂 SOURCE STREAM VIEW */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">Source Node</span>
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

                            {/* 💧 SYNTHESIZED PREVIEW */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 italic">Synthesized Output</span>
                                    <div className="flex items-center gap-2.5 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors group/eye">
                                        <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-tighter">Live Monitor</span>
                                        <Eye className="w-3.5 h-3.5 text-emerald-500 animate-pulse group-hover/eye:scale-110 transition-transform" />
                                    </div>
                                </div>
                                <div className="aspect-square rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/10 overflow-hidden relative shadow-[0_40px_80px_-20px_rgba(16,185,129,0.1)] transition-all duration-700 hover:border-emerald-500/40 group">
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            style={{ filter: `blur(${blurAmount[0]}px)` }}
                                            className="w-full h-full object-contain transition-all duration-500 transform scale-[1.05] p-4 group-hover:scale-[1.02]"
                                            alt="Blurred Preview"
                                        />
                                    )}

                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl flex flex-col items-center justify-center gap-5 transition-all animate-in fade-in duration-500">
                                            <div className="relative">
                                                <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin relative" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 animate-pulse">Encoding Node</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 📟 PROTOCOL INDICATORS */}
                            <div className="md:col-span-2 flex items-center justify-center gap-12 py-6 bg-zinc-900/80 border border-zinc-800 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl mt-4">
                                <div className="flex items-center gap-3.5 transition-all hover:scale-105">
                                    <div className="w-2.5 rounded-full h-2.5 bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest italic">Gaussian Protocol</span>
                                </div>
                                <div className="w-px h-6 bg-zinc-800" />
                                <div className="flex items-center gap-3.5 transition-all hover:scale-105">
                                    <div className="w-2.5 rounded-full h-2.5 bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ animationDelay: '0.2s' }} />
                                    <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest italic">Local Integrity</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

BlurTool.displayName = 'BlurTool';

export default BlurTool;
