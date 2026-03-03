"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, ChevronLeft, ImageMinus, Shield, Upload, Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function CleanExifTool() {
    const tc = useTranslations("Tools.common");
    const t = useTranslations("Tools.cleanExif");

    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cleanUrl, setCleanUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasExif, setHasExif] = useState(false);

    const checkExif = (file: File) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const buffer = e.target?.result as ArrayBuffer;
            const view = new DataView(buffer);

            // Check if jpeg
            if (view.byteLength < 2 || view.getUint16(0, false) !== 0xFFD8) {
                setHasExif(false);
                return;
            }

            let offset = 2;
            let foundExif = false;
            while (offset < view.byteLength) {
                if (offset + 4 > view.byteLength) break;
                if (view.getUint16(offset, false) === 0xFFE1) {
                    foundExif = true;
                    break;
                }
                const length = view.getUint16(offset + 2, false);
                offset += 2 + length;
            }
            setHasExif(foundExif);
        };
        reader.readAsArrayBuffer(file.slice(0, 65536));
    };

    const processImage = async (file: File) => {
        setIsProcessing(true);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        checkExif(file);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const cleanObjectUrl = URL.createObjectURL(blob);
                        setCleanUrl(cleanObjectUrl);
                        setIsProcessing(false);
                    }
                }, file.type.includes('jpeg') || file.type.includes('jpg') ? 'image/jpeg' : 'image/png', 0.95);
            }
        };
        img.src = url;
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setOriginalFile(file);
            processImage(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        maxFiles: 1
    });

    const handleDownload = () => {
        if (!cleanUrl || !originalFile) return;
        const link = document.createElement("a");
        link.href = cleanUrl;
        link.download = `cleaned_${originalFile.name}`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans pb-24">
            {/* Header */}
            <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1 rtl:rotate-180" />
                        <span className="text-sm font-bold uppercase tracking-widest">{tc('backHome')}</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600 font-bold tracking-widest uppercase text-xs">{tc('vaultNode')}</span>
                        <span className="text-blue-500 font-black uppercase italic tracking-tighter text-sm">{t('titleHighlight')}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-12 lg:pt-20 space-y-12">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                        <ImageMinus className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        {t('titleHighlight')} <span className="text-blue-500">EXIF</span>
                    </h1>
                </div>

                {!originalFile ? (
                    <Card
                        {...getRootProps()}
                        className={`p-12 sm:p-24 border-2 border-dashed rounded-[3rem] text-center cursor-pointer transition-all duration-500 ${isDragActive ? 'border-blue-500 bg-blue-500/5 scale-102' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50'}`}
                    >
                        <input {...getInputProps()} />
                        <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <Upload className={`w-8 h-8 transition-colors duration-300 ${isDragActive ? 'text-blue-500' : 'text-zinc-500'}`} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4">{t('dropTitle')}</h3>
                        <p className="text-sm font-medium text-zinc-500">{t('dropDesc')}</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Original View */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">{t('originalData')}</span>
                                {hasExif ? (
                                    <span className="text-[10px] font-black tracking-widest uppercase text-red-500 flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded">
                                        <AlertTriangle className="w-3 h-3" /> EXIF DANGER
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 bg-zinc-900 px-2 py-1 rounded">
                                        CLEAN
                                    </span>
                                )}
                            </div>
                            <Card className="p-4 bg-zinc-900/20 border-zinc-800 rounded-[2rem] overflow-hidden relative aspect-square flex flex-col items-center justify-center">
                                {previewUrl && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-40 grayscale"
                                        style={{ backgroundImage: `url(${previewUrl})` }}
                                    />
                                )}
                                <div className="z-10 bg-zinc-950/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 text-center space-y-4 max-w-[80%]">
                                    <span className="font-bold text-sm truncate block">{originalFile.name}</span>
                                    {hasExif ? (
                                        <p className="text-xs text-red-400 font-medium">
                                            {t('exifWarning')}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-zinc-400 font-medium">
                                            {t('noExifFound')}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Cleaned View */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <span className="text-[10px] font-black tracking-widest uppercase text-blue-500">{t('cleaned')}</span>
                                <span className="text-[10px] font-black tracking-widest uppercase text-blue-500 flex items-center gap-1.5 bg-blue-500/10 px-2 py-1 rounded">
                                    <CheckCircle2 className="w-3 h-3" /> SAFE
                                </span>
                            </div>
                            <Card className={`p-4 border-blue-500/30 rounded-[2rem] overflow-hidden relative aspect-square flex flex-col items-center justify-center transition-all duration-700 ${isProcessing ? 'bg-zinc-900/20 shadow-none' : 'bg-blue-500/5 shadow-[0_0_50px_rgba(59,130,246,0.1)]'}`}>
                                {cleanUrl && !isProcessing && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-90 transition-opacity duration-1000"
                                        style={{ backgroundImage: `url(${cleanUrl})` }}
                                    />
                                )}

                                {isProcessing ? (
                                    <div className="z-10 flex flex-col items-center gap-4 text-blue-500">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <span className="text-xs font-bold tracking-widest uppercase">{t('scrubbing')}</span>
                                    </div>
                                ) : (
                                    <div className="z-10 bg-zinc-950/80 backdrop-blur border border-blue-500/50 rounded-2xl p-6 text-center space-y-4 max-w-[80%] transform scale-105 transition-all duration-500">
                                        <Shield className="w-8 h-8 text-blue-500 mx-auto" />
                                        <p className="text-xs text-zinc-300 font-medium">
                                            {t('safe')}
                                        </p>
                                        <Button
                                            onClick={handleDownload}
                                            className="w-full h-12 bg-blue-500 hover:bg-blue-400 text-blue-950 font-black rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all active:scale-95"
                                        >
                                            <Download className="w-4 h-4 me-2" />
                                            {t('downloadClean')}
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
