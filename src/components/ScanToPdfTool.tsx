/**
 * 📄 PRIVAFLOW | Scan to PDF Converter
 * ---------------------------------------------------------
 * A structural document capture engine. Uses react-webcam
 * to securely capture high-res images directly from the local
 * camera and synthesizes them into a multi-page PDF using pdf-lib.
 * 
 * Logic: react-webcam (Capture) -> Arrays -> pdf-lib (PDF synthesis)
 * Performance: O(n) Local Compilation
 * Aesthetics: Document-Industrial / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, memo, useMemo, useRef } from "react";
import { Loader2, Camera, Download, CheckCircle2, RefreshCw, X } from "lucide-react";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Webcam from "react-webcam";
import { PDFDocument } from "pdf-lib";

/**
 * 📄 ScanToPdfTool Component
 * A high-security utility for local Scan to PDF conversion.
 */
const ScanToPdfTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.scanToPdf");

    // 📂 STATE ORCHESTRATION
    const [images, setImages] = useState<string[]>([]);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const webcamRef = useRef<Webcam>(null);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot({ width: 1920, height: 1080 });
            if (imageSrc) {
                setImages((prev) => [...prev, imageSrc]);
            }
        }
    }, [webcamRef]);

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    /**
     * ⚡ Extraction Core
     * Consolidates captured images into a PDF
     */
    const compilePdf = useCallback(async () => {
        if (images.length === 0) return;
        setIsProcessing(true);
        setPdfBlobUrl(null);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const imgSrc of images) {
                const imgBytes = await fetch(imgSrc).then(res => res.arrayBuffer());
                
                // Determine format
                let image;
                if (imgSrc.includes("image/jpeg")) {
                    image = await pdfDoc.embedJpg(imgBytes);
                } else if (imgSrc.includes("image/png")) {
                    image = await pdfDoc.embedPng(imgBytes);
                } else {
                    // Default fallback to JPEG for webcam
                    image = await pdfDoc.embedJpg(imgBytes);
                }

                // Create page with matching dimensions
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            
            setPdfBlobUrl(url);

        } catch (error: unknown) {
            console.error("Scan to PDF error:", error);
        } finally {
            setIsProcessing(false);
        }
    }, [images]);

    const handleDownload = useCallback(() => {
        if (!pdfBlobUrl) return;
        const link = document.createElement("a");
        link.href = pdfBlobUrl;
        link.download = `privaflow_scan_${Date.now()}.pdf`;
        link.click();
    }, [pdfBlobUrl]);

    const resetTool = useCallback(() => {
        setImages([]);
        setPdfBlobUrl(null);
    }, []);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.desc') },
        { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.desc') },
        { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.desc') }
    ], [t]);

    const videoConstraints = {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
        facingMode: "environment" // Prefer back camera on mobile
    };

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={Camera}
            category="docs"
            toolId="scan-to-pdf"
            settingsContent={
                <div className="space-y-4">
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Output Format</span>
                        <div className="border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Multi-Page PDF (.pdf)</span>
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">{images.length} Pages</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={pdfBlobUrl ? handleDownload : compilePdf}
                            disabled={images.length === 0 || isProcessing}
                            className="w-full h-10 bg-white hover:bg-zinc-100 disabled:opacity-40 text-black font-black rounded-sm text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            {pdfBlobUrl ? t('downloadBtn') : t('compilePdf')}
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
                    {!pdfBlobUrl ? (
                        <motion.div
                            key="capture"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex flex-col gap-6"
                        >
                            {/* Camera Feed */}
                            <div className="relative border border-zinc-800 bg-black overflow-hidden aspect-video w-full rounded-sm flex items-center justify-center group shadow-2xl">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
                                    <button 
                                        onClick={capture}
                                        className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur hover:bg-white/40 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                    >
                                        <div className="w-12 h-12 bg-white rounded-full" />
                                    </button>
                                </div>
                            </div>

                            {/* Captured Scans Grid */}
                            {images.length > 0 && (
                                <div className="p-4 border border-zinc-800 bg-zinc-950/50">
                                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-4">Captured Scans ({images.length})</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {images.map((src, idx) => (
                                            <div key={idx} className="relative aspect-[3/4] border border-zinc-800 group overflow-hidden">
                                                <img src={src} className="w-full h-full object-cover grayscale brightness-110" />
                                                <button 
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-mono text-white">
                                                    #{idx + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col gap-4"
                        >
                            <div className="flex items-center gap-3 p-8 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 justify-center flex-col shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                <CheckCircle2 className="w-12 h-12 shrink-0 mb-4" />
                                <p className="text-xl font-black uppercase tracking-widest">PDF Compiled Successfully</p>
                                <p className="text-sm font-mono tracking-widest text-emerald-500/60 mt-2">{images.length} pages generated securely</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

ScanToPdfTool.displayName = 'ScanToPdfTool';

export default ScanToPdfTool;
