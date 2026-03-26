/**
 * 📑 PRIVAFLOW | PDF Document Merger
 * ---------------------------------------------------------
 * A high-performance, client-side document assembly engine.
 * Merges multiple PDF bitstreams into a single catalog using
 * pdf-lib, ensuring zero-server contact for sensitive documents.
 * 
 * Logic: PDF Bitstream Assembly
 * Performance: Optimized (Memoized Callbacks & Reordering)
 * Aesthetics: Document-Industrial / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
    FileStack, Loader2, Download, Trash2,
    FileUp, Shield, RefreshCw,
    Plus, GripVertical, FileText, HardDrive, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

interface MergeFile {
    id: string;
    file: File;
    name: string;
    size: number;
}

/**
 * 📑 PdfMergeTool Component
 * The primary utility for merging multiple PDF files locally.
 */
const PdfMergeTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.pdfMerge");
    const tc = useTranslations("Tools.common");

    // 📂 STATE ORCHESTRATION
    const [files, setFiles] = useState<MergeFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

    /**
     * 📂 Queue Management
     * Injects new files into the assembly queue with unique node IDs.
     */
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            file: f,
            name: f.name,
            size: f.size
        }));
        setFiles(prev => [...prev, ...newFiles]);
        setMergedBlob(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
    });

    const removeFile = useCallback((id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setMergedBlob(null);
    }, []);

    /**
     * ⚡ Document Assembly Core
     * Sequentially merges PDF catalogs into a new document registry.
     */
    const handleMerge = useCallback(async () => {
        if (files.length < 2) return;
        setIsMerging(true);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const f of files) {
                const arrayBuffer = await f.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            setMergedBlob(blob);
        } catch (error) {
            console.error("Merging error:", error);
        } finally {
            setIsMerging(false);
        }
    }, [files]);

    const handleDownload = useCallback(() => {
        if (!mergedBlob) return;
        const url = URL.createObjectURL(mergedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `privaflow_merged_${new Date().getTime()}.pdf`;
        link.click();
    }, [mergedBlob]);

    const formatSize = useCallback((bytes: number) => {
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    }, []);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.desc') },
        { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.desc') },
        { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.desc') }
    ], [t]);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={FileStack}
            category="docs"
            toolId="merger"
            settingsContent={
                <div className="space-y-6">
                    {/* 🔘 DOCUMENT QUEUE STATUS */}
                    <div className="space-y-3.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">{t('queueTitle')}</span>
                        <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 flex items-center justify-between shadow-inner">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight italic">{t('queueStatus', { count: files.length })}</span>
                            <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                                <FileStack className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3.5 pt-4">
                        <Button
                            onClick={handleMerge}
                            disabled={files.length < 2 || isMerging}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isMerging ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 me-2" />}
                            {isMerging ? t('merging') : t('mergeButton')}
                        </Button>

                        {mergedBlob && (
                            <Button
                                onClick={handleDownload}
                                className="w-full h-12 bg-zinc-950 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all"
                            >
                                <Download className="w-4 h-4 me-2" />
                                {t('downloadMerged')}
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => { setFiles([]); setMergedBlob(null); }}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[11px] font-black uppercase tracking-widest italic rounded-xl"
                        >
                            <Trash2 className="w-4 h-4 me-2" />
                            {t('clearQueue')}
                        </Button>
                    </div>

                    {/* 📊 SANDBOX REPORT */}
                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-4 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{t('localAssembly')}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                            {t('assemblyDesc')}
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[420px] flex flex-col p-6 md:p-12">
                <AnimatePresence mode="wait">
                    {files.length === 0 ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center flex-1"
                        >
                            {/* 🛸 DROPZONE ARCHITECTURE */}
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
                                        {isDragActive ? t('dropFiles') : t('dropTitle')}
                                    </p>
                                    <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">{t('dropOnly')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="queue"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col space-y-8"
                        >
                            {/* 📑 QUEUE HEADER */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-black uppercase tracking-tight text-white">{t('filesToMerge')}</h3>
                                <div {...getRootProps()} className="cursor-pointer">
                                    <input {...getInputProps()} />
                                    <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400 uppercase tracking-widest text-[11px] font-black italic gap-2 group/add">
                                        <Plus className="w-4 h-4 transition-transform group-hover/add:rotate-90" /> {t('addMore')}
                                    </Button>
                                </div>
                            </div>

                            {/* 📑 DRAGGABLE STREAM ITEMS */}
                            <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-4">
                                {files.map((file) => (
                                    <Reorder.Item
                                        key={file.id}
                                        value={file}
                                        className="p-1"
                                    >
                                        <div className="p-5 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-3xl flex items-center gap-5 group hover:border-emerald-500/40 transition-all hover:bg-zinc-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                                            <div className="cursor-grab active:cursor-grabbing text-zinc-700 group-hover:text-zinc-400 transition-colors">
                                                <GripVertical className="w-6 h-6" />
                                            </div>
                                            <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                                <FileText className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-black uppercase tracking-tighter text-white truncate group-hover:text-emerald-500 transition-colors">{file.name}</p>
                                                <p className="text-[11px] font-bold uppercase text-zinc-500 tracking-widest">{formatSize(file.size)} &bull; {t('readyToAppend')}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            {/* 📟 SYNTHESIS LOADER */}
                            {isMerging && (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-16 gap-6"
                                >
                                    <div className="relative">
                                        <div className="absolute -inset-8 bg-emerald-500/10 blur-3xl rounded-full animate-pulse" />
                                        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin relative" />
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500 animate-pulse italic">{t('synthesisInProgress')}</p>
                                </motion.div>
                            )}

                            {/* 📟 SUCCESS STATE */}
                            {mergedBlob && !isMerging && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] flex flex-col items-center gap-6 text-center shadow-[0_20px_50px_-20px_rgba(16,185,129,0.1)] backdrop-blur-xl"
                                >
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight text-white mb-2">{t('synthesisComplete')}</h4>
                                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] max-w-sm mx-auto">{t('synthesisDesc')}</p>
                                    </div>
                                    <Button
                                        onClick={handleDownload}
                                        className="h-14 px-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 text-[11px] uppercase italic tracking-widest"
                                    >
                                        <Download className="w-4 h-4 me-2" />
                                        {t('downloadFinal')}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 📟 HARDWARE STATUS */}
                <div className="mt-auto pt-12 flex items-center justify-center gap-10">
                    <div className="flex items-center gap-2.5 text-zinc-600 transition-colors hover:text-zinc-400">
                        <HardDrive className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Buffer-04</span>
                    </div>
                    <div className="w-px h-4 bg-zinc-800" />
                    <div className="flex items-center gap-2.5 text-emerald-500 transition-colors hover:text-emerald-400">
                        <RefreshCw className="w-4 h-4 animate-spin-slow" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">{tc('specs.local')}</span>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
});

PdfMergeTool.displayName = 'PdfMergeTool';

export default PdfMergeTool;
