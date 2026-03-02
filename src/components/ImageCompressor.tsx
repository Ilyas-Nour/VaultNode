"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import {
    Image as ImageIcon,
    Download,
    Sliders,
    ArrowRight,
    ShieldCheck,
    ChevronLeft,
    Loader2,
    Trash2,
    Zap,
    HardDrive,
    Info
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CompressionResult {
    originalUrl: string;
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    fileName: string;
}

export default function ImageCompressor() {
    const [file, setFile] = useState<File | null>(null);
    const [targetSizeMB, setTargetSizeMB] = useState(1.0);
    const [result, setResult] = useState<CompressionResult | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const compressorRef = useRef<boolean>(false);

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
        <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8 flex flex-col items-center selection:bg-emerald-500/30">
            <div className="w-full max-w-7xl flex flex-col space-y-8">

                {/* Navigation & Brand */}
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all h-10 px-4">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Back Home</span>
                            <span className="sm:hidden">Home</span>
                        </Button>
                    </Link>
                    <div className="flex items-center space-x-3 bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-800">
                        <Zap className="text-emerald-500 w-5 h-5 fill-emerald-500/10" />
                        <h1 className="text-lg font-bold italic tracking-tighter uppercase">VaultNode <span className="text-emerald-500">Compress</span></h1>
                    </div>
                </div>

                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full pt-12"
                    >
                        <div
                            {...getRootProps()}
                            className={`
                w-full max-w-3xl mx-auto aspect-[16/9] rounded-[2.5rem] border-2 border-dashed 
                transition-all duration-700 cursor-pointer flex flex-col items-center justify-center space-y-6
                ${isDragActive ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_80px_rgba(16,185,129,0.1)]" : "border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40"}
              `}
                        >
                            <input {...getInputProps()} />
                            <div className={`p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800 transition-all duration-700 shadow-2xl ${isDragActive ? "scale-110 border-emerald-500/50" : ""}`}>
                                <ImageIcon className={`w-10 h-10 transition-colors duration-500 ${isDragActive ? "text-emerald-500" : "text-zinc-600"}`} />
                            </div>
                            <div className="text-center space-y-2 px-8">
                                <h3 className="text-xl font-bold tracking-tight text-white">Drop Image to Shrink</h3>
                                <p className="text-zinc-500 text-sm max-w-[340px] leading-relaxed mx-auto italic">
                                    JPG, PNG, WEBP. All processing happens 100% locally in your session.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Side-by-Side Comparison Area */}
                        <div className="flex flex-col space-y-8 order-2 lg:order-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Original View */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Original Architecture</span>
                                        <span className="text-xs font-bold text-zinc-400">{formatSize(result?.originalSize || file.size)}</span>
                                    </div>
                                    <Card className="aspect-square bg-zinc-900 rounded-[2rem] border-zinc-800 overflow-hidden flex items-center justify-center relative group">
                                        <img
                                            src={result?.originalUrl || URL.createObjectURL(file)}
                                            alt="Original"
                                            className="w-full h-full object-contain p-4 opacity-50 contrast-125 grayscale"
                                        />
                                        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] flex items-center justify-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 -rotate-12 italic">Raw Source Data</p>
                                        </div>
                                    </Card>
                                </div>

                                {/* Compressed View */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Optimized Vault Asset</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-black text-emerald-500">{formatSize(result?.compressedSize || 0)}</span>
                                            {savingsPercent > 0 && (
                                                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 font-black">-{savingsPercent}%</span>
                                            )}
                                        </div>
                                    </div>
                                    <Card className={`aspect-square bg-zinc-900 rounded-[2rem] border-zinc-800 overflow-hidden flex items-center justify-center relative transition-all duration-700 ${isCompressing ? "opacity-40 animate-pulse" : "shadow-[0_0_50px_rgba(16,185,129,0.05)] border-emerald-500/10"}`}>
                                        {result ? (
                                            <img src={result.compressedUrl} alt="Compressed" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <Loader2 className="w-8 h-8 text-emerald-500/50 animate-spin" />
                                        )}
                                        {isCompressing && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-zinc-950/20">
                                                <div className="relative">
                                                    <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full animate-ping" />
                                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500 animate-spin" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">Shrinking locally...</p>
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            </div>

                            {/* Security Banner */}
                            <div className="flex items-center space-x-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] backdrop-blur-xl">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white tracking-tight leading-none uppercase italic">Local Session Encrypted</p>
                                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-wider">
                                        No data is uploaded to servers. All compression logic runs inside your hardware registers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Premium Control Sidebar */}
                        <aside className="space-y-6 order-1 lg:order-2">
                            <Card className="p-8 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3 text-emerald-500">
                                        <Sliders className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">Engine Config</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Size Limit</label>
                                            <span className="text-2xl font-black text-white px-3 py-1 bg-zinc-800 rounded-xl tabular-nums border border-zinc-700/50">{targetSizeMB} <span className="text-xs text-zinc-500">MB</span></span>
                                        </div>

                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5.0"
                                            step="0.1"
                                            value={targetSizeMB}
                                            onChange={(e) => setTargetSizeMB(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all shadow-inner"
                                        />

                                        <div className="flex justify-between px-1">
                                            <span className="text-[9px] font-black text-zinc-700 uppercase">Extreme</span>
                                            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Balanced Quality</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-zinc-800/50" />

                                <div className="space-y-4">
                                    <Button
                                        onClick={downloadResult}
                                        disabled={!result || isCompressing}
                                        className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-xl shadow-emerald-500/10 active:scale-95 transition-all duration-500 capitalize italic group"
                                    >
                                        <Download className="mr-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                                        Export Optimized Image
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={clear}
                                        className="w-full h-14 text-zinc-500 hover:text-white hover:bg-zinc-800 font-bold rounded-2xl transition-all"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Discard File
                                    </Button>
                                </div>

                                <div className="p-4 rounded-[1.5rem] bg-zinc-950/50 border border-zinc-800/80 space-y-3">
                                    <div className="flex items-center space-x-2 text-zinc-500">
                                        <Info className="w-3.5 h-3.5" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Compression Logic</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-600 leading-tight font-bold pr-2 italic">
                                        Calculated via browser-image-compression with multithreaded workers enabled.
                                    </p>
                                </div>
                            </Card>

                            <div className="hidden lg:flex w-full h-[180px] bg-zinc-900/10 border border-dashed border-zinc-800 rounded-[2.5rem] flex-col items-center justify-center space-y-4 opacity-30 hover:opacity-100 transition-opacity">
                                <div className="relative">
                                    <div className="w-10 h-10 border-2 border-zinc-800 rounded-2xl rotate-45 flex items-center justify-center animate-pulse">
                                        <HardDrive className="w-5 h-5 text-zinc-700 -rotate-45" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
                                </div>
                                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Vault Registry Node 05</p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
