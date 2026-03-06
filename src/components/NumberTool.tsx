"use client";

import React, { useState, useCallback, memo } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Download, Trash2, Shield, Hash, ListOrdered, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const NumberTool = memo(() => {
    const t = useTranslations("Tools.numberPages");
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left'>('bottom-center');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const handleNumbering = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const totalPages = pages.length;

            pages.forEach((page, index) => {
                const { width, height } = page.getSize();
                const text = `Page ${index + 1} of ${totalPages}`;
                const fontSize = 10;
                const textWidth = font.widthOfTextAtSize(text, fontSize);

                let x = width / 2 - textWidth / 2;
                if (position === 'bottom-left') x = 30;
                if (position === 'bottom-right') x = width - textWidth - 30;

                page.drawText(text, {
                    x,
                    y: 20,
                    size: fontSize,
                    font,
                    color: rgb(0.5, 0.5, 0.5),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `numbered-${file.name}`;
            link.click();
        } catch (err) {
            console.error("Numbering Error:", err);
        } finally {
            setIsProcessing(false);
        }
    }, [file, position]);

    const clear = useCallback(() => setFile(null), []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={ListOrdered}
            category="docs"
            toolId="number-pages"
            settingsContent={
                file && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('position')}</label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'bottom-center', label: t('bottomCenter') },
                                    { id: 'bottom-left', label: t('bottomLeft') },
                                    { id: 'bottom-right', label: t('bottomRight') }
                                ].map((pos) => (
                                    <button
                                        key={pos.id}
                                        onClick={() => setPosition(pos.id as any)}
                                        className={cn(
                                            "w-full h-10 text-[10px] font-black uppercase tracking-widest border transition-all",
                                            position === pos.id
                                                ? "bg-white text-black border-white"
                                                : "bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                                        )}
                                    >
                                        {pos.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleNumbering}
                            disabled={isProcessing}
                            className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
                            {isProcessing ? t('applyingNumbers') : t('numberBtn')}
                        </button>

                        <button onClick={clear} className="w-full h-12 border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                            {t('discardDocument')}
                        </button>
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
                                    <Hash className={cn("w-8 h-8", isDragActive ? "text-white" : "text-white/40")} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-black text-white uppercase tracking-tighter">
                                        {isDragActive ? t('dropToNumber') : t('dropTitle')}
                                    </p>
                                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full space-y-6"
                        >
                            <div className="p-8 border border-white/10 bg-zinc-900/50 flex flex-col items-center gap-6">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/5 text-emerald-500">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Format: PDF</p>
                                        <p className="text-white font-bold truncate">{file.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <Shield className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase">Secure</span>
                                    </div>
                                </div>

                                <div className="w-full flex gap-4 items-center justify-center py-10 bg-black/40 border border-white/5 rounded-xl">
                                    <div className="flex flex-col items-center gap-1.5 opacity-30">
                                        <div className="w-20 h-28 bg-white/10 border border-white/10 relative">
                                            <div className="absolute bottom-2 left-0 right-0 text-center text-[7px] font-black text-white/40">Page 1</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="w-28 h-36 bg-zinc-900 border border-emerald-500/30 relative shadow-2xl scale-110 flex items-center justify-center">
                                            <div className="w-full h-full p-4 space-y-2 opacity-5">
                                                <div className="h-2 w-full bg-white rounded-full" />
                                                <div className="h-2 w-3/4 bg-white rounded-full" />
                                                <div className="h-2 w-full bg-white rounded-full" />
                                                <div className="h-2 w-5/6 bg-white rounded-full" />
                                            </div>
                                            <div className={cn(
                                                "absolute bottom-3 font-black text-emerald-500 text-[8px] uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded",
                                                position === 'bottom-left' ? "left-3" : position === 'bottom-right' ? "right-3" : "left-1/2 -translate-x-1/2"
                                            )}>
                                                Page 2
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 opacity-30">
                                        <div className="w-20 h-28 bg-white/10 border border-white/10 relative">
                                            <div className="absolute bottom-2 left-0 right-0 text-center text-[7px] font-black text-white/40">Page 3</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center space-y-1">
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Verify numbering layout</p>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">Numbers will be applied to every page of the document.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

NumberTool.displayName = 'NumberTool';
export default NumberTool;
