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
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 📄 PdfToDocxTool Component
 * A high-security utility for local PDF to Word reconstruction.
 */
const PdfToDocxTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.pdfToDocx");
    const tc = useTranslations("Tools.common");

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [docxBlobUrl, setDocxBlobUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [progressStr, setProgressStr] = useState<string>("");

    // ⚙️ WORKER INITIALIZATION
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

    /**
     * ⚡ Reconstruction Core
     * Parses PDF structure to extract both text layers and image assets.
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

            const numPages = pdfDocument.numPages;
            const docChildren: any[] = [];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                setProgressStr(`${t('processingPage') || "Processing Page"} ${pageNum} / ${numPages}`);
                const page = await pdfDocument.getPage(pageNum);
                
                // --- Part A: Text Extraction with Layout Awareness ---
                const textContent = await page.getTextContent();
                
                // Group text items by their vertical position (Y-coordinate)
                // transform[5] is the Y-coordinate in PDF space (starts from bottom)
                const lineMap = new Map<number, any[]>();
                textContent.items.forEach((item: any) => {
                    const y = Math.round(item.transform[5]);
                    // Use a small threshold for grouping items on the same line
                    let foundKey = Array.from(lineMap.keys()).find(k => Math.abs(k - y) < 5);
                    if (foundKey !== undefined) {
                        lineMap.get(foundKey)?.push(item);
                    } else {
                        lineMap.set(y, [item]);
                    }
                });

                // Sort lines from top to bottom (highest Y to lowest Y in PDF space)
                const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);

                sortedY.forEach(y => {
                    const items = lineMap.get(y) || [];
                    // Sort items in the line from left to right (X-coordinate: transform[4])
                    items.sort((a, b) => a.transform[4] - b.transform[4]);
                    
                    const lineText = items.map(it => it.str).join(" ");
                    if (lineText.trim()) {
                        docChildren.push(
                            new Paragraph({
                                children: [new TextRun(lineText)],
                                spacing: { after: 200 }
                            })
                        );
                    }
                });

                // --- Part B: Image extraction from page resources ---
                try {
                    const opList = await page.getOperatorList();
                    const imgOps = [
                        pdfjsLib.OPS.paintImageXObject,
                        pdfjsLib.OPS.paintInlineImageXObject,
                        pdfjsLib.OPS.paintImageMaskXObject
                    ];

                    for (let i = 0; i < opList.fnArray.length; i++) {
                        if (imgOps.includes(opList.fnArray[i])) {
                            const imgId = opList.argsArray[i][0];
                            // Helper to get image data from PDF.js objects
                            const imgObj = await new Promise<any>((resolve) => {
                                // Try common objects first, then page objects
                                page.commonObjs.get(imgId, (data: any) => {
                                    if (data) resolve(data);
                                    else page.objs.get(imgId, resolve);
                                });
                            });

                            if (imgObj && imgObj.data) {
                                // Convert raw pixels to temporary PNG for docx ingestion
                                const canvas = document.createElement("canvas");
                                canvas.width = imgObj.width;
                                canvas.height = imgObj.height;
                                const ctx = canvas.getContext("2d");
                                if (ctx) {
                                    const imageData = ctx.createImageData(imgObj.width, imgObj.height);
                                    // Handle both RGB and RGBA formats
                                    if (imgObj.data.length === imgObj.width * imgObj.height * 3) {
                                        for (let j = 0, k = 0; j < imgObj.data.length; j += 3, k += 4) {
                                            imageData.data[k] = imgObj.data[j];
                                            imageData.data[k + 1] = imgObj.data[j + 1];
                                            imageData.data[k + 2] = imgObj.data[j + 2];
                                            imageData.data[k + 3] = 255;
                                        }
                                    } else {
                                        imageData.data.set(imgObj.data);
                                    }
                                    ctx.putImageData(imageData, 0, 0);
                                    
                                    const imgDataUrl = canvas.toDataURL("image/png");
                                    const imgBuffer = await (await fetch(imgDataUrl)).arrayBuffer();
                                    
                                    docChildren.push(
                                        new Paragraph({
                                            children: [
                                                new ImageRun({
                                                    data: new Uint8Array(imgBuffer),
                                                    transformation: {
                                                        width: Math.min(imgObj.width, 500),
                                                        height: (Math.min(imgObj.width, 500) / imgObj.width) * imgObj.height,
                                                    }
                                                } as any) // Use as any to bypass strict version-specific type mismatch in docx v9
                                            ],
                                            spacing: { before: 200, after: 200 }
                                        })
                                    );
                                }
                            }
                        }
                    }
                } catch (imgErr) {
                    console.warn(`Could not extract images from page ${pageNum}:`, imgErr);
                }
            }

            setProgressStr(t('buildingWord') || "Building Word File...");

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: docChildren.length > 0 ? docChildren : [
                        new Paragraph({
                            children: [new TextRun("No readable content found in this PDF.")]
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
        link.download = `privaflow_${newName}`;
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
            toolId="pdf-to-docx"
            settingsContent={
                <div className="space-y-4">
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Output Format</span>
                        <div className="border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Word Document (.docx)</span>
                            <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleDownload}
                            disabled={!docxBlobUrl || isProcessing}
                            className="w-full h-10 bg-white hover:bg-zinc-100 disabled:opacity-40 text-black font-black rounded-sm text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            {isProcessing ? t('converting') : t('downloadBtn')}
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
                            {/* File info row */}
                            <div className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950">
                                <FileText className="w-8 h-8 text-zinc-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{originalFile.name}</p>
                                    <p className="text-xs text-zinc-600">{(originalFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>

                            {/* Progress */}
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
                                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{progressStr}</span>
                                        </div>
                                        <div className="h-1 bg-zinc-900 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-white"
                                                initial={{ width: "5%" }}
                                                animate={{ width: "95%" }}
                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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
                            {docxBlobUrl && !isProcessing && (
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

PdfToDocxTool.displayName = 'PdfToDocxTool';

export default PdfToDocxTool;
