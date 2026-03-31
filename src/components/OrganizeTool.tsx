"use client";

import React, { useState, useCallback, memo, useEffect, useRef, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Download, Trash2, LayoutGrid, GripVertical, Loader2, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { cn } from "@/lib/utils";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

interface PageItem {
    id: string;
    originalIndex: number;
    thumbnail: string;
}

const OrganizeTool = memo(() => {
    const t = useTranslations("Tools.organizePages");
    const tc = useTranslations("Tools.common");
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Initialise PDF.js worker
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

    const loadPages = useCallback(async (file: File) => {
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            const newPages: PageItem[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (!context) continue;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, canvas, viewport }).promise;
                newPages.push({
                    id: `page-${i}-${Math.random().toString(36).substr(2, 9)}`,
                    originalIndex: i - 1,
                    thumbnail: canvas.toDataURL()
                });
            }
            setPages(newPages);
        } catch (err) {
            console.error("PDF Load Error:", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            loadPages(acceptedFiles[0]);
        }
    }, [loadPages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const removePage = useCallback((id: string) => {
        setPages(prev => prev.filter(p => p.id !== id));
    }, []);

    const handleExport = useCallback(async () => {
        if (!file || pages.length === 0) return;
        setIsGenerating(true);

        try {
            const originalBuffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(originalBuffer);
            const pdfDoc = await PDFDocument.create();

            const indices = pages.map(p => p.originalIndex);
            const copiedPages = await pdfDoc.copyPages(srcDoc, indices);

            copiedPages.forEach(page => pdfDoc.addPage(page));

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `privaflow_organized_${file.name}`;
            link.click();
        } catch (err) {
            console.error("Export Error:", err);
        } finally {
            setIsGenerating(false);
        }
    }, [file, pages]);

    const clear = useCallback(() => {
        setFile(null);
        setPages([]);
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
            icon={LayoutGrid}
            category="docs"
            toolId="organize-pages"
            settingsContent={
                file && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-relaxed">
                                    {t('pagesLoaded', { count: pages.length })}
                                </p>
                            </div>
                            <button
                                onClick={handleExport}
                                disabled={isGenerating || pages.length === 0}
                                className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {isGenerating ? t('synthesizing') : t('saveBtn')}
                            </button>
                        </div>
                        <button onClick={clear} className="w-full h-12 border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                            {t('discardBtn')}
                        </button>
                    </div>
                )
            }
            howItWorks={howItWorks}
        >
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "w-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-20 gap-6",
                                    isDragActive ? "border-white bg-white/[0.05]" : "border-white/10 hover:border-white/20 bg-zinc-900/50"
                                )}
                            >
                                <input {...getInputProps()} />
                                <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded-full bg-white/5">
                                    <LayoutGrid className={cn("w-8 h-8", isDragActive ? "text-white" : "text-white/40")} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-black text-white uppercase tracking-tighter">
                                        {isDragActive ? tc('dropActive') : t('dropTitle')}
                                    </p>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            {isProcessing ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <Loader2 className="w-10 h-10 text-white/20 animate-spin" />
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{t('scanning')}</p>
                                </div>
                            ) : (
                                <div className="w-full p-4 sm:p-8 bg-zinc-950/40 border border-white/5 rounded-2xl">
                                    <Reorder.Group
                                        axis="y"
                                        values={pages}
                                        onReorder={setPages}
                                        className="space-y-3"
                                    >
                                        {pages.map((item, index) => (
                                            <Reorder.Item
                                                key={item.id}
                                                value={item}
                                                className="relative group bg-zinc-900 border border-white/5 cursor-grab active:cursor-grabbing hover:border-emerald-500/30 transition-all overflow-hidden flex items-center p-3 gap-6 rounded-xl"
                                            >
                                                <div className="flex items-center gap-4 shrink-0">
                                                    <div className="text-zinc-700 group-hover:text-zinc-500 transition-colors">
                                                        <GripVertical className="w-5 h-5" />
                                                    </div>
                                                    <div className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center text-[11px] font-black text-white border border-white/10 shadow-xl">
                                                        {index + 1}
                                                    </div>
                                                </div>

                                                <div className="w-20 aspect-[3/4] bg-white rounded-md flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
                                                    <img src={item.thumbnail} className="w-full h-full object-contain pointer-events-none select-none" alt={`${t('pageLabel')} ${index + 1}`} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-white uppercase tracking-tight truncate">{t('pageLabel')} {index + 1}</p>
                                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">{tc('ready')}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removePage(item.id);
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-red-500/20 text-zinc-600 hover:text-red-500 transition-colors rounded-xl"
                                                        title={t('delete')}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>

                                    {pages.length === 0 && (
                                        <div className="py-20 text-center space-y-4">
                                            <Trash2 className="w-10 h-10 text-white/5 mx-auto" />
                                            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{t('emptyQueue')}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

OrganizeTool.displayName = 'OrganizeTool';
export default OrganizeTool;
