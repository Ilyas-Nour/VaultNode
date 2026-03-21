/**
 * 📄 PRIVAFLOW | Excel to PDF Converter
 * ---------------------------------------------------------
 * A structural document conversion engine. Uses xlsx (SheetJS)
 * to parse spreadsheet data entirely in memory, constructs
 * organized HTML tables, and renders them to PDF using html2pdf.js.
 * 
 * Logic: xlsx (Excel -> HTML) -> html2pdf.js (HTML -> PDF)
 * Performance: O(n) Linear Conversion
 * Aesthetics: Document-Industrial / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Table, Upload, Download, CheckCircle2, Info, RefreshCw } from "lucide-react";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import { VisualProof } from "@/components/VisualProof";

/**
 * 📄 ExcelToPdfTool Component
 * A high-security utility for local Excel to PDF conversion.
 */
const ExcelToPdfTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.excelToPdf");
    const tc = useTranslations("Tools.common");

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * ⚡ Extraction Core
     * Parses Excel sheets and renders them sequentially into a PDF
     */
    const processFile = useCallback(async (file: File) => {
        setOriginalFile(file);
        setIsProcessing(true);
        setErrorMsg(null);
        setPdfBlobUrl(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });

            let fullHtml = `
            <style>
                body { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 11pt; color: #111; margin: 0; padding: 0; }
                .sheet-container { padding: 40px; background: #fff; }
                .header { border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; }
                .header h2 { margin: 0; font-size: 22pt; font-weight: 800; text-transform: uppercase; letter-spacing: -0.03em; color: #000; }
                .brand { font-size: 9px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.15em; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 50px; table-layout: auto; }
                th, td { border: 1px solid #e0e0e0; padding: 12px 15px; text-align: left; line-height: 1.4; }
                th { background-color: #f9f9f9; font-weight: 700; color: #444; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; }
                tr:nth-child(even) { background-color: #fafafa; }
                .page-break { page-break-after: always; }
            </style>
            `;

            workbook.SheetNames.forEach((sheetName, index) => {
                const sheet = workbook.Sheets[sheetName];
                const html = XLSX.utils.sheet_to_html(sheet);
                const isLast = index === workbook.SheetNames.length - 1;
                
                fullHtml += `
                <div class="sheet-container ${!isLast ? 'page-break' : ''}">
                    <div class="header">
                        <h2>${sheetName}</h2>
                        <span class="brand">PrivaFlow Archive</span>
                    </div>
                    ${html}
                </div>`;
            });

            const container = document.createElement("div");
            container.innerHTML = fullHtml;

            const opt = {
                margin:       10,
                filename:     file.name.replace(/\.(xlsx|xls|csv)$/i, ".pdf"),
                image:        { type: 'jpeg' as const, quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
            };

            const worker = html2pdf().set(opt).from(container);
            const pdfBlob = await worker.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            
            setPdfBlobUrl(url);

        } catch (error: unknown) {
            console.error("Excel to PDF error:", error);
            setErrorMsg(t('errorDesc') || "Failed to convert Excel file.");
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
        accept: { 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv']
        },
        maxFiles: 1
    });

    const handleDownload = useCallback(() => {
        if (!pdfBlobUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = pdfBlobUrl;
        const newName = originalFile.name.replace(/\.(xlsx|xls|csv)$/i, ".pdf");
        link.download = `privaflow_${newName}`;
        link.click();
    }, [pdfBlobUrl, originalFile]);

    const resetTool = useCallback(() => {
        setOriginalFile(null);
        setPdfBlobUrl(null);
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
            icon={Table}
            category="docs"
            toolId="excel-to-pdf"
            settingsContent={
                <div className="space-y-4">
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Output Format</span>
                        <div className="border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">PDF Document (.pdf)</span>
                            <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleDownload}
                            disabled={!pdfBlobUrl || isProcessing}
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
                            {/* Visual Proof */}
                            <VisualProof
                                toolId="excel-to-pdf"
                            />

                            {/* File info row */}
                            <div className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950">
                                <Table className="w-8 h-8 text-zinc-600 shrink-0" />
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
                                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t('converting')}</span>
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
                            {pdfBlobUrl && !isProcessing && (
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

ExcelToPdfTool.displayName = 'ExcelToPdfTool';

export default ExcelToPdfTool;
