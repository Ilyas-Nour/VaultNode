/**
 * 🧹 PRIVAFLOW | Global EXIF Scrubber
 * ---------------------------------------------------------
 * A surgical tool for removing digital fingerprints (Metadata)
 * from image files. Ensures absolute anonymity before sharing.
 * 
 * Logic: Canvas-Reconstruction (Total Metadata Wipe)
 * Performance: High (Fully Memoized State & Pipeline)
 * Aesthetics: Tactical-Premium / Silver-Emerald
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, ImageMinus, Upload, Download, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 🧹 CleanExifTool Component
 * The primary utility for image metadata sanitization.
 * Operates by re-rendering the image onto a clean canvas buffer.
 */
const CleanExifTool = memo(() => {
    const t = useTranslations('Tools.cleanExif');
    const tc = useTranslations('Tools.common');

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cleanUrl, setCleanUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasExif, setHasExif] = useState(false);

    const checkExif = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            if (!buffer) return;
            const view = new DataView(buffer);
            if (view.byteLength < 2 || view.getUint16(0, false) !== 0xFFD8) {
                setHasExif(false);
                return;
            }
            let offset = 2;
            let foundExif = false;
            while (offset < view.byteLength) {
                if (offset + 4 > view.byteLength) break;
                const marker = view.getUint16(offset, false);
                if (marker === 0xFFE1) {
                    foundExif = true;
                    break;
                }
                const length = view.getUint16(offset + 2, false);
                offset += 2 + length;
            }
            setHasExif(foundExif);
        };
        reader.readAsArrayBuffer(file.slice(0, 65536));
    }, []);

    const processImage = useCallback(async (file: File) => {
        setIsProcessing(true);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        checkExif(file);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d", { alpha: true });

            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const mimeType = file.type.includes('png') ? 'image/png' :
                    file.type.includes('webp') ? 'image/webp' : 'image/jpeg';

                canvas.toBlob((blob) => {
                    if (blob) {
                        const cleanObjectUrl = URL.createObjectURL(blob);
                        setCleanUrl(cleanObjectUrl);
                        setIsProcessing(false);
                    }
                }, mimeType, 0.95);
            }
        };
        img.onerror = () => {
            setIsProcessing(false);
            console.error("Purification failure");
        };
        img.src = url;
    }, [checkExif]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setOriginalFile(file);
            processImage(file);
        }
    }, [processImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        maxFiles: 1
    });

    const handleDownload = useCallback(() => {
        if (!cleanUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = cleanUrl;
        link.download = `cleaned-${originalFile.name}`;
        link.click();
    }, [cleanUrl, originalFile]);

    const resetTool = useCallback(() => {
        setOriginalFile(null);
        setPreviewUrl(null);
        setCleanUrl(null);
        setHasExif(false);
        setIsProcessing(false);
    }, []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={ImageMinus}
            category="vault"
            toolId="clean-exif"
            settingsContent={
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('securityLevel')}</span>
                            <span className="text-xl font-black text-white">{t('atomic')}</span>
                        </div>
                        <div className="h-1 bg-zinc-900 w-full overflow-hidden">
                            <div className="h-full bg-white w-full" />
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed">
                            {t('dropDesc')}
                        </p>
                    </div>

                    {originalFile && (
                        <div className="space-y-4">
                            <Button
                                onClick={handleDownload}
                                disabled={!cleanUrl || isProcessing}
                                className="w-full h-14 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                            >
                                {t('downloadBtn')}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={resetTool}
                                className="w-full h-14 border-zinc-800 text-zinc-400 hover:text-white hover:border-white font-black uppercase tracking-widest text-xs transition-all"
                            >
                                {t('cleanBtn')}
                            </Button>
                        </div>
                    )}
                </div>
            }
            howItWorks={[
                { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.desc') },
                { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.desc') },
                { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.desc') }
            ]}
        >
            <div className="w-full min-h-[400px] flex items-center justify-center">
                {!originalFile ? (
                    <div {...getRootProps()} className={cn(
                        "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-10 gap-4",
                        isDragActive ? "border-white/40 bg-white/[0.03]" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                    )}>
                        <input {...getInputProps()} />
                        <Upload className={cn("w-8 h-8", isDragActive ? "text-white" : "text-zinc-600")} />
                        <div className="text-center">
                            <p className="text-sm font-bold text-white uppercase tracking-widest">
                                {isDragActive ? tc('dropActive') : t('dropTitle')}
                            </p>
                            <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">JPG · PNG · WebP</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1 px-6 py-10">
                        <div className="aspect-square bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800">
                            <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-widest mb-4">{t('original')}</span>
                            {previewUrl && <img src={previewUrl} className="max-h-[70%] opacity-60" />}
                            {hasExif && <span className="mt-4 text-[10px] font-bold text-red-400 uppercase tracking-widest border border-red-500/20 px-4 py-1">{t('hiddenDetected')}</span>}
                        </div>
                        <div className="aspect-square bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-4">{t('cleaned')}</span>
                            {isProcessing ? (
                                <Loader2 className="w-8 h-8 animate-spin text-white" />
                            ) : (
                                cleanUrl && <img src={cleanUrl} className="max-h-[70%] p-4" />
                            )}
                            {!isProcessing && <span className="mt-4 text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 px-4 py-1">{t('metadataRemoved')}</span>}
                        </div>
                    </div>
                )}
            </div>
        </ToolContainer>
    );
});

CleanExifTool.displayName = 'CleanExifTool';

export default CleanExifTool;
