/**
 * ✍️ PRIVAFLOW | Handwriting to Text OCR
 * ---------------------------------------------------------
 * A high-accuracy local OCR engine for handwriting.
 * Uses Tesseract.js (LSTM) to process images in-browser.
 * 
 * Logic: Image (Upload/Cam) -> Preprocessing (Canvas) -> Tesseract.js (OCR) -> Text (.txt)
 * Privacy: 100% Client-Side
 * 
 * Accuracy Improvements:
 * - Canvas Preprocessing: Grayscale + Contrast Normalization.
 * - OCR Tuning: PSM 6 (Single Block) + Preserve Spaces.
 */

"use client";

import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from "react";
import { Loader2, Camera, Download, RefreshCw, X, FileText, Copy, UploadCloud, Sparkles } from "lucide-react";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { useDropzone } from "react-dropzone";

const ImageToTextTool = memo(() => {
    const t = useTranslations("Tools.imageToText");
    
    const [image, setImage] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showCamera, setShowCamera] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [useEnhancement, setUseEnhancement] = useState(true);
    
    const webcamRef = useRef<Webcam>(null);

    // 🎨 IMAGE PREPROCESSING (Internal helper)
    const preprocessImage = useCallback(async (imageSrc: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(imageSrc);
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // 1. Grayscale (Luminance)
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }

                // 2. Contrast Stretching (Normalization)
                let min = 255;
                let max = 0;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] < min) min = data[i];
                    if (data[i] > max) max = data[i];
                }

                const range = max - min;
                if (range > 0) {
                    const ratio = 255 / range;
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = (data[i] - min) * ratio;
                        data[i + 1] = (data[i + 1] - min) * ratio;
                        data[i + 2] = (data[i + 2] - min) * ratio;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', 0.95));
            };
            img.src = imageSrc;
        });
    }, []);

    // ⚡ OCR CORE
    const runOCR = useCallback(async (src: string) => {
        setIsProcessing(true);
        setProgress(0);
        setExtractedText("");

        let finalImage = src;

        if (useEnhancement) {
            setIsEnhancing(true);
            finalImage = await preprocessImage(src);
            setIsEnhancing(false);
        }

        try {
            const result = await Tesseract.recognize(finalImage, 'eng', {
                logger: (m: any) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                },
                // OPTIMIZED PARAMETERS FOR HANDWRITING
                // PSM 6: Assume a single uniform block of text.
                // preserve_interword_spaces: Preserve multiple spaces
            } as any);
            
            // Note: Tesseract.js parameters are usually passed in Worker.initialize or setParameters,
            // but for simplicity in recognize call we use the default for now or pass config.
            // Let's use the worker approach for deeper control if needed, but recognize is the common entry.
            // Re-configuring the worker for PSM 6:
            const worker = await Tesseract.createWorker('eng', 1, {
                logger: (m: any) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                }
            });
            await worker.setParameters({
                tessedit_pageseg_mode: '6' as any,
                preserve_interword_spaces: '1',
            });
            const { data: { text } } = await worker.recognize(finalImage);
            setExtractedText(text.trim());
            await worker.terminate();

        } catch (error) {
            console.error("OCR Error:", error);
        } finally {
            setIsProcessing(false);
            setIsEnhancing(false);
        }
    }, [useEnhancement, preprocessImage]);

    // 📸 Auto-trigger OCR when an image is loaded
    useEffect(() => {
        if (image) {
            runOCR(image);
        }
    }, [image, runOCR]);

    // 📸 CAMERA CAPTURE
    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot({ width: 1920, height: 1080 });
            if (imageSrc) {
                setImage(imageSrc);
                setShowCamera(false);
            }
        }
    }, [webcamRef]);

    // 📂 FILE DROPZONE
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        multiple: false
    });

    // 💾 ACTIONS
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(extractedText).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    }, [extractedText]);

    const handleDownload = useCallback(() => {
        const blob = new Blob([extractedText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `privaflow_text_${Date.now()}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    }, [extractedText]);

    const reset = useCallback(() => {
        setImage(null);
        setExtractedText("");
        setProgress(0);
        setShowCamera(false);
        setCopySuccess(false);
        setIsEnhancing(false);
    }, []);

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
            toolId="image-to-text"
            settingsContent={
                <div className="space-y-4">
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">{t('operationMode')}</span>
                        <div className="border border-zinc-800 bg-zinc-950 p-3 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">High-Accuracy LSTM</span>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">Active</span>
                            </div>
                            
                            <div className="h-px bg-zinc-900 w-full" />
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Neural Enhancement</span>
                                </div>
                                <button
                                    onClick={() => setUseEnhancement(!useEnhancement)}
                                    className={cn(
                                        "w-10 h-5 rounded-full relative transition-all duration-300",
                                        useEnhancement ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-800"
                                    )}
                                >
                                    <motion.div 
                                        animate={{ x: useEnhancement ? 22 : 2 }}
                                        className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {extractedText && (
                            <button
                                onClick={handleDownload}
                                className="w-full h-10 bg-white hover:bg-zinc-100 text-black font-black rounded-sm text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>{t('downloadBtn')}</span>
                            </button>
                        )}

                        <button
                            onClick={reset}
                            className="w-full h-10 border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                        >
                            <RefreshCw className="w-3.5 h-3.5 inline mr-2" />
                            {t('startOver')}
                        </button>
                    </div>

                    <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">Privacy Protocol</span>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                            {t('privacyNote')}
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {!image && !showCamera ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full"
                        >
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "w-full border-2 border-dashed rounded-sm aspect-video flex flex-col items-center justify-center cursor-pointer transition-all",
                                    isDragActive ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
                                )}
                            >
                                <input {...getInputProps()} />
                                <UploadCloud className="w-12 h-12 text-zinc-700 mb-6" />
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4 text-center px-4">{t('dropHint')}</p>
                                <div className="flex items-center gap-4 w-full max-w-xs">
                                    <div className="flex-1 h-px bg-zinc-800" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">{t('orUseCamera')}</span>
                                    <div className="flex-1 h-px bg-zinc-800" />
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowCamera(true); }}
                                    className="mt-6 flex items-center gap-2 px-6 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    <Camera className="w-4 h-4" />
                                    {t('openCamera')}
                                </button>
                            </div>
                        </motion.div>
                    ) : showCamera ? (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full relative aspect-video bg-black border border-zinc-800 overflow-hidden"
                        >
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "environment" }}
                                className="w-full h-full object-cover grayscale brightness-110"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-center bg-gradient-to-t from-black to-transparent">
                                <button onClick={() => setShowCamera(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={capture}
                                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur hover:bg-white/40 transition-all shadow-2xl"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full" />
                                </button>
                                <div className="w-6" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="captured"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full flex flex-col gap-6"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* BEFORE: Image */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('sourceInput')}</span>
                                        <button onClick={reset} className="text-zinc-600 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                                    </div>
                                    <div className="relative border border-zinc-800 bg-zinc-950 p-2 shadow-2xl overflow-hidden group">
                                        <img src={image!} className="w-full aspect-auto max-h-[400px] object-contain opacity-80" alt="Source handwriting" />
                                        {isEnhancing && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                                <Sparkles className="w-10 h-10 text-emerald-500 animate-pulse" />
                                                <div className="text-center">
                                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500">{t('enhancing')}</p>
                                                    <p className="text-[9px] text-zinc-400 mt-1 uppercase tracking-widest">{t('enhancingDesc')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* AFTER: Text Output */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('digitalArchive')}</span>
                                        {extractedText && (
                                            <button 
                                                onClick={handleCopy}
                                                className={cn(
                                                    "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors",
                                                    copySuccess ? "text-emerald-500" : "text-zinc-500 hover:text-emerald-500"
                                                )}
                                            >
                                                <Copy className="w-3 h-3" />
                                                {copySuccess ? "Copied!" : t('copyBtn')}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1 min-h-[300px] md:min-h-[400px] border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-sm shadow-inner relative overflow-hidden">
                                        <AnimatePresence>
                                            {isProcessing && !isEnhancing && (
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/40 backdrop-blur-sm gap-4"
                                                >
                                                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80 animate-pulse">{t('processing')} {progress}%</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        {extractedText ? (
                                            <textarea
                                                value={extractedText}
                                                onChange={(e) => setExtractedText(e.target.value)}
                                                className="w-full h-full bg-transparent border-none focus:ring-0 text-zinc-300 leading-relaxed resize-none p-0"
                                                spellCheck={false}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full opacity-20">
                                                <div className="relative">
                                                    <FileText className="w-12 h-12 mb-4" />
                                                    {isProcessing && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>}
                                                </div>
                                                <span className="text-[10px] uppercase font-black tracking-widest">{t('awaitingExtraction')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons in main panel */}
                                    <div className="flex gap-3">
                                        {extractedText && (
                                            <button
                                                onClick={handleDownload}
                                                className="flex-1 h-10 bg-white hover:bg-zinc-100 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 rounded-sm"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                {t('downloadBtn')}
                                            </button>
                                        )}
                                        <button
                                            onClick={reset}
                                            className="flex-1 h-10 border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            {t('startOver')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

ImageToTextTool.displayName = 'ImageToTextTool';

export default ImageToTextTool;
