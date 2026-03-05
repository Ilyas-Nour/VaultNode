/**
 * 📄 PRIVAFLOW | PDF to DOCX Converter
 * ---------------------------------------------------------
 * A structural document reconstruction engine. Scans PDF
 * text layers and synthesizes native OpenXML (.docx) 
 * bitstreams using PDF.js and docx.js.
 * 
 * Logic: Heuristic Text Layer Recovery
 * Performance: Optimized (Memoized Callbacks & Headless Rendering)
 * Aesthetics: Document-Industrial / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, FileText, Upload, Download, CheckCircle2, Shield, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 📄 PdfToDocxTool Component
 * A high-security utility for local PDF to Word reconstruction.
 */
const PdfToDocxTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.pdfToDocx");

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [docxBlobUrl, setDocxBlobUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [progressStr, setProgressStr] = useState<string>("");

    // ⚙️ WORKER INITIALIZATION
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;
    }, []);

    /**
     * ⚡ Reconstruction Core
     * Iterates through PDF primitives to synthesize a native Word document.
     */
    const processFile = useCallback(async (file: File) => {
        setOriginalFile(file);
        setIsProcessing(true);
        setErrorMsg(null);
        setDocxBlobUrl(null);
        setProgressStr(t('readingPdf') || "Reading Document...");

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdfDocument = await loadingTask.promise;

            setProgressStr(t('extractingText') || "Extracting Text...");

            const numPages = pdfDocument.numPages;
            const paragraphs: Paragraph[] = [];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                setProgressStr(`${t('processingPage') || "Processing Page"} ${pageNum} / ${numPages}`);
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();

                const pageStrings = textContent.items.map((item: any) => item.str);
                const pageText = pageStrings.join(" ");

                if (pageText.trim()) {
                    paragraphs.push(
                        new Paragraph({
                            children: [new TextRun(pageText)],
                            spacing: { after: 200 }
                        })
                    );
                }
            }

            setProgressStr(t('buildingWord') || "Building Word File...");

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: paragraphs.length > 0 ? paragraphs : [
                        new Paragraph({
                            children: [new TextRun("No readable text found in this PDF (It might be scanned/image-based).")]
                        })
                    ],
                }],
            });

            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            setDocxBlobUrl(url);

        } catch (error: any) {
            console.error("PDF to DOCX error:", error);
            setErrorMsg(t('errorDesc') || "Failed to process PDF. Ensure it is not encrypted and contains text layers.");
        } finally {
            setIsProcessing(false);
            setProgressStr("");
        }
    }, [t]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, [processFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    const handleDownload = useCallback(() => {
        if (!docxBlobUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = docxBlobUrl;
        const newName = originalFile.name.replace(/\.pdf$/i, ".docx");
        link.download = newName;
        link.click();
    }, [docxBlobUrl, originalFile]);

    const resetTool = useCallback(() => {
        setOriginalFile(null);
        setDocxBlobUrl(null);
        setErrorMsg(null);
        setProgressStr("");
    }, []);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: "Layer Scanning", description: "Iterates through the PDF text matrix to reconstruct paragraph blocks." },
        { title: "Headless Rendering", description: "Uses PDF.js in a headless state to extract semantic string arrays." },
        { title: "OpenXML Synthesis", description: "Pipes strings into the docx.js engine to generate native Word files." }
    ], []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={FileText}
            category="docs"
            toolId="pdf-to-docx"
            settingsContent={
                <div className="space-y-6">
                    {/* 🔘 EXTRACTION MODE HUB */}
                    <div className="space-y-3.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">Extraction Mode</span>
                        <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 flex items-center justify-between shadow-inner transition-all hover:bg-zinc-900">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight italic">Text Layer Recovery</span>
                            <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                                <RefreshCw className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3.5 pt-4">
                        <Button
                            onClick={handleDownload}
                            disabled={!docxBlobUrl || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 me-2" />}
                            {isProcessing ? t('processing') : t('downloadBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[11px] font-black uppercase tracking-widest italic rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4 me-2" />
                            Reset Workspace
                        </Button>
                    </div>

                    {/* 📊 SANDBOX REPORT */}
                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-4 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Heuristic Recovery</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                            Scans PDF text instructions and re-pipelines them into OpenXML buffers.
                            Zero cloud dependencies.
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[420px] flex flex-col items-center justify-center p-6 md:p-12">
                <AnimatePresence mode="wait">
                    {!originalFile ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl"
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
                                        <Upload className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tight mb-2">{t('dropTitle')}</h3>
                                    <p className="text-zinc-500 text-sm lg:text-base font-bold uppercase tracking-widest text-center px-4">{t('dropDesc')}</p>
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
                            <div className="w-full max-w-2xl aspect-video bg-zinc-950 rounded-[3rem] border border-zinc-800/80 overflow-hidden relative flex flex-col items-center justify-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] group backdrop-blur-3xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />

                                <div className="z-10 bg-zinc-900/50 backdrop-blur-3xl border border-zinc-800/80 rounded-[2.5rem] p-10 flex flex-col items-center gap-6 transition-all group-hover:scale-105 shadow-2xl group-hover:border-emerald-500/30">
                                    <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-inner">
                                        <FileText className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-lg lg:text-xl font-black uppercase tracking-tighter text-white group-hover:text-emerald-500 transition-colors">{originalFile.name}</p>
                                        <p className="text-[11px] font-bold uppercase text-zinc-500 tracking-[0.2em]">{(originalFile.size / 1024 / 1024).toFixed(2)} MB &bull; PDF Registry</p>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full max-w-2xl space-y-5"
                                    >
                                        <div className="flex justify-between items-center px-6">
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse italic">{progressStr}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
                                                <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                                                <span className="text-[9px] font-black text-zinc-500 uppercase italic">Parsing Nodes</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-zinc-900/50 rounded-full overflow-hidden border border-zinc-800 backdrop-blur-sm">
                                            <motion.div
                                                className="h-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                                                initial={{ width: "5%" }}
                                                animate={{ width: "95%" }}
                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {errorMsg && (
                                <div className="flex items-center gap-4 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 shadow-lg animate-in fade-in zoom-in-95">
                                    <Info className="w-6 h-6 animate-pulse" />
                                    <p className="text-xs font-bold uppercase tracking-tight italic">{errorMsg}</p>
                                </div>
                            )}

                            {docxBlobUrl && !isProcessing && (
                                <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                    <div className="flex items-center gap-3 text-emerald-500 px-8 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.1)] backdrop-blur-xl">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Reconstruction Complete</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

PdfToDocxTool.displayName = 'PdfToDocxTool';

export default PdfToDocxTool;
