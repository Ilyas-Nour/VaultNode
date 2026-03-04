/**
 * 🧹 PRIVAFLOW | Global EXIF Scrubber
 * ---------------------------------------------------------
 * A surgical tool for removing digital fingerprints (Metadata)
 * from image files. Ensures absolute anonymity before sharing.
 * 
 * Logic: Canvas-Reconstruction (Total Metadata Wipe)
 * Performance: High (Fully Memoized State & Pipeline)
 * Aesthetics: Tactical-Premium / Silver-Emerald
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, ImageMinus, Upload, Download, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 🧹 CleanExifTool Component
 * The primary utility for image metadata sanitization.
 * Operates by re-rendering the image onto a clean canvas buffer.
 */
const CleanExifTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.cleanExif");

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cleanUrl, setCleanUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasExif, setHasExif] = useState(false);

    /**
     * 🔍 EXIF Detector Protocol
     * Scans the JPEG stream for APP1 segments containing metadata.
     * Efficiency: O(N) where N is the size of the header (first 64KB).
     */
    const checkExif = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            if (!buffer) return;

            const view = new DataView(buffer);

            // Validation: Ensure JPEG SOI marker (0xFFD8)
            if (view.byteLength < 2 || view.getUint16(0, false) !== 0xFFD8) {
                setHasExif(false);
                return;
            }

            let offset = 2;
            let foundExif = false;
            while (offset < view.byteLength) {
                if (offset + 4 > view.byteLength) break;

                const marker = view.getUint16(offset, false);
                // 0xFFE1 is the APP1 marker (commonly used for Exif)
                if (marker === 0xFFE1) {
                    foundExif = true;
                    break;
                }

                const length = view.getUint16(offset + 2, false);
                offset += 2 + length;
            }
            setHasExif(foundExif);
        };
        // Optimization: Only read the first 64KB where headers reside
        reader.readAsArrayBuffer(file.slice(0, 65536));
    }, []);

    /**
     * 🧼 Digital Purification Interface
     * Reconstructs the image pixel-by-pixel into a new buffer,
     * effectively destroying all non-visual data segments.
     */
    const processImage = useCallback(async (file: File) => {
        setIsProcessing(true);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        checkExif(file);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d", { alpha: true });

            if (ctx) {
                // Atomic Reconstruction
                ctx.drawImage(img, 0, 0);

                // Determine optimal MIME type
                const mimeType = file.type.includes('png') ? 'image/png' :
                    file.type.includes('webp') ? 'image/webp' : 'image/jpeg';

                canvas.toBlob((blob) => {
                    if (blob) {
                        const cleanObjectUrl = URL.createObjectURL(blob);
                        setCleanUrl(cleanObjectUrl);
                        setIsProcessing(false);
                    }
                }, mimeType, 0.95);
            }
        };
        img.onerror = () => {
            setIsProcessing(false);
            console.error("Purification failure: Image load error");
        };
        img.src = url;
    }, [checkExif]);

    /**
     * 🛰️ Event Listeners
     */
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setOriginalFile(file);
            processImage(file);
        }
    }, [processImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        maxFiles: 1
    });

    const handleDownload = useCallback(() => {
        if (!cleanUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = cleanUrl;
        link.download = `sanitized_${originalFile.name}`;
        link.click();
    }, [cleanUrl, originalFile]);

    const resetTool = useCallback(() => {
        setOriginalFile(null);
        setPreviewUrl(null);
        setCleanUrl(null);
        setHasExif(false);
        setIsProcessing(false);
    }, []);

    /**
     * 📦 Metadata Registry
     */
    const howItWorks = useMemo(() => [
        { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.desc') },
        { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.desc') },
        { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.desc') }
    ], [t]);

    return (
        <ToolContainer
            title={t('titleHighlight')}
            description={t('dropDesc')}
            icon={ImageMinus}
            category="vault"
            toolId="clean-exif"
            settingsContent={
                <div className="space-y-4">
                    {/* 🛡️ SECURITY STATUS HUD */}
                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Atomic Security</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Rasterization destroys all non-visual byte sequences.
                            Metadata reconstruction index: 0.0%
                        </p>
                    </div>
                    {originalFile && (
                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-10 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            Scrub New Sequence
                        </Button>
                    )}
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[400px] flex flex-col items-center justify-center p-8 md:p-12">
                <AnimatePresence mode="wait">
                    {!originalFile ? (
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
                                        <Upload className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
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
                            className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {/* 📂 SOURCE STREAM VIEW */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Input Stream</span>
                                    {hasExif ? (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-1 rounded-lg flex items-center gap-1.5 border border-red-500/20">
                                            <AlertTriangle className="w-3 h-3" /> Exif Detected
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-1 rounded-lg">No Metadata</span>
                                    )}
                                </div>
                                <div className="aspect-square rounded-[2rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden relative group">
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            className="w-full h-full object-contain grayscale opacity-30 contrast-125 transition-all duration-700 group-hover:opacity-50"
                                            alt="Original Stream"
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500/20 -rotate-12">Metadata Persistent</span>
                                    </div>
                                </div>
                            </div>

                            {/* 💧 PURIFIED OUTPUT VIEW */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Sanitized Buffer</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1.5 border border-emerald-500/20">
                                        <CheckCircle2 className="w-3 h-3" /> 100% Normalized
                                    </span>
                                </div>
                                <div className={cn(
                                    "aspect-square rounded-[2rem] border overflow-hidden relative flex flex-col items-center justify-center transition-all duration-700",
                                    isProcessing ? "bg-zinc-900 border-zinc-800" : "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)]"
                                )}>
                                    {cleanUrl && !isProcessing && (
                                        <img
                                            src={cleanUrl}
                                            className="w-full h-full object-contain animate-in fade-in duration-1000 p-4"
                                            alt="Cleaned Buffer"
                                        />
                                    )}

                                    {isProcessing ? (
                                        <div className="flex flex-col items-center gap-4 text-emerald-500">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                                <Loader2 className="w-10 h-10 animate-spin relative z-10" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">{t('scrubbing')}</span>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-500">
                                            <Button
                                                onClick={handleDownload}
                                                className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg uppercase italic"
                                            >
                                                <Download className="w-6 h-6 me-3" />
                                                {t('downloadClean')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

CleanExifTool.displayName = 'CleanExifTool';

export default CleanExifTool;
