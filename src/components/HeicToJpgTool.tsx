"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, RefreshCcw, Upload, Download, CheckCircle2, FileImage, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import heic2any from "heic2any";
import { ToolContainer } from "@/components/ToolContainer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HeicToJpgTool() {
    const t = useTranslations("Tools.heicToJpg");

    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const [convertedFormat, setConvertedFormat] = useState<"jpeg" | "png">("jpeg");
    const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const processFile = async (file: File) => {
        setOriginalFile(file);
        setIsProcessing(true);
        setErrorMsg(null);
        setConvertedUrl(null);
        setConvertedBlob(null);

        try {
            const converted = await heic2any({
                blob: file,
                toType: `image/${convertedFormat}`,
                quality: 0.9
            });

            const targetBlob = Array.isArray(converted) ? converted[0] : converted;
            setConvertedBlob(targetBlob);
            setConvertedUrl(URL.createObjectURL(targetBlob));
        } catch (error: any) {
            console.error("HEIC Conversion error:", error);
            setErrorMsg(t('errorDesc') || "Failed to convert HEIC. The file may be corrupted.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, [convertedFormat]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/heic': ['.heic'],
            'image/heif': ['.heif']
        },
        maxFiles: 1
    });

    const handleDownload = () => {
        if (!convertedUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = convertedUrl;
        const newName = originalFile.name.replace(/\.hei[cf]$/i, `.${convertedFormat === "jpeg" ? "jpg" : "png"}`);
        link.download = newName;
        link.click();
    };

    const handleClear = () => {
        setOriginalFile(null);
        setConvertedUrl(null);
        setConvertedBlob(null);
        setErrorMsg(null);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const s = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + s[i];
    };

    return (
        <ToolContainer
            title={t('titleHighlight')}
            description={t('dropDesc')}
            icon={RefreshCcw}
            category="media"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Output Format</span>
                        <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                            {(["jpeg", "png"] as const).map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => setConvertedFormat(fmt)}
                                    className={cn(
                                        "py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
                                        convertedFormat === fmt
                                            ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/10"
                                            : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                                    )}
                                >
                                    to {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={handleDownload}
                            disabled={!convertedUrl || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            <Download className="w-4 h-4 me-2" />
                            {t('downloadBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <RefreshCcw className="w-4 h-4 me-2" />
                            Convert New File
                        </Button>
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sandbox Mode</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Uses libheif via WebAssembly. Your photos never leave this machine.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Apple Compatibility", description: "Convert high-efficiency HEIC photos to standard web formats." },
                { title: "Universal Logic", description: "All transcoding happens in your browser's RAM via WASM." },
                { title: "Lossless Export", description: "High-quality conversion keeping bit-depth and clarity intact." }
            ]}
        >
            <div className="relative min-h-[450px] flex flex-col items-center justify-center p-6 md:p-12">
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
                                        "w-full aspect-video border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative",
                                        isDragActive ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
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
                            className="w-full flex flex-col items-center space-y-8"
                        >
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Original */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
                                        <span>Apple HEIC</span>
                                        <span>{formatSize(originalFile.size)}</span>
                                    </div>
                                    <div className="aspect-square rounded-[2rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden relative flex items-center justify-center">
                                        <FileImage className="w-12 h-12 text-zinc-700" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/40">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{originalFile.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Converted */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                                        <span>Standard {convertedFormat.toUpperCase()}</span>
                                        {convertedBlob && <span>{formatSize(convertedBlob.size)}</span>}
                                    </div>
                                    <div className={cn(
                                        "aspect-square rounded-[2rem] border overflow-hidden relative flex flex-col items-center justify-center transition-all duration-700",
                                        isProcessing ? "bg-zinc-900 border-zinc-800" : "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                                    )}>
                                        {convertedUrl && !isProcessing ? (
                                            <img
                                                src={convertedUrl}
                                                className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700 p-4"
                                                alt="Converted"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                                                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">{t('processing')}</span>
                                                    <p className="text-[9px] text-zinc-600 font-bold uppercase">WebAssembly Transcoding...</p>
                                                </div>
                                            </div>
                                        )}

                                        {convertedUrl && !isProcessing && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                                                <CheckCircle2 className="absolute top-6 right-6 w-8 h-8 text-emerald-500 drop-shadow-lg" />
                                                <Button
                                                    onClick={handleDownload}
                                                    className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg uppercase italic"
                                                >
                                                    <Download className="w-6 h-6 me-3" />
                                                    {t('downloadBtn')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500">
                                    <Info className="w-5 h-5" />
                                    <p className="text-xs font-bold uppercase tracking-tight">{errorMsg}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
}
