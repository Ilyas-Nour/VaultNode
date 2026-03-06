/**
 * ✂️ PRIVAFLOW | PDF Page Extractor
 * ---------------------------------------------------------
 * A surgical document partitioning engine. Extracts specific
 * ranges or individual pages from PDF bitstreams using
 * pdf-lib and JSZip for multi-node bundling.
 * 
 * Logic: PDF Partitioning & ZIP Bundling
 * Performance: Optimized (Memoized Callbacks & Parsers)
 * Aesthetics: Surgical-Minimalism / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
    Scissors, Loader2, Download,
    FileUp, Shield, Info, RefreshCw,
    Layers, CheckCircle2, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import JSZip from "jszip";

/**
 * ✂️ PdfSplitTool Component
 * A high-security utility for extracting pages from PDF documents locally.
 */
const PdfSplitTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.pdfSplit");
    const tc = useTranslations("Tools.common");

    // 📂 STATE ORCHESTRATION
    const [file, setFile] = useState<File | null>(null);
    const [range, setRange] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [splitBlob, setSplitBlob] = useState<Blob | null>(null);
    const [isZip, setIsZip] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * 📂 Queue Management
     * Registers the source document into the local processing buffer.
     */
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setSplitBlob(null);
            setErrorMsg(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    /**
     * ⚙️ Range Parser Logic
     * Converts human-readable range strings into zero-indexed page arrays.
     */
    const parseRange = useCallback((rangeStr: string, maxPages: number): number[] => {
        const pages = new Set<number>();
        const parts = rangeStr.split(/[\s,]+/);

        parts.forEach(part => {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
                        pages.add(i - 1); // 0-indexed
                    }
                }
            } else {
                const page = Number(part);
                if (!isNaN(page) && page >= 1 && page <= maxPages) {
                    pages.add(page - 1);
                }
            }
        });

        return Array.from(pages).sort((a, b) => a - b);
    }, []);

    /**
     * ⚡ Extraction Core
     * Partitions the PDF catalog and synthesizes new document artifacts.
     */
    const handleSplit = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);
        setErrorMsg(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            const totalPages = sourcePdf.getPageCount();

            const selectedIndices = range.trim() === ""
                ? Array.from({ length: totalPages }, (_, i) => i)
                : parseRange(range, totalPages);

            if (selectedIndices.length === 0) {
                throw new Error("No valid pages selected.");
            }

            if (selectedIndices.length === 1 || range.trim() !== "") {
                // 📄 EXTRACT TO SINGLE PDF UNIT
                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(sourcePdf, selectedIndices);
                copiedPages.forEach(p => newPdf.addPage(p));
                const bytes = await newPdf.save();
                setSplitBlob(new Blob([bytes as any], { type: "application/pdf" }));
                setIsZip(false);
            } else {
                // 📦 BUNDLE TO ZIP CONTAINER
                const zip = new JSZip();
                for (const index of selectedIndices) {
                    const newPdf = await PDFDocument.create();
                    const [page] = await newPdf.copyPages(sourcePdf, [index]);
                    newPdf.addPage(page);
                    const bytes = await newPdf.save();
                    zip.file(`page_${index + 1}.pdf`, bytes);
                }
                const zipContent = await zip.generateAsync({ type: "blob" });
                setSplitBlob(zipContent);
                setIsZip(true);
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Failed to split PDF.");
        } finally {
            setIsProcessing(false);
        }
    }, [file, range, parseRange]);

    const handleDownload = useCallback(() => {
        if (!splitBlob || !file) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(splitBlob);
        link.download = isZip
            ? `${file.name.replace(".pdf", "")}_pages.zip`
            : `extracted_${file.name}`;
        link.click();
    }, [splitBlob, file, isZip]);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: 'Upload Your PDF', description: 'Drop the big PDF you want to cut into smaller pieces.' },
        { title: 'Choose Which Pages to Keep', description: 'Type a page range like "1-5" or pick specific pages. You decide what goes into each new file.' },
        { title: 'Download Your Split Files', description: 'Each section downloads as its own PDF, ready to share or send separately.' }
    ], []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={Scissors}
            category="docs"
            toolId="pdf-split"
            settingsContent={
                <div className="space-y-6">
                    {/* 🔘 EXTRACTION LOGIC HUB */}
                    <div className="space-y-3.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">Extraction Logic</span>
                        <div className="space-y-2.5">
                            <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3.5 shadow-inner">
                                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">Page Range</label>
                                <input
                                    type="text"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                    placeholder="e.g. 1-3, 5, 8-10"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-all italic placeholder:text-zinc-800"
                                />
                                <p className="text-[10px] text-zinc-600 font-bold uppercase italic leading-tight">Leave empty to extract all pages as individual files.</p>
                            </div>
                        </div>
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3.5 pt-4">
                        <Button
                            onClick={handleSplit}
                            disabled={!file || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5 me-2" />}
                            {isProcessing ? "Processing..." : "Extract Pages"}
                        </Button>

                        {splitBlob && (
                            <Button
                                onClick={handleDownload}
                                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all shadow-xl"
                            >
                                <Download className="w-4 h-4 me-2" />
                                Download {isZip ? "ZIP Package" : "Extracted PDF"}
                            </Button>
                        )}
                    </div>

                    {/* 📊 SANDBOX REPORT */}
                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-4 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">In-Browser Split</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                            Your document is parsed and re-composed entirely privately.
                            No persistent file system writes occur.
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[420px] flex flex-col items-center justify-center p-6 md:p-12">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl mx-auto"
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
                                        {isDragActive ? 'Drop it here' : 'Drop your PDF here'}
                                    </p>
                                    <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">PDF files only</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col gap-4"
                        >
                            {/* File info row */}
                            <div className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950">
                                <FileText className="w-8 h-8 text-zinc-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{file.name}</p>
                                    <p className="text-xs text-zinc-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button onClick={() => setFile(null)} className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
                                    Change
                                </button>
                            </div>

                            {errorMsg && (
                                <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5 text-red-400">
                                    <Info className="w-4 h-4 shrink-0" />
                                    <span className="text-xs font-bold uppercase tracking-tight">{errorMsg}</span>
                                </div>
                            )}

                            {splitBlob && !isProcessing && (
                                <div className="flex items-center gap-3 p-4 border border-white/10 bg-white/[0.02]">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Split Complete</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-zinc-500">
                                        <span>{isZip ? 'ZIP Archive' : 'Single PDF'}</span>
                                        <span>{(splitBlob.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Splitting…</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

PdfSplitTool.displayName = 'PdfSplitTool';

export default PdfSplitTool;
