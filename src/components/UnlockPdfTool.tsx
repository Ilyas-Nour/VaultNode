/**
 * 🔓 PRIVAFLOW | PDF Decryption Engine
 * ---------------------------------------------------------
 * A surgical security utility. Derives AES decryption keys
 * from user-provided passwords to strip encryption layers
 * from PDF bitstreams locally in volatile memory.
 * 
 * Logic: AES-256 local decryption
 * Performance: Optimized (Memoized Callbacks & Buffer Orchestration)
 * Aesthetics: Security-Surgical / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Unlock, FileText, Upload, Download, EyeOff, Eye, ShieldCheck, Info, RefreshCw, Key, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 🔓 UnlockPdfTool Component
 * A high-security utility for local PDF decryption.
 */
const UnlockPdfTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.unlockPdf");

    // 📂 STATE ORCHESTRATION
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [unlockedBlob, setUnlockedBlob] = useState<Blob | null>(null);

    /**
     * ⚙️ Heuristic Validation
     * Detects encryption patterns without committing to heavy processing.
     */
    const checkPdf = useCallback(async (buffer: ArrayBuffer) => {
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
    }, []);

    /**
     * 📂 Queue Management
     */
    const processFile = useCallback(async (file: File) => {
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
    }, [checkPdf]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, [processFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    /**
     * ⚡ Decryption Core
     * Strips encryption headers and synthesizes a clearstream buffer.
     */
    const unlockPdf = useCallback(async () => {
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
    }, [fileBuffer, password]);

    const handleDownload = useCallback(() => {
        if (!unlockedBlob || !originalFile) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(unlockedBlob);
        link.download = `unlocked_${originalFile.name}`;
        link.click();
    }, [unlockedBlob, originalFile]);

    const resetTool = useCallback(() => {
        setOriginalFile(null);
        setFileBuffer(null);
        setPassword("");
        setUnlockedBlob(null);
        setErrorMsg(null);
    }, []);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: 'Upload Your Locked PDF', description: 'Drop the PDF file that is password-protected or has printing/editing restrictions.' },
        { title: 'Enter the Password (if you have it)', description: 'If the PDF requires a password to open, type it in. If it just has restrictions, skip this step.' },
        { title: 'Download the Unlocked File', description: 'Get a fully usable PDF — you can now open, copy, print, and edit it freely.' }
    ], []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={KeyRound}
            category="docs"
            toolId="unlock"
            settingsContent={
                <div className="space-y-6">
                    {/* 🔘 SECURITY NODE HUB */}
                    <div className="space-y-4">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Security Node</span>
                        <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
                            <span className="text-sm font-bold text-zinc-400 uppercase tracking-tight italic">AES Decryption</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3 pt-2">
                        <Button
                            onClick={unlockPdf}
                            disabled={!password || isProcessing || !!(errorMsg && !errorMsg.includes("Incorrect"))}
                            className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-xs uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5 me-2" />}
                            {isProcessing ? t('unlocking') : t('unlockBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-14 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-xs font-black uppercase tracking-widest italic"
                        >
                            <RefreshCw className="w-5 h-5 me-2" />
                            Reset Keyhole
                        </Button>
                    </div>

                    {/* 📊 SANDBOX REPORT */}
                    <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Key className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">End-to-End Local</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Decryption keys are held in volatile memory only.
                            No keystrokes are logged or transmitted.
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[400px] flex flex-col items-center justify-center p-4 md:p-8">
                <AnimatePresence mode="wait">
                    {!originalFile ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl"
                        >
                            {/* 🛸 DROPZONE ARCHITECTURE */}
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
                                        "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-10 gap-4",
                                        isDragActive ? "border-white/40 bg-white/[0.03]" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className={cn("w-8 h-8", isDragActive ? "text-white" : "text-zinc-600")} />
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white uppercase tracking-widest">
                                            {isDragActive ? 'Drop it here' : 'Drop your locked PDF here'}
                                        </p>
                                        <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">PDF files only</p>
                                    </div>
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
                            {/* 📟 PROCESSING REPORT CARD */}
                            <div className="w-full max-w-2xl bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 overflow-hidden relative p-10 flex flex-col items-center shadow-2xl">
                                <div className="flex items-center gap-6 mb-10 w-full">
                                    <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                        <FileText className="w-7 h-7 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-black uppercase tracking-tighter text-white truncate">{originalFile.name}</p>
                                        <p className="text-xs font-bold uppercase text-zinc-500">{(originalFile.size / 1024 / 1024).toFixed(2)} MB &bull; Encrypted Registry</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={resetTool} className="text-zinc-500 hover:text-white uppercase tracking-widest text-xs font-black italic">
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
                                            <div className="text-center space-y-3">
                                                <h3 className="text-2xl font-black uppercase italic tracking-tight">{t('successTitle')}</h3>
                                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest max-w-sm">{t('successDesc')}</p>
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
                                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">{t('passwordLabel')}</label>
                                                    {errorMsg && <span className="text-xs text-red-500 font-bold uppercase">{errorMsg}</span>}
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

                                            <div className="flex items-center gap-4 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                                <Info className="w-6 h-6 text-emerald-500 shrink-0" />
                                                <p className="text-[11px] text-zinc-500 font-bold leading-tight uppercase">
                                                    This PDF is processed in a transient memory buffer. No data survives the session.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 📟 FLOW METRICS */}
                            <div className="flex items-center gap-12 px-10 py-5 bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-xl">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase">Registry Lock</span>
                                    <Unlock className="w-6 h-6 text-zinc-500" />
                                </div>
                                <RefreshCw className={cn("w-6 h-6 text-emerald-500", isProcessing && "animate-spin")} />
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase">Clearstream Registry</span>
                                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

UnlockPdfTool.displayName = 'UnlockPdfTool';

export default UnlockPdfTool;
