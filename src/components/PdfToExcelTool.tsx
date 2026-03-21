/**
 * 📄 PRIVAFLOW | PDF to Excel Converter
 * ---------------------------------------------------------
 * A structural document conversion engine. Uses pdfjs-dist
 * to extract textual elements and their spatial coordinates,
 * reconstructs the logical table grid, and generates an XLSX
 * file locally using SheetJS.
 * 
 * Logic: pdfjs (Spatial Text) -> Array of Arrays -> xlsx (AOA to Sheet)
 * Performance: O(n log n) Spatial Sorting
 * Aesthetics: Document-Industrial / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, FileSpreadsheet, Upload, Download, CheckCircle2, Info, RefreshCw } from "lucide-react";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from "xlsx";
import { VisualProof } from "@/components/VisualProof";

// Setup PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/worker.ts";

/**
 * 📄 PdfToExcelTool Component
 * A high-security utility for local PDF to Excel conversion.
 */
const PdfToExcelTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.pdfToExcel");
    const tc = useTranslations("Tools.common");

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [excelBlobUrl, setExcelBlobUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * ⚡ Spatial Extraction Core
     * Groups text items into rows and columns based on their x,y coordinates
     */
    const processFile = useCallback(async (file: File) => {
        setOriginalFile(file);
        setIsProcessing(true);
        setErrorMsg(null);
        setExcelBlobUrl(null);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            const totalPages = pdf.numPages;
            const allRows: any[][] = [];

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Group items by Y coordinate (rows). Allow a small epsilon for slight misalignments.
                const rowEpsilon = 5;
                const rowsMap = new Map<number, any[]>();

                textContent.items.forEach((item: any) => {
                    const y = Number(item.transform[5]) || 0;
                    const x = Number(item.transform[4]) || 0;
                    const text = item.str.trim();
                    
                    if (!text) return;

                    // Bucketing: group Y-coordinates within 5 units of each other
                    let foundY = Array.from(rowsMap.keys()).find(key => Math.abs(key - y) < 5);
                    const targetY = foundY !== undefined ? foundY : y;

                    if (!rowsMap.has(targetY)) rowsMap.set(targetY, []);
                    rowsMap.get(targetY)?.push({ x, text });
                });

                // Sort rows by Y coordinate (top to bottom)
                const sortedY = Array.from(rowsMap.keys()).sort((a, b) => b - a);
                sortedY.forEach(y => {
                    const rowItems = rowsMap.get(y) || [];
                    // Sort items in row left to right
                    rowItems.sort((a, b) => a.x - b.x);
                    allRows.push(rowItems.map(item => item.text));
                });

                // Add empty row between pages
                if (i < totalPages) allRows.push([]);

                setProgress(Math.round((i / totalPages) * 100));
            }

            if (allRows.length === 0) {
                allRows.push(["No extractable text found in PDF."]);
            }

            // Create workbook and write
            const worksheet = XLSX.utils.aoa_to_sheet(allRows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Extraction");

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = URL.createObjectURL(blob);
            
            setExcelBlobUrl(url);

        } catch (error: unknown) {
            console.error("PDF to Excel error:", error);
            setErrorMsg(t('errorDesc') || "Failed to convert PDF file.");
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
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    const handleDownload = useCallback(() => {
        if (!excelBlobUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = excelBlobUrl;
        const newName = originalFile.name.replace(/\.pdf$/i, ".xlsx");
        link.download = `privaflow_${newName}`;
        link.click();
    }, [excelBlobUrl, originalFile]);

    const resetTool = useCallback(() => {
        setOriginalFile(null);
        setExcelBlobUrl(null);
        setErrorMsg(null);
        setProgress(0);
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
            icon={FileSpreadsheet}
            category="docs"
            toolId="pdf-to-excel"
            settingsContent={
                <div className="space-y-4">
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Output Format</span>
                        <div className="border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Excel Spreadsheet (.xlsx)</span>
                            <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleDownload}
                            disabled={!excelBlobUrl || isProcessing}
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
                                toolId="pdf-to-excel"
                            />

                            {/* File info row */}
                            <div className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950">
                                <FileSpreadsheet className="w-8 h-8 text-zinc-600 shrink-0" />
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
                                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t('converting')} {progress}%</span>
                                        </div>
                                        <div className="h-1 bg-zinc-900 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-white"
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.2 }}
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
                            {excelBlobUrl && !isProcessing && (
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

PdfToExcelTool.displayName = 'PdfToExcelTool';

export default PdfToExcelTool;
