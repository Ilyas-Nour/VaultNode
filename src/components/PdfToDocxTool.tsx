"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, FileText, Upload, Download, CheckCircle2, FileType2, Shield, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PdfToDocxTool() {
    const t = useTranslations("Tools.pdfToDocx");

    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [docxBlobUrl, setDocxBlobUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [progressStr, setProgressStr] = useState<string>("");

    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;
    }, []);

    const processFile = async (file: File) => {
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
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, [t]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    const handleDownload = () => {
        if (!docxBlobUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = docxBlobUrl;
        const newName = originalFile.name.replace(/\.pdf$/i, ".docx");
        link.download = newName;
        link.click();
    };

    const resetTool = () => {
        setOriginalFile(null);
        setDocxBlobUrl(null);
        setErrorMsg(null);
        setProgressStr("");
    };

    return (
        <ToolContainer
            title={t('titleHighlight')}
            description={t('dropDesc')}
            icon={FileType2}
            category="docs"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Extraction Mode</span>
                        <div className="p-3 rounded-2xl border border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight italic">Text Layer Recovery</span>
                            <RefreshCw className="w-3 h-3 text-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={handleDownload}
                            disabled={!docxBlobUrl || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 me-2" />}
                            {isProcessing ? t('processing') : t('downloadBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <RefreshCw className="w-4 h-4 me-2" />
                            Reset Workspace
                        </Button>
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Heuristic Recovery</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Scans PDF text instructions and re-pipelines them into OpenXML buffers.
                            Zero cloud dependencies.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Layer Scanning", description: "Iterates through the PDF text matrix to reconstruct paragraph blocks." },
                { title: "Headless Rendering", description: "Uses PDF.js in a headless state to extract semantic string arrays." },
                { title: "OpenXML Synthesis", description: "Pipes strings into the docx.js engine to generate native Word files." }
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
                            <div className="w-full max-w-2xl aspect-video bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden relative flex flex-col items-center justify-center shadow-2xl group">
                                <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                                <div className="z-10 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
                                    <FileText className="w-12 h-12 text-emerald-500" />
                                    <div className="text-center">
                                        <p className="text-sm font-black uppercase tracking-tighter text-white">{originalFile.name}</p>
                                        <p className="text-[10px] font-bold uppercase text-zinc-500">{(originalFile.size / 1024 / 1024).toFixed(2)} MB &bull; PDF Registry</p>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full max-w-2xl space-y-4"
                                    >
                                        <div className="flex justify-between items-center px-4">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse italic">{progressStr}</span>
                                            </div>
                                            <RefreshCw className="w-3 h-3 text-emerald-500 animate-spin" />
                                        </div>
                                        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                            <motion.div
                                                className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                                initial={{ width: "10%" }}
                                                animate={{ width: "90%" }}
                                                transition={{ duration: 5, repeat: Infinity }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {errorMsg && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500">
                                    <Info className="w-5 h-5" />
                                    <p className="text-xs font-bold uppercase tracking-tight">{errorMsg}</p>
                                </div>
                            )}

                            {docxBlobUrl && !isProcessing && (
                                <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                    <div className="flex items-center gap-2 text-emerald-500 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Reconstruction Complete</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
}
