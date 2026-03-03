"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations, useLocale } from 'next-intl';
import {
    Loader2, Download, RefreshCw,
    Upload, Sparkles, X,
    Eye, Settings2, FileUp, Shield, Image as ImageIcon, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function BlurTool() {
    const t = useTranslations('HomePage');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [blurAmount, setBlurAmount] = useState([10]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [exportBlob, setExportBlob] = useState<Blob | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const handleExport = async () => {
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
    };

    const handleDownload = () => {
        if (!exportBlob || !file) return;
        const url = URL.createObjectURL(exportBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `blurred_${file.name}`;
        link.click();
    };

    const resetTool = () => {
        setFile(null);
        setPreviewUrl(null);
        setExportBlob(null);
        setBlurAmount([10]);
    };

    return (
        <ToolContainer
            title="Privacy Blur"
            description="Obfuscate sensitive regions of your images locally."
            icon={Wand2}
            category="media"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Blur Intensity</span>
                            <span className="text-[10px] font-black text-emerald-500">{blurAmount[0]}px</span>
                        </div>
                        <Slider
                            value={blurAmount}
                            onValueChange={(val) => { setBlurAmount(val); setExportBlob(null); }}
                            max={50}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={handleExport}
                            disabled={!file || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 me-2" />}
                            {isProcessing ? "Synthesizing..." : "Apply Buffer Blur"}
                        </Button>

                        {exportBlob && (
                            <Button
                                onClick={handleDownload}
                                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all shadow-xl"
                            >
                                <Download className="w-4 h-4 me-2" />
                                Download Node
                            </Button>
                        )}

                        {file && (
                            <Button
                                variant="ghost"
                                onClick={resetTool}
                                className="w-full h-10 text-zinc-600 hover:text-white text-[9px] font-black uppercase tracking-widest"
                            >
                                New Sequence
                            </Button>
                        )}
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Canvas Sandbox</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Pixels are transformed in a volatile HTML5 canvas.
                            Zero persistent artifacts.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Heuristic Processing", description: "Injects the image bitstream into a headless canvas instance." },
                { title: "Gaussian Kernel", description: "Applies a variable-radius Gaussian blur filter to the pixel matrix." },
                { title: "Atomic Export", description: "Re-serializes the filtered matrix into a binary payload." }
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
                                        <FileUp className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">Stage Your Media</h3>
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">Select an image to obfuscate locally.</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Source Node</span>
                                    <ImageIcon className="w-3 h-3 text-zinc-700" />
                                </div>
                                <div className="aspect-square rounded-[2rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden relative shadow-2xl">
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            className="w-full h-full object-contain mix-blend-lighten opacity-80"
                                            alt="Original"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Synthesized Output</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-emerald-500/50 uppercase">Preview</span>
                                        <Eye className="w-3 h-3 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="aspect-square rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 overflow-hidden relative shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            style={{ filter: `blur(${blurAmount[0]}px)` }}
                                            className="w-full h-full object-contain transition-all duration-300 transform scale-[1.02]"
                                            alt="Blurred Preview"
                                        />
                                    )}

                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">Encoding Node</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2 flex items-center justify-center gap-8 py-4 bg-zinc-900/50 border border-zinc-800 rounded-3xl shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Gaussian Protocol</span>
                                </div>
                                <div className="w-px h-3 bg-zinc-800" />
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t('localOnly')}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
}
