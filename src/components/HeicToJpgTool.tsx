/**
 * 🍏 PRIVAFLOW | Apple HEIC Transcoder
 * ---------------------------------------------------------
 * A high-performance transcoding bridge for high-efficiency
 * Apple image formats. Converts HEIC/HEIF to universal JPG/PNG.
 * 
 * Logic: WebAssembly-Native (libheif via heic2any)
 * Performance: High (Fully Memoized State & Workers)
 * Aesthetics: Media-Industrial / Emerald-Tactile
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, RefreshCcw, Upload, Download, CheckCircle2, FileImage, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import heic2any from "heic2any";
import { ToolContainer } from "@/components/ToolContainer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 🍏 HeicToJpgTool Component
 * The primary utility for Apple ecosystem compatibility.
 * Leverages WebAssembly for local, browser-side transcoding.
 */
const HeicToJpgTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.heicToJpg");
    const tc = useTranslations("Tools.common");

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const [convertedFormat, setConvertedFormat] = useState<"jpeg" | "png">("jpeg");
    const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * 📏 High-Precision Byte Formatter
     */
    const formatSize = useCallback((bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const s = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + s[i];
    }, []);

    /**
     * ⚡ WebAssembly Transcoding Engine
     * Executes the conversion from HEIC to target pixel formats.
     * Efficiency: Browser-threaded execution.
     */
    const processFile = useCallback(async (file: File, format: "jpeg" | "png" = convertedFormat) => {
        setOriginalFile(file);
        setIsProcessing(true);
        setErrorMsg(null);
        setConvertedUrl(null);
        setConvertedBlob(null);

        try {
            // WASM-Native Transcoding
            const converted = await heic2any({
                blob: file,
                toType: `image/${format}`,
                quality: 0.92
            });

            const targetBlob = Array.isArray(converted) ? converted[0] : converted;
            setConvertedBlob(targetBlob);
            setConvertedUrl(URL.createObjectURL(targetBlob));
        } catch (error: any) {
            console.error("WASM Transcoding failure:", error);
            setErrorMsg(t('errorDesc') || "Failed to transcode HEIC. Signal integrity compromised.");
        } finally {
            setIsProcessing(false);
        }
    }, [convertedFormat, t]);

    /**
     * 🛰️ Event Listeners
     */
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, [processFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/heic': ['.heic'],
            'image/heif': ['.heif']
        },
        maxFiles: 1
    });

    const handleDownload = useCallback(() => {
        if (!convertedUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = convertedUrl;
        const newName = originalFile.name.replace(/\.hei[cf]$/i, `.${convertedFormat === "jpeg" ? "jpg" : "png"}`);
        link.download = newName;
        link.click();
    }, [convertedUrl, originalFile, convertedFormat]);

    const handleClear = useCallback(() => {
        setOriginalFile(null);
        setConvertedUrl(null);
        setConvertedBlob(null);
        setErrorMsg(null);
        setIsProcessing(false);
    }, []);

    const handleFormatChange = useCallback((fmt: "jpeg" | "png") => {
        setConvertedFormat(fmt);
        if (originalFile) {
            processFile(originalFile, fmt);
        }
    }, [originalFile, processFile]);

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
            icon={RefreshCcw}
            category="media"
            toolId="heic"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-3.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{t('protocol')}</span>
                        <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                            {(["jpeg", "png"] as const).map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => handleFormatChange(fmt)}
                                    className={cn(
                                        "py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all italic",
                                        convertedFormat === fmt
                                            ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/10"
                                            : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                                    )}
                                >
                                    {t('to', { fmt })}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3.5 pt-4">
                        <Button
                            onClick={handleDownload}
                            disabled={!convertedUrl || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
                        >
                            <Download className="w-4 h-4 me-2" />
                            {t('downloadBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[11px] font-black uppercase tracking-widest italic transition-all rounded-xl"
                        >
                            <RefreshCcw className="w-4 h-4 me-2" />
                            {t('resetBtn')}
                        </Button>
                    </div>

                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-3.5 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{t('sandbox')}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-bold leading-relaxed uppercase tracking-tight">
                            {t('sandboxDesc')}
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[420px] flex flex-col items-center justify-center p-6 md:p-10">
                <AnimatePresence mode="wait">
                    {!originalFile ? (
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
                                        "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-10 gap-4",
                                        isDragActive ? "border-white/40 bg-white/[0.03]" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className={cn("w-8 h-8", isDragActive ? "text-white" : "text-zinc-600")} />
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white uppercase tracking-widest">
                                            {isDragActive ? tc('dropActive') : t('dropTitle')}
                                        </p>
                                        <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">HEIC · HEIF</p>
                                    </div>
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
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Original */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                        <span>{t('originalLabel')}</span>
                                        <span>{formatSize(originalFile.size)}</span>
                                    </div>
                                    <div className="aspect-square rounded-[2rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden relative flex items-center justify-center group shadow-2xl">
                                        <FileImage className="w-12 h-12 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                                        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center justify-center bg-zinc-950/40 py-2.5 backdrop-blur-sm">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 truncate px-4 w-full text-center">{originalFile.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Converted */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2 text-[11px] font-black uppercase tracking-widest text-emerald-500 italic">
                                        <span>{t('purifiedLabel', { format: convertedFormat.toUpperCase() })}</span>
                                        {convertedBlob && <span className="bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">{formatSize(convertedBlob.size)}</span>}
                                    </div>
                                    <div className={cn(
                                        "aspect-square rounded-[2rem] border overflow-hidden relative flex flex-col items-center justify-center transition-all duration-700 shadow-2xl",
                                        isProcessing ? "bg-zinc-900 border-zinc-800" : "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)]"
                                    )}>
                                        {convertedUrl && !isProcessing ? (
                                            <img
                                                src={convertedUrl}
                                                className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-1000 p-6"
                                                alt="Purified Buffer"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-ping" />
                                                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin relative z-10" />
                                                </div>
                                                <div className="text-center space-y-1.5">
                                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 animate-pulse">{t('processing')}</span>
                                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">{t('wasmDecryption')}</p>
                                                </div>
                                            </div>
                                        )}

                                        {convertedUrl && !isProcessing && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-500">
                                                <CheckCircle2 className="absolute top-6 right-6 w-8 h-8 text-emerald-500 drop-shadow-lg" />
                                                <Button
                                                    onClick={handleDownload}
                                                    className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-xl uppercase italic tracking-tight"
                                                >
                                                    <Download className="w-6 h-6 me-4" />
                                                    {t('downloadBtn')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3.5 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 shadow-xl"
                                >
                                    <Info className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-[11px] font-black uppercase tracking-tight">{errorMsg}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

HeicToJpgTool.displayName = 'HeicToJpgTool';

export default HeicToJpgTool;
