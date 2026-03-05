/**
 * 🎨 PRIVAFLOW | Scalable Vector Rasterizer
 * ---------------------------------------------------------
 * A high-precision rendering engine for SVG bitstream conversion.
 * Transforms XML-based vector stacks into optimized PNG buffers
 * using a native canvas serialization bridge.
 * 
 * Logic: Canvas-Based XML Rasterization
 * Performance: Optimized (Atomic Rendering)
 * Aesthetics: Design-Industrial / Emerald-Dark
 */

"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import {
    FileCode, Download, Loader2, Image as ImageIcon,
    Shield, Wand2, RefreshCw, Layers, HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolContainer } from '@/components/ToolContainer';
import { cn } from '@/lib/utils';

export default function SvgToPngTool() {
    const t = useTranslations('Tools.svgToPng');
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
            const scale = 2; // High resolution
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0);
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = `vaultnode_${fileName}.png`;
                a.click();
            }
            URL.revokeObjectURL(url);
            setIsProcessing(false);
        };

        img.onerror = () => {
            alert("Malformed SVG. Please check the code.");
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
                <div className="space-y-6">
                    <div className="space-y-3.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Raster Quality</span>
                        <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 flex items-center justify-between shadow-inner">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight italic">2x Super-Sampling</span>
                            <RefreshCw className="w-4 h-4 text-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-3.5 pt-4">
                        <Button
                            onClick={rasterize}
                            disabled={!svgCode || isProcessing}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5 me-2" />}
                            {isProcessing ? t('processing') : t('convertBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[11px] font-black uppercase tracking-widest italic rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4 me-2" />
                            Reset Buffer
                        </Button>
                    </div>

                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-3.5 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Local Engine</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                            Uses native Canvas API to rasterize vectors. Zero external network calls.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Vector Extraction", description: "Parses SVG XML data objects directly from your file stream." },
                { title: "High-Res Scaling", description: "Uses 2x super-sampling to prevent raster aliasing during export." },
                { title: "Local Export", description: "Binary BLOB is created in-browser and pushed to your downloads." }
            ]}
        >
            <div className="relative min-h-[420px] flex flex-col items-center justify-center p-6 md:p-10">
                <AnimatePresence mode="wait">
                    {!svgCode ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl"
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
                                        "w-full aspect-video border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative",
                                        isDragActive ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl group-hover/dropzone:scale-110 transition-transform duration-500">
                                        <FileCode className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tight mb-2">{t('dropTitle')}</h3>
                                    <p className="text-zinc-500 text-sm lg:text-base font-bold uppercase tracking-widest text-center px-4">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">
                                    <span>Source Vector Code</span>
                                    <span className="text-zinc-600 truncate max-w-[120px] bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-900">{fileName}.svg</span>
                                </div>
                                <textarea
                                    value={svgCode}
                                    onChange={(e) => {
                                        setSvgCode(e.target.value);
                                        if (e.target.value.includes('<svg')) generatePreview(e.target.value);
                                    }}
                                    className="w-full aspect-square bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6 text-[11px] font-mono text-zinc-500 focus:border-emerald-500 outline-none transition-colors resize-none custom-scroll shadow-inner"
                                    placeholder="Paste SVG XML here..."
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2 text-[11px] font-black uppercase tracking-widest text-emerald-500 italic">
                                    <span>Raster Result</span>
                                    <span className="text-emerald-500/50 bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">2x Scaled</span>
                                </div>
                                <div className="aspect-square rounded-[2rem] bg-zinc-900/50 border border-zinc-800 overflow-hidden relative flex items-center justify-center shadow-2xl">
                                    <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            className="max-w-full max-h-full object-contain p-8 drop-shadow-2xl animate-in zoom-in-95 duration-500"
                                            alt="Preview"
                                        />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-zinc-800 animate-pulse" />
                                    )}

                                    {previewUrl && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-500">
                                            <Button
                                                onClick={rasterize}
                                                className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-xl uppercase italic tracking-tight"
                                            >
                                                <Download className="w-6 h-6 me-4" />
                                                Save as PNG
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-10 px-10 py-5 bg-zinc-900/80 border border-zinc-800 rounded-full mt-10 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                        <HardDrive className="w-5 h-5 text-zinc-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Node-09</span>
                    </div>
                    <div className="w-px h-5 bg-zinc-800" />
                    <div className="flex items-center gap-2.5">
                        <Layers className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Raster Engine 2.1</span>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
}
