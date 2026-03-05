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
    const t = useTranslations("HomePage");
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
        { title: "Binary Parsing", description: "Loads the PDF byte stream into a traversable document object." },
        { title: "Page Dereferencing", description: "Clones specific page references and resources into a new document buffer." },
        { title: "Atomic Synthesis", description: "Writes the new document structure to a binary blob for extraction." }
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
                                        <FileUp className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tight mb-2">Stage Your Document</h3>
                                    <p className="text-zinc-500 text-sm lg:text-base font-bold uppercase tracking-widest text-center px-4">Select a PDF to extract pages from locally.</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col items-center space-y-10"
                        >
                            {/* 📟 PROCESSING REPORT CARD */}
                            <div className="w-full max-w-2xl bg-zinc-950 rounded-[3rem] border border-zinc-800/80 overflow-hidden relative p-10 flex flex-col items-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-3xl group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />

                                <div className="flex items-center gap-6 w-full z-10">
                                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                        <FileText className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-start">
                                        <p className="text-lg lg:text-xl font-black uppercase tracking-tighter text-white truncate group-hover:text-emerald-500 transition-colors">{file.name}</p>
                                        <p className="text-[11px] font-bold uppercase text-zinc-500 tracking-[0.2em]">{(file.size / 1024 / 1024).toFixed(2)} MB &bull; PDF Registry</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="h-10 px-4 text-zinc-500 hover:text-white uppercase tracking-widest text-[11px] font-black italic hover:bg-zinc-900 rounded-xl transition-all">
                                        Change
                                    </Button>
                                </div>

                                {errorMsg && (
                                    <div className="w-full mt-8 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 z-10 shadow-lg">
                                        <Info className="w-5 h-5 animate-pulse" />
                                        <span className="text-[11px] font-black uppercase italic tracking-tight">{errorMsg}</span>
                                    </div>
                                )}

                                {splitBlob && !isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-full mt-10 flex flex-col items-center space-y-8 z-10"
                                    >
                                        <div className="flex items-center gap-3 text-emerald-500 px-6 py-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Partitioning Absolute</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
                                            <div className="p-6 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl text-center space-y-2 transition-all hover:bg-zinc-900">
                                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Archive Format</p>
                                                <p className="text-sm font-black text-white uppercase italic tracking-tight">{isZip ? "ZIP Archive" : "Single PDF"}</p>
                                            </div>
                                            <div className="p-6 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl text-center space-y-2 transition-all hover:bg-zinc-900">
                                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Extraction Size</p>
                                                <p className="text-sm font-black text-white uppercase italic tracking-tight">{(splitBlob.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* 📟 NODE FLOW INDICATORS */}
                            <div className="flex items-center gap-12 px-12 py-6 bg-zinc-900/90 border border-zinc-800 rounded-full shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:bg-zinc-900">
                                <div className="flex flex-col items-center gap-2 transition-all hover:scale-105">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Source Stream</span>
                                    <Layers className="w-6 h-6 text-zinc-500" />
                                </div>
                                <div className="relative">
                                    <RefreshCw className={cn("w-6 h-6 text-emerald-500 transition-all", isProcessing ? "animate-spin" : "opacity-30")} />
                                    {isProcessing && <div className="absolute -inset-3 bg-emerald-500/10 blur-xl rounded-full animate-pulse" />}
                                </div>
                                <div className="flex flex-col items-center gap-2 transition-all hover:scale-105">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Extraction Registry</span>
                                    <Scissors className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

PdfSplitTool.displayName = 'PdfSplitTool';

export default PdfSplitTool;
