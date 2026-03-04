/**
 * 🖼️ PRIVAFLOW | PDF to Image Rasterizer
 * ---------------------------------------------------------
 * A high-speed document visualization engine. Flattens PDF
 * vector stacks into pixel-perfect JPEG slices using 
 * Mozilla's PDF.js and JSZip for archive bundling.
 * 
 * Logic: Canvas-Based Layer Rasterization
 * Performance: Optimized (Memoized Callbacks & Scale Orchestration)
 * Aesthetics: Industrial-Visual / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, Loader2, Image as ImageIcon, FileArchive, Shield, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 🖼️ PdfToImgTool Component
 * A high-security utility for local PDF to Image conversion.
 */
const PdfToImgTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.pdfToImg");

    // 📂 STATE ORCHESTRATION
    const [file, setFile] = useState<File | null>(null);
    const [scale, setScale] = useState<number>(2); // 1 = Normal, 2 = High, 3 = Ultra
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // ⚙️ WORKER INITIALIZATION
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

    /**
     * 📂 Queue Management
     */
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    /**
     * ⚡ Rasterization Core
     * Flattens document layers into atomic image buffers.
     */
    const handleExtract = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            setTotalPages(pdf.numPages);
            const zip = new JSZip();

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) throw new Error("Could not create canvas context");

            for (let i = 1; i <= pdf.numPages; i++) {
                setProgress(i);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: ctx,
                    viewport: viewport
                } as any).promise;

                const blob = await new Promise<Blob | null>((resolve) => {
                    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95);
                });

                if (blob) {
                    const pageNum = i.toString().padStart(3, '0');
                    zip.file(`page_${pageNum}.jpg`, blob);
                }
            }

            const zipContent = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(zipContent);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace('.pdf', '')}_images.zip`;
            link.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Extraction error:", error);
        } finally {
            setIsProcessing(false);
        }
    }, [file, scale]);

    const resetTool = useCallback(() => {
        setFile(null);
        setProgress(0);
        setTotalPages(0);
    }, []);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: "Layer Rasterization", description: "Flattens PDF vector instructions into pixel-perfect JPEG slices." },
        { title: "Atomic Extraction", description: "Processes each page in a sandboxed worker thread for speed." },
        { title: "Binary Packaging", description: "Zips all rendered images into a single local archive." }
    ], []);

    // ⚙️ RENDER CONFIGURATIONS
    const scaleOptions = useMemo(() => [
        { val: 1, label: "Standard", desc: '72 DPI' },
        { val: 2, label: "High Definition", desc: '144 DPI' },
        { val: 3, label: "Ultra Precision", desc: '216 DPI' },
    ], []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={ImageIcon}
            category="docs"
            toolId="pdf-to-img"
            settingsContent={
                <div className="space-y-6">
                    {/* 🔘 RENDER DENSITY HUB */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Render Density</span>
                        <div className="space-y-2">
                            {scaleOptions.map((s) => (
                                <button
                                    key={s.val}
                                    onClick={() => setScale(s.val)}
                                    className={cn(
                                        "w-full p-3 rounded-xl border flex items-center justify-between transition-all italic",
                                        scale === s.val
                                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
                                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                                    <span className="text-[9px] font-bold opacity-50">{s.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={handleExtract}
                            disabled={isProcessing || !file}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4 me-2" />}
                            {isProcessing ? t('processing') : t('convertPages')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <FileArchive className="w-4 h-4 me-2" />
                            New Archive
                        </Button>
                    </div>

                    {/* 📊 SANDBOX REPORT */}
                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">In-Browser PDF.js</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Uses Mozilla&apos;s PDF.js to render slices directly to canvas.
                            Your documents never touch our infra.
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[450px] flex flex-col items-center justify-center p-6 md:p-12">
                <AnimatePresence mode="wait">
                    {!file ? (
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
                                    <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                                        <FileUp className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
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
                            {/* 📟 PROCESSING REPORT CARD */}
                            <div className="w-full max-w-2xl aspect-video bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden relative flex flex-col items-center justify-center shadow-2xl group">
                                <div className="z-10 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
                                    <FileUp className="w-12 h-12 text-emerald-500" />
                                    <div className="text-center">
                                        <p className="text-sm font-black uppercase tracking-tighter text-white">{file.name}</p>
                                        <p className="text-[10px] font-bold uppercase text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB &bull; PDF Registry</p>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isProcessing && totalPages > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full max-w-2xl space-y-4"
                                    >
                                        <div className="flex justify-between items-center px-4">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse italic">Extracting Page {progress} of {totalPages}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-500 italic">{Math.round((progress / totalPages) * 100)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                            <motion.div
                                                className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(progress / totalPages) * 100}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 📟 FLOW METRICS */}
                            <div className="flex items-center gap-8 px-8 py-4 bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-xl">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Input Buffer</span>
                                    <Layers className="w-5 h-5 text-zinc-500" />
                                </div>
                                <FileArchive className={cn("w-5 h-5 text-emerald-500", isProcessing && "animate-bounce")} />
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">ZIP Package</span>
                                    <ImageIcon className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

PdfToImgTool.displayName = 'PdfToImgTool';

export default PdfToImgTool;
