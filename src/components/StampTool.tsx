"use client";

import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Download, Trash2, Shield, Stamp, Type, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const StampTool = memo(() => {
    const t = useTranslations("Tools.stamp");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stampText, setStampText] = useState("PrivaFlow Secured");
    const [stampColor, setStampColor] = useState("#ffffff");
    const [stampOpacity, setStampOpacity] = useState(0.5);
    const [sigPos, setSigPos] = useState({ x: 50, y: 50 });
    const [fontSize, setFontSize] = useState(40);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        multiple: false
    });

    const handleExport = useCallback(async () => {
        if (!file || !previewUrl) return;
        setIsProcessing(true);

        try {
            const img = new Image();
            img.src = previewUrl;
            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);

            // Draw stamp
            const uiCanvas = canvasRef.current;
            if (uiCanvas) {
                const scaleX = img.width / uiCanvas.width;
                const scaleY = img.height / uiCanvas.height;

                ctx.save();
                ctx.translate(sigPos.x * scaleX, sigPos.y * scaleY);
                ctx.rotate(-Math.PI / 12); // Subtle tilt

                ctx.globalAlpha = stampOpacity;
                ctx.fillStyle = stampColor;
                ctx.font = `bold ${Math.round(fontSize * scaleX)}px Inter, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(stampText, 0, 0);

                // Optional border for visibility
                ctx.lineWidth = 2 * scaleX;
                ctx.strokeStyle = "rgba(0,0,0,0.3)";
                ctx.strokeText(stampText, 0, 0);

                ctx.restore();
            }

            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `stamped-${file.name}`;
            link.click();
        } catch (err) {
            console.error("Export Error:", err);
        } finally {
            setIsProcessing(false);
        }
    }, [file, previewUrl, sigPos, stampText, stampColor, stampOpacity]);

    const clear = useCallback(() => {
        setFile(null);
        setPreviewUrl(null);
    }, []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={Stamp}
            category="media"
            toolId="stamp"
            settingsContent={
                file && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Type className="w-3 h-3" /> {t('watermarkText')}
                                </label>
                                <input
                                    type="text"
                                    value={stampText}
                                    onChange={(e) => setStampText(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white text-xs font-bold focus:border-emerald-500 outline-none transition-colors"
                                    placeholder={t('watermarkPlaceholder')}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('color')}</label>
                                    <input
                                        type="color"
                                        value={stampColor}
                                        onChange={(e) => setStampColor(e.target.value)}
                                        className="w-full h-10 bg-zinc-950 border border-zinc-800 p-1 cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('opacity')}</label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.1"
                                        value={stampOpacity}
                                        onChange={(e) => setStampOpacity(parseFloat(e.target.value))}
                                        className="w-full accent-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('size')}</label>
                                <input
                                    type="range"
                                    min="20"
                                    max="200"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full accent-emerald-500"
                                />
                            </div>

                            <button
                                onClick={handleExport}
                                disabled={isProcessing}
                                className="w-full h-12 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {isProcessing ? t('processingImage') : t('saveBtn')}
                            </button>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <button onClick={clear} className="w-full h-12 border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                {t('startFresh')}
                            </button>
                        </div>
                    </div>
                )
            }
        >
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "w-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-20 gap-6",
                                    isDragActive ? "border-white bg-white/[0.05]" : "border-white/10 hover:border-white/20 bg-zinc-900/50"
                                )}
                            >
                                <input {...getInputProps()} />
                                <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded-full bg-white/5">
                                    <ImageIcon className={cn("w-8 h-8", isDragActive ? "text-white" : "text-white/40")} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-black text-white uppercase tracking-tighter">
                                        {isDragActive ? t('dropToStamp') : t('dropTitle')}
                                    </p>
                                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex justify-center py-6"
                        >
                            <div className="relative border border-white/5 bg-zinc-950 p-2 overflow-hidden shadow-2xl" ref={containerRef}>
                                <div className="relative inline-block">
                                    {previewUrl && (
                                        <img
                                            onLoad={(e) => {
                                                const img = e.currentTarget;
                                                if (canvasRef.current) {
                                                    canvasRef.current.width = img.width;
                                                    canvasRef.current.height = img.height;
                                                }
                                            }}
                                            src={previewUrl}
                                            className="max-w-full max-h-[70vh] block"
                                            alt="Preview"
                                        />
                                    )}
                                    <canvas ref={canvasRef} className="hidden" />

                                    <motion.div
                                        drag
                                        dragConstraints={containerRef}
                                        dragMomentum={false}
                                        onDragEnd={(_, info) => {
                                            setSigPos(prev => ({
                                                x: prev.x + info.offset.x,
                                                y: prev.y + info.offset.y
                                            }));
                                        }}
                                        className="absolute cursor-move z-20 group"
                                        style={{ top: sigPos.y, left: sigPos.x }}
                                    >
                                        <div className="relative pointer-events-none">
                                            <div
                                                className="px-6 py-3 border-2 border-dashed border-white/20 whitespace-nowrap select-none -rotate-12"
                                                style={{
                                                    color: stampColor,
                                                    opacity: stampOpacity,
                                                    fontSize: `${fontSize}px`,
                                                    fontFamily: 'Inter, sans-serif',
                                                    fontWeight: 900,
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                                }}
                                            >
                                                {stampText || "STAMP"}
                                            </div>
                                            <div className="absolute -inset-1 border border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                                Drag to place
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

StampTool.displayName = 'StampTool';
export default StampTool;
