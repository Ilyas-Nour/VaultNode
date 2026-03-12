"use client";

import React, { useState, useCallback, memo } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Download, Trash2, Shield, Wrench, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";

const RepairTool = memo(() => {
    const t = useTranslations("Tools.repair");
    const [file, setFile] = useState<File | null>(null);
    const [isRepairing, setIsRepairing] = useState(false);
    const [fixedBlob, setFixedBlob] = useState<Blob | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setFixedBlob(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const handleRepair = useCallback(async () => {
        if (!file) return;
        setIsRepairing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            // pdf-lib's parser is very resilient and often fixes corruptions just by loading/saving
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            setFixedBlob(blob);
        } catch (err) {
            console.error("Repair Error:", err);
            // Even if it fails, we show a success message but with a fallback? 
            // Actually, let's try a more aggressive reconstruction if it fails, but for now simple load/save is a good start.
        } finally {
            setIsRepairing(false);
        }
    }, [file]);

    const handleDownload = useCallback(() => {
        if (!fixedBlob || !file) return;
        const url = URL.createObjectURL(fixedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `privaflow_repaired_${file.name}`;
        link.click();
    }, [fixedBlob, file]);

    const clear = useCallback(() => {
        setFile(null);
        setFixedBlob(null);
    }, []);

    const howItWorks = React.useMemo(() => [
        { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.desc') },
        { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.desc') },
        { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.desc') }
    ], [t]);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={Wrench}
            category="docs"
            toolId="repair"
            howItWorks={howItWorks}
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
                                    <AlertCircle className={cn("w-8 h-8", isDragActive ? "text-white" : "text-white/40")} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-black text-white uppercase tracking-tighter">
                                        {isDragActive ? t('dropDesc') : t('dropTitle')}
                                    </p>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{t('dropDesc')}</p>
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
                            <div className="p-8 border border-white/10 bg-zinc-900/50 flex flex-col items-center gap-6 text-center">
                                <div className="w-20 h-20 border border-white/10 flex items-center justify-center bg-white/5 rounded-full mb-2">
                                    {fixedBlob ? <CheckCircle2 className="w-10 h-10 text-emerald-500" /> : <Shield className="w-10 h-10 text-zinc-600" />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{t('infectedAsset')}</p>
                                    <p className="text-white font-black text-2xl truncate max-w-md uppercase tracking-tighter">{file.name}</p>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{t('formatPdf')}</p>
                                </div>

                                <div className="flex flex-col gap-4 w-full max-w-xs pt-4">
                                    {!fixedBlob ? (
                                        <button
                                            onClick={handleRepair}
                                            disabled={isRepairing}
                                            className="h-14 bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isRepairing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                                            {isRepairing ? t('reconstructing') : t('repairBtn')}
                                        </button>
                                    ) : (
                                        <motion.button
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            onClick={handleDownload}
                                            className="h-14 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                        >
                                            <Download className="w-4 h-4" />
                                            {t('downloadBtn')}
                                        </motion.button>
                                    )}
                                    <button onClick={clear} className="text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                                        {fixedBlob ? t('finishBtn') : t('discardBtn')}
                                    </button>
                                </div>

                                {fixedBlob && (
                                    <div className="pt-4 border-t border-white/5 w-full">
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                                            {t('successDesc')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

RepairTool.displayName = 'RepairTool';
export default RepairTool;
