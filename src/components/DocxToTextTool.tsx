/**
 * 📄 PRIVAFLOW | Word to Text Extractor
 * ---------------------------------------------------------
 * A structural document deconstruction engine. Parses 
 * OpenXML (.docx) bitstreams and harvests textual data 
 * using JSZip and native XML DOM parsing.
 * 
 * Logic: OpenXML / word/document.xml Parsing
 * Performance: O(n) Linear Extraction
 * Aesthetics: Document-Industrial / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, FileText, Upload, Download, CheckCircle2, Info, RefreshCw } from "lucide-react";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { VisualProof } from "@/components/VisualProof";

/**
 * 📄 DocxToTextTool Component
 * A high-security utility for local Word to Text extraction.
 */
const DocxToTextTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.docxToText");
    const tc = useTranslations("Tools.common");

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [textBlobUrl, setTextBlobUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * ⚡ Extraction Core
     * Parses the .docx zip structure and extracts text from document.xml.
     */
    const processFile = useCallback(async (file: File) => {
        setOriginalFile(file);
        setIsProcessing(true);
        setErrorMsg(null);
        setTextBlobUrl(null);

        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            
            // DOCX text is stored in word/document.xml
            const documentXml = await contents.file("word/document.xml")?.async("string");
            
            if (!documentXml) {
                throw new Error("Invalid DOCX structure: word/document.xml not found.");
            }

            // Refined extraction: handle paragraphs better
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(documentXml, "text/xml");
            const paragraphs = xmlDoc.getElementsByTagName("w:p");
            let finalOutput = "";
            for (let i = 0; i < paragraphs.length; i++) {
                const p = paragraphs[i];
                const tTags = p.getElementsByTagName("w:t");
                let pText = "";
                for (let j = 0; j < tTags.length; j++) {
                    pText += tTags[j].textContent;
                }
                if (pText) {
                    finalOutput += pText + "\n";
                } else {
                    finalOutput += "\n";
                }
            }

            const blob = new Blob([finalOutput], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            setTextBlobUrl(url);
        } catch (error: unknown) {
            console.error("Word to Text error:", error);
            setErrorMsg(t('errorDesc') || "Failed to extract text from Word file.");
        } finally {
            setIsProcessing(false);
        }
    }, [t]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, [processFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
        maxFiles: 1
    });

    const handleDownload = useCallback(() => {
        if (!textBlobUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = textBlobUrl;
        const newName = originalFile.name.replace(/\.docx$/i, ".txt");
        link.download = `privaflow_${newName}`;
        link.click();
    }, [textBlobUrl, originalFile]);

    const resetTool = useCallback(() => {
        setOriginalFile(null);
        setTextBlobUrl(null);
        setErrorMsg(null);
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
            icon={FileText}
            category="docs"
            toolId="word-to-text"
            settingsContent={
                <div className="space-y-4">
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Output Format</span>
                        <div className="border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Plain Text (.txt)</span>
                            <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleDownload}
                            disabled={!textBlobUrl || isProcessing}
                            className="w-full h-10 bg-white hover:bg-zinc-100 disabled:opacity-40 text-black font-black rounded-sm text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            {isProcessing ? t('extracting') : t('downloadBtn')}
                        </button>

                        <button
                            onClick={resetTool}
                            className="w-full h-10 border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                        >
                            <RefreshCw className="w-3.5 h-3.5 inline mr-2" />
                            {t('startOver')}
                        </button>
                    </div>

                    <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('howThisWorks')}</span>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                            {t('howThisWorksDesc')}
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {!originalFile ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full"
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
                                        "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-10 gap-4",
                                        isDragActive ? "border-white/40 bg-white/[0.03]" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className={cn("w-8 h-8", isDragActive ? "text-white" : "text-zinc-600")} />
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white uppercase tracking-widest">
                                            {isDragActive ? tc('dropActive') : t('dropTitle')}
                                        </p>
                                        <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">{t('dropDesc')}</p>
                                    </div>
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
                            {/* Visual Proof */}
                            <VisualProof
                                toolId="word-to-text"
                            />

                            {/* File info row */}
                            <div className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950">
                                <FileText className="w-8 h-8 text-zinc-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{originalFile.name}</p>
                                    <p className="text-xs text-zinc-600">{(originalFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>

                            {/* State Status */}
                            <AnimatePresence>
                                {isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t('extracting')}</span>
                                        </div>
                                        <div className="h-1 bg-zinc-900 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-white"
                                                initial={{ width: "5%" }}
                                                animate={{ width: "95%" }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            {errorMsg && (
                                <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5 text-red-400">
                                    <Info className="w-4 h-4 shrink-0" />
                                    <p className="text-xs font-bold uppercase tracking-tight">{errorMsg}</p>
                                </div>
                            )}

                            {/* Success */}
                            {textBlobUrl && !isProcessing && (
                                <div className="flex items-center gap-3 p-4 border border-white/10 bg-white/[0.02] text-white">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <p className="text-xs font-bold uppercase tracking-widest">{t('readyToDownload')}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

DocxToTextTool.displayName = 'DocxToTextTool';

export default DocxToTextTool;
