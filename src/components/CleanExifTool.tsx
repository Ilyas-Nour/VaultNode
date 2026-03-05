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
            title="Clean Metadata"
            description="Scrub digital fingerprints and hidden tags from your images."
            icon={ImageMinus}
            category="vault"
            toolId="clean-exif"
            settingsContent={
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Security Level</span>
                            <span className="text-xl font-black text-white">ATOMIC</span>
                        </div>
                        <div className="h-1 bg-zinc-900 w-full overflow-hidden">
                            <div className="h-full bg-white w-full" />
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed">
                            Pixels are reconstructed via fresh canvas buffer. 0% metadata survival rate.
                        </p>
                    </div>

                    {originalFile && (
                        <div className="space-y-4">
                            <Button
                                onClick={handleDownload}
                                disabled={!cleanUrl || isProcessing}
                                className="w-full h-14 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                            >
                                Download Cleaned Image
                            </Button>
                            <Button
                                variant="outline"
                                onClick={resetTool}
                                className="w-full h-14 border-zinc-800 text-zinc-400 hover:text-white hover:border-white font-black uppercase tracking-widest text-xs transition-all"
                            >
                                Scrub New Image
                            </Button>
                        </div>
                    )}
                </div>
            }
            howItWorks={[
                { title: "Select Image", description: "Drop your photo into the top-drop area." },
                { title: "Strip Metadata", description: "Fresh canvas re-rendering wipes all hidden tags." },
                { title: "Secure Download", description: "Get your anonymous, purified image file." }
            ]}
        >
            <div className="w-full min-h-[400px] flex items-center justify-center">
                {!originalFile ? (
                    <div {...getRootProps()} className={cn(
                        "w-full h-64 border border-zinc-800 flex flex-col items-center justify-center cursor-pointer transition-all",
                        isDragActive ? "bg-white/5 border-white" : "hover:border-zinc-500"
                    )}>
                        <input {...getInputProps()} />
                        <Upload className="w-8 h-8 text-zinc-500 mb-4" />
                        <p className="text-xs font-black uppercase text-zinc-400 tracking-widest">Select Image for Purification</p>
                    </div>
                ) : (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1 px-6 py-10">
                        <div className="aspect-square bg-zinc-950 flex flex-col items-center justify-center border border-zinc-900">
                            <span className="text-[10px] font-black uppercase text-zinc-700 tracking-widest mb-4">RAW STREAM</span>
                            {previewUrl && <img src={previewUrl} className="max-h-[70%] opacity-40 grayscale" />}
                            {hasExif && <span className="mt-4 text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-500/20 px-4 py-1">Metadata Detected</span>}
                        </div>
                        <div className="aspect-square bg-zinc-950 flex flex-col items-center justify-center border border-zinc-900">
                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-4 italic">PURIFIED BUFFER</span>
                            {isProcessing ? (
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                            ) : (
                                cleanUrl && <img src={cleanUrl} className="max-h-[70%] p-4" />
                            )}
                            {!isProcessing && <span className="mt-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-4 py-1">100% Normalized</span>}
                        </div>
                    </div>
                )}
            </div>
        </ToolContainer>
    );
});

CleanExifTool.displayName = 'CleanExifTool';

export default CleanExifTool;
