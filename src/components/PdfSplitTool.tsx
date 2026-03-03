"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Scissors, Loader2, Download, Trash2,
    FileUp, Key, Shield, Info, RefreshCw,
    Layers, CheckCircle2, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import JSZip from "jszip";

export default function PdfSplitTool() {
    const t = useTranslations("HomePage");
    const tc = useTranslations("Tools.common");

    const [file, setFile] = useState<File | null>(null);
    const [range, setRange] = useState<string>(""); // e.g. "1-3, 5, 8-10"
    const [isProcessing, setIsProcessing] = useState(false);
    const [splitBlob, setSplitBlob] = useState<Blob | null>(null);
    const [isZip, setIsZip] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    const parseRange = (rangeStr: string, maxPages: number): number[] => {
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
    };

    const handleSplit = async () => {
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
                // Extract into a single PDF
                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(sourcePdf, selectedIndices);
                copiedPages.forEach(p => newPdf.addPage(p));
                const bytes = await newPdf.save();
                setSplitBlob(new Blob([bytes as any], { type: "application/pdf" }));
                setIsZip(false);
            } else {
                // Individual pages into a ZIP
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
    };

    const handleDownload = () => {
        if (!splitBlob || !file) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(splitBlob);
        link.download = isZip
            ? `${file.name.replace(".pdf", "")}_pages.zip`
            : `extracted_${file.name}`;
        link.click();
    };

    return (
        <ToolContainer
            title="Extract Pages"
            description="Split PDF documents or extract specific ranges locally."
            icon={Scissors}
            category="docs"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Extraction Logic</span>
                        <div className="space-y-2">
                            <div className="p-3 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Page Range</label>
                                <input
                                    type="text"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                    placeholder="e.g. 1-3, 5, 8-10"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 transition-all italic"
                                />
                                <p className="text-[8px] text-zinc-600 font-bold uppercase italic leading-none">Leave empty to extract all pages as individual files.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={handleSplit}
                            disabled={!file || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4 me-2" />}
                            {isProcessing ? "Processing..." : "Extract Pages"}
                        </Button>

                        {splitBlob && (
                            <Button
                                onClick={handleDownload}
                                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all shadow-xl"
                            >
                                <Download className="w-4 h-4 me-2" />
                                Download {isZip ? "ZIP Package" : "Extracted PDF"}
                            </Button>
                        )}
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">In-Browser Split</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Your document is parsed and re-composed entirely in RAM.
                            No persistent file system writes occur.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Binary Parsing", description: "Loads the PDF byte stream into a traversable document object." },
                { title: "Page Dereferencing", description: "Clones specific page references and resources into a new document buffer." },
                { title: "Atomic Synthesis", description: "Writes the new document structure to a binary blob for extraction." }
            ]}
        >
            <div className="relative min-h-[450px] flex flex-col items-center justify-center p-6 md:p-12">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl mx-auto"
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
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">Stage Your Document</h3>
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">Select a PDF to extract pages from locally.</p>
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
                            <div className="w-full max-w-2xl bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden relative p-8 flex flex-col items-center shadow-2xl">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                                        <FileText className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-start">
                                        <p className="text-sm font-black uppercase tracking-tighter text-white truncate">{file.name}</p>
                                        <p className="text-[10px] font-bold uppercase text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB &bull; PDF Registry</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-zinc-500 hover:text-white uppercase tracking-widest text-[9px] font-black italic">
                                        Change
                                    </Button>
                                </div>

                                {errorMsg && (
                                    <div className="w-full mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                                        <Info className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase italic tracking-tight">{errorMsg}</span>
                                    </div>
                                )}

                                {splitBlob && !isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-full mt-8 flex flex-col items-center space-y-6"
                                    >
                                        <div className="flex items-center gap-2 text-emerald-500 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Partitioning Absolute</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                            <div className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl text-center space-y-1">
                                                <p className="text-[8px] font-black text-zinc-600 uppercase">Archive Format</p>
                                                <p className="text-xs font-black text-white uppercase italic">{isZip ? "ZIP Archive" : "Single PDF"}</p>
                                            </div>
                                            <div className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl text-center space-y-1">
                                                <p className="text-[8px] font-black text-zinc-600 uppercase">Extraction Size</p>
                                                <p className="text-xs font-black text-white uppercase italic">{(splitBlob.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex items-center gap-8 px-8 py-4 bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-xl">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Source Stream</span>
                                    <Layers className="w-5 h-5 text-zinc-500" />
                                </div>
                                <RefreshCw className={cn("w-5 h-5 text-emerald-500", isProcessing && "animate-spin")} />
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Extraction Registry</span>
                                    <Scissors className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
}
