"use client";

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import { FileCode, Download, Loader2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { ToolContainer } from '@/components/ToolContainer';
import { cn } from '@/lib/utils';

export default function SvgToPngTool() {
    const t = useTranslations('Tools.svgToPng');
    const tc = useTranslations('Tools.common');

    const [svgCode, setSvgCode] = useState('');
    const [fileName, setFileName] = useState('image');
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const generatePreview = (code: string) => {
        try {
            const blob = new Blob([code], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (e) {
            console.error("Preview generation failed", e);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFileName(file.name.split('.')[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setSvgCode(content);
                generatePreview(content);
            };
            reader.readAsText(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/svg+xml': ['.svg'] },
        multiple: false
    });

    const rasterize = () => {
        if (!svgCode) return;
        setIsProcessing(true);

        const canvas = document.createElement('canvas');
        const img = new Image();
        const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            const scale = 2;
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0);
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = `privaflow_${fileName}.png`;
                a.click();
            }
            URL.revokeObjectURL(url);
            setIsProcessing(false);
        };

        img.onerror = () => {
            setIsProcessing(false);
        };

        img.src = url;
    };

    const resetTool = () => {
        setSvgCode('');
        setPreviewUrl(null);
        setFileName('image');
    };

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={ImageIcon}
            category="media"
            toolId="svg-to-png"
            settingsContent={
                <div className="space-y-5">
                    <button
                        onClick={rasterize}
                        disabled={!svgCode || isProcessing}
                        className="w-full h-12 bg-white hover:bg-zinc-100 text-black text-[11px] font-bold uppercase tracking-[0.18em] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('processing')}</>
                            : <><ImageIcon className="w-4 h-4" /> {t('convertBtn')}</>
                        }
                    </button>
                    <button
                        onClick={resetTool}
                        className="w-full h-10 border border-white/[0.08] text-zinc-500 hover:text-white hover:border-white/20 text-[10px] font-bold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {t('resetBtn')}
                    </button>
                </div>
            }
            howItWorks={[
                { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.desc') },
                { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.desc') },
                { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.desc') },
            ]}
        >
            <AnimatePresence mode="wait">
                {!svgCode ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            {...getRootProps()}
                            className={cn(
                                "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-12 gap-4",
                                isDragActive ? "border-white/40 bg-white/[0.03]" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                            )}
                        >
                            <input {...getInputProps()} />
                            <FileCode className={cn("w-8 h-8", isDragActive ? "text-white" : "text-zinc-600")} />
                            <div className="text-center">
                                <p className="text-[13px] font-bold text-white uppercase tracking-[0.15em]">
                                    {isDragActive ? tc('dropActive') : t('dropTitle')}
                                </p>
                                <p className="text-[11px] text-zinc-600 mt-1 uppercase tracking-widest">{t('dropDesc')}</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* SVG Code Editor */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                                <span>SVG {tc('before')}</span>
                                <span className="text-zinc-700 truncate max-w-[140px]">{fileName}.svg</span>
                            </div>
                            <textarea
                                value={svgCode}
                                onChange={(e) => {
                                    setSvgCode(e.target.value);
                                    if (e.target.value.includes('<svg')) generatePreview(e.target.value);
                                }}
                                className="w-full h-48 bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-mono text-zinc-500 focus:border-white/20 outline-none transition-colors resize-none"
                                placeholder={t('xmlPlaceholder')}
                            />
                        </div>

                        {/* Preview */}
                        {previewUrl && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                                    <span>PNG {tc('after')}</span>
                                    <span className="text-zinc-700">{t('scaled')}</span>
                                </div>
                                <div className="w-full aspect-square bg-zinc-950 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        className="max-w-full max-h-full object-contain p-6"
                                        alt="Preview"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={rasterize}
                                            className="h-12 px-8 bg-white text-black text-[11px] font-bold uppercase tracking-[0.18em] flex items-center gap-2 hover:bg-zinc-100 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            {t('convertBtn')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </ToolContainer>
    );
}
