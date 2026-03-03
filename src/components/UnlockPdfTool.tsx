"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Unlock, FileText, Upload, Download, EyeOff, Eye, AlertTriangle, ShieldCheck, Info, RefreshCw, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UnlockPdfTool() {
    const t = useTranslations("Tools.unlockPdf");

    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [unlockedBlob, setUnlockedBlob] = useState<Blob | null>(null);

    const checkPdf = async (buffer: ArrayBuffer) => {
        try {
            await PDFDocument.load(buffer);
            setErrorMsg("This PDF is not password protected. It is already unlocked.");
        } catch (e: any) {
            if (e.message && e.message.includes("encrypted")) {
                setErrorMsg(null);
            } else {
                setErrorMsg("Invalid PDF or an unexpected error occurred.");
            }
        }
    };

    const processFile = async (file: File) => {
        setOriginalFile(file);
        setUnlockedBlob(null);
        setErrorMsg(null);
        setPassword("");

        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target?.result) {
                const buffer = e.target.result as ArrayBuffer;
                setFileBuffer(buffer);
                await checkPdf(buffer);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    const unlockPdf = async () => {
        if (!fileBuffer || !password) return;
        setIsProcessing(true);
        setErrorMsg(null);

        try {
            const pdfDoc = await PDFDocument.load(fileBuffer as any, { password, ignoreEncryption: false } as any);
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            setUnlockedBlob(blob);
        } catch (error: any) {
            if (error.message && error.message.includes("password")) {
                setErrorMsg("Incorrect password. Please try again.");
            } else {
                setErrorMsg("Failed to unlock PDF. The file might be corrupted or uses unsupported encryption.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!unlockedBlob || !originalFile) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(unlockedBlob);
        link.download = `unlocked_${originalFile.name}`;
        link.click();
    };

    const resetTool = () => {
        setOriginalFile(null);
        setFileBuffer(null);
        setPassword("");
        setUnlockedBlob(null);
        setErrorMsg(null);
    };

    return (
        <ToolContainer
            title={t('titleHighlight')}
            description={t('dropDesc')}
            icon={Unlock}
            category="docs"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Node</span>
                        <div className="p-3 rounded-2xl border border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight italic">AES Decryption</span>
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={unlockPdf}
                            disabled={!password || isProcessing || !!(errorMsg && !errorMsg.includes("Incorrect"))}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4 me-2" />}
                            {isProcessing ? t('unlocking') : t('unlockBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <RefreshCw className="w-4 h-4 me-2" />
                            Reset Keyhole
                        </Button>
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Key className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Local</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Decryption keys are held in volatile memory only.
                            No keystrokes are logged or transmitted.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Binary Parsing", description: "Loads the PDF byte stream into an atomic PDFDocument buffer object." },
                { title: "Standard AES", description: "Attempts to derive the decryption key from your provided password." },
                { title: "Metadata Rebuild", description: "Generates a new, unencrypted PDF stream while preserving content layers." }
            ]}
        >
            <div className="relative min-h-[450px] flex flex-col items-center justify-center p-6 md:p-12">
                <AnimatePresence mode="wait">
                    {!originalFile ? (
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
                                    <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                                        <Upload className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">{t('dropTitle')}</h3>
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col items-center space-y-8"
                        >
                            <div className="w-full max-w-2xl bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden relative p-8 flex flex-col items-center shadow-2xl">
                                <div className="flex items-center gap-4 mb-8 w-full">
                                    <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                                        <FileText className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black uppercase tracking-tighter text-white truncate">{originalFile.name}</p>
                                        <p className="text-[10px] font-bold uppercase text-zinc-500">{(originalFile.size / 1024 / 1024).toFixed(2)} MB &bull; Encrypted Registry</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={resetTool} className="text-zinc-500 hover:text-white uppercase tracking-widest text-[9px] font-black italic">
                                        Change
                                    </Button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {unlockedBlob ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center py-6 space-y-6"
                                        >
                                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                                <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <h3 className="text-xl font-black uppercase italic tracking-tight">{t('successTitle')}</h3>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-xs">{t('successDesc')}</p>
                                            </div>
                                            <Button
                                                onClick={handleDownload}
                                                className="h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-xs uppercase italic"
                                            >
                                                <Download className="w-5 h-5 me-3" />
                                                {t('downloadBtn')}
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="input"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full max-w-sm space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('passwordLabel')}</label>
                                                    {errorMsg && <span className="text-[10px] text-red-500 font-bold uppercase">{errorMsg}</span>}
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className={cn(
                                                            "w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 text-sm font-black focus:outline-none focus:border-emerald-500 transition-all font-mono tracking-widest",
                                                            errorMsg ? "border-red-500/50" : "focus:ring-2 focus:ring-emerald-500/20"
                                                        )}
                                                        placeholder={t('passwordPlaceholder')}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') unlockPdf();
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-2"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                                <Info className="w-5 h-5 text-emerald-500 shrink-0" />
                                                <p className="text-[9px] text-zinc-500 font-bold leading-tight uppercase">
                                                    This PDF is processed in a transient memory buffer. No data survives the session.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center gap-8 px-8 py-4 bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-xl">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Registry Lock</span>
                                    <Unlock className="w-5 h-5 text-zinc-500" />
                                </div>
                                <RefreshCw className={cn("w-5 h-5 text-emerald-500", isProcessing && "animate-spin")} />
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Clearstream Registry</span>
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
}
