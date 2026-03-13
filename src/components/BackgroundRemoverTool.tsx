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

import React, { useState, useCallback, useRef, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from 'next-intl';
import {
    Loader2, Download, RefreshCw,
    UserCircle, FileUp, Shield, Image as ImageIcon
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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const f = acceptedFiles[0];
            setFile(f);
            setPreviewUrl(URL.createObjectURL(f));
            setExportBlob(null);
            setExportUrl(null);
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
                rescale: modelType === 'isnet' ? false : true,
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
            setIsProcessing(false);
        } catch (error) {
            console.error("Background removal error:", error);
            setIsProcessing(false);
        }
    }, [file, modelType]);

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

                        {exportUrl && (
                            <Button
                                onClick={handleDownload}
                                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all shadow-xl"
                            >
                                <Download className="w-4 h-4 me-2" />
                                {t('downloadBtn')}
                            </Button>
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
                                    <div className="flex items-center gap-2.5 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors group/eye">
                                        <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-tighter">{t('monitor')}</span>
                                        <UserCircle className="w-3.5 h-3.5 text-emerald-500 animate-pulse group-hover/eye:scale-110 transition-transform" />
                                    </div>
                                </div>
                                <div className="aspect-square rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/10 overflow-hidden relative shadow-[0_40px_80px_-20px_rgba(16,185,129,0.1)] transition-all duration-700 hover:border-emerald-500/40 group bg-checkerboard">
                                    {exportUrl ? (
                                        <img
                                            src={exportUrl}
                                            className="w-full h-full object-contain transition-all duration-500 transform scale-[1.05] p-4 group-hover:scale-[1.02]"
                                            alt="Removed Background"
                                        />
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
        </ToolContainer>
    );
});

BackgroundRemoverTool.displayName = 'BackgroundRemoverTool';

export default BackgroundRemoverTool;
