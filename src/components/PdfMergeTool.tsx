"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    FileStack, Loader2, Download, Trash2,
    FileUp, Key, Shield, Info, RefreshCw,
    Plus, ArrowUp, ArrowDown, GripVertical, FileText, HardDrive
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

export default function PdfMergeTool() {
    const t = useTranslations("HomePage"); // Using merge keys from HomePage as seen in en.json
    const tc = useTranslations("Tools.common");

    const [files, setFiles] = useState<MergeFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

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

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setMergedBlob(null);
    };

    const handleMerge = async () => {
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
    };

    const handleDownload = () => {
        if (!mergedBlob) return;
        const url = URL.createObjectURL(mergedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `vaultnode_merged_${new Date().getTime()}.pdf`;
        link.click();
    };

    const formatSize = (bytes: number) => {
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    };

    return (
        <ToolContainer
            title={t('pdfMerger')}
            description={t('mergeDropDesc')}
            icon={FileStack}
            category="docs"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Document Queue</span>
                        <div className="p-3 rounded-2xl border border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight italic">{files.length} Files Ready</span>
                            <FileStack className="w-3 h-3 text-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={handleMerge}
                            disabled={files.length < 2 || isMerging}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isMerging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 me-2" />}
                            {isMerging ? "Merging..." : t('mergeButton')}
                        </Button>

                        {mergedBlob && (
                            <Button
                                onClick={handleDownload}
                                className="w-full h-12 bg-zinc-950 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all"
                            >
                                <Download className="w-4 h-4 me-2" />
                                Download Merged
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => { setFiles([]); setMergedBlob(null); }}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <Trash2 className="w-4 h-4 me-2" />
                            Clear Queue
                        </Button>
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Local Assembly</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Everything happens safely inside your own screen.
                            No persistent traces left on disk or network.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Parallel Loading", description: "All selected PDFs are read into individual byte buffers simultaneously." },
                { title: "Page Injection", description: "Injects page objects from multiple source catalogs into a new PDF registry." },
                { title: "Local Synthesis", description: "Serializes the final document object into a binary BLOB for instant download." }
            ]}
        >
            <div className="relative min-h-[450px] flex flex-col p-6 md:p-12">
                <AnimatePresence mode="wait">
                    {files.length === 0 ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center flex-1"
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
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">Stage Your Documents</h3>
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">{t('mergeDropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="queue"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col space-y-6"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Merge Queue</h3>
                                <div {...getRootProps()} className="cursor-pointer">
                                    <input {...getInputProps()} />
                                    <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400 uppercase tracking-widest text-[10px] font-black italic">
                                        <Plus className="w-3 h-3 me-2" /> Add More
                                    </Button>
                                </div>
                            </div>

                            <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-3">
                                {files.map((file) => (
                                    <Reorder.Item
                                        key={file.id}
                                        value={file}
                                        className="p-1"
                                    >
                                        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4 group hover:border-emerald-500/30 transition-colors shadow-lg">
                                            <div className="cursor-grab active:cursor-grabbing text-zinc-700 group-hover:text-zinc-400">
                                                <GripVertical className="w-5 h-5" />
                                            </div>
                                            <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black uppercase tracking-tighter text-white truncate">{file.name}</p>
                                                <p className="text-[10px] font-bold uppercase text-zinc-500">{formatSize(file.size)} &bull; Ready to Append</p>
                                            </div>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            {isMerging && (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-12 gap-4"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse">Synthesis in Progress</p>
                                </motion.div>
                            )}

                            {mergedBlob && !isMerging && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Download className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black uppercase italic tracking-tight text-emerald-500">Node Synthesis Complete</h4>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Done! Everything stayed inside your screen.</p>
                                    </div>
                                    <Button
                                        onClick={handleDownload}
                                        className="h-12 px-10 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 text-xs uppercase italic"
                                    >
                                        Download Final PDF
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-auto pt-10 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-zinc-600">
                        <HardDrive className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Buffer-04</span>
                    </div>
                    <div className="w-px h-3 bg-zinc-800" />
                    <div className="flex items-center gap-2 text-emerald-500">
                        <RefreshCw className="w-4 h-4 animate-spin-slow" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('localOnly')}</span>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
}
