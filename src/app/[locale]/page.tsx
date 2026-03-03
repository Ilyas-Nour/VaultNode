"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useTranslations } from 'next-intl';
import {
  FileUp, ShieldCheck, Zap, HardDrive, LayoutGrid, X,
  GripVertical, FileText, Loader2, Download, Eraser,
  MousePointer2, Cpu, ArrowDownToLine, CheckCircle2,
  Lock, EyeOff, Scale, Users, Briefcase, Globe, ArrowRight, ChevronLeft, ChevronRight,
  Images, ImageMinus, KeyRound, Key, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useLocale } from 'next-intl';

interface VaultFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function Home() {
  const t = useTranslations('HomePage');
  const footerT = useTranslations('Footer');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [files, setFiles] = useState<VaultFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../lib/pdf.worker.ts', import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'MERGE_SUCCESS') {
        const { mergedPdfBytes } = payload;
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'merged-vaultnode.pdf';
        link.click();
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      } else if (type === 'MERGE_ERROR') {
        alert(payload.message);
        setIsProcessing(false);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7) + Date.now(),
      file,
      name: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true
  });

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const fileBuffers = await Promise.all(files.map(vf => vf.file.arrayBuffer()));
      workerRef.current?.postMessage({ type: 'MERGE_PDFS', payload: { fileBuffers } });
    } catch (error) {
      alert("Error reading files.");
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 overflow-x-hidden">

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 end-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-24 space-y-32">

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-10 text-center lg:text-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-500 text-xs font-black tracking-widest uppercase italic"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('subtitle')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic"
            >
              {t('title').split(' ').slice(0, -1).join(' ')}<br />
              <span className="text-emerald-500">{t('title').split(' ').pop()}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 text-lg md:text-xl max-w-xl font-medium leading-relaxed mx-auto lg:mx-0"
            >
              {t('description')}
            </motion.p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/tools/redact">
                <Button className="h-16 px-8 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-xl shadow-emerald-500/10 transition-all active:scale-95 italic text-lg uppercase">
                  {t('launchRedactor')}
                </Button>
              </Link>
              <Link href="/tools/compress">
                <Button variant="outline" className="h-16 px-8 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-2xl font-black transition-all italic text-lg uppercase">
                  {t('imageCompressor')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl lg:flex-shrink-0">
            <Card className="p-1 sm:p-2 bg-zinc-900/50 border-zinc-800 rounded-[3rem] shadow-2xl backdrop-blur-xl group overflow-hidden">
              <div className="p-8 sm:p-12 space-y-8 bg-zinc-950/50 rounded-[2.5rem] border border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <FileUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">{t('pdfMerger')}</h2>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                    {t('localOnly')}
                  </div>
                </div>

                <div
                  {...getRootProps()}
                  className={`
                      aspect-video rounded-[2rem] border-2 border-dashed transition-all duration-700 cursor-pointer flex flex-col items-center justify-center p-8
                      ${isDragActive ? "border-emerald-500 bg-emerald-500/5 scale-102" : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900"}
                      ${files.length > 0 ? "hidden" : "flex"}
                    `}
                >
                  <input {...getInputProps()} />
                  <FileUp className={`w-8 h-8 mb-4 transition-colors ${isDragActive ? "text-emerald-500" : "text-zinc-600"}`} />
                  <p className="text-sm font-bold text-center text-zinc-500 tracking-tight leading-relaxed italic">
                    {t('mergeDropDesc')}
                  </p>
                </div>

                {files.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-2 max-h-[240px] overflow-y-auto px-1 custom-scroll">
                      {files.map((file) => (
                        <Reorder.Item key={file.id} value={file}>
                          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-zinc-700" />
                            <span className="text-xs font-bold truncate flex-1">{file.name}</span>
                            <button onClick={() => removeFile(file.id)} className="text-zinc-700 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                    <Button onClick={handleMerge} disabled={isProcessing || files.length < 2} className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl">
                      {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2 h-4 w-4" />}
                      {t('mergeButton')}
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>
        </section>

        {/* How it Works - Humanized Narrative */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">{t('howItWorks.title')}</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MousePointer2, step: "01", title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
              { icon: Cpu, step: "02", title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
              { icon: ArrowDownToLine, step: "03", title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') }
            ].map((item, i) => (
              <div key={i} className="relative p-10 bg-zinc-900/30 border border-zinc-900 rounded-[2.5rem] space-y-6 group hover:border-emerald-500/20 transition-all">
                <div className="absolute top-8 end-10 text-4xl font-black text-white/5 group-hover:text-emerald-500/10 transition-colors uppercase italic">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-2xl group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold uppercase italic tracking-tight">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Service Showcases */}
        <section className="space-y-16 lg:space-y-24">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-zinc-900 text-emerald-500 border border-zinc-800">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">{t('serviceShowcases.title')}</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{t('serviceShowcases.subtitle')}</p>
          </div>

          <div className="space-y-16 lg:space-y-32">

            {/* 1. Secure PDF Redaction */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-[4rem] p-4 sm:p-8 lg:p-20 space-y-12 lg:space-y-16 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
                <div className="space-y-6 max-w-xl text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Eraser className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">{t('serviceShowcases.redactor.title')}</h3>
                  </div>
                  <p className="text-zinc-500 font-medium leading-relaxed">{t('serviceShowcases.redactor.desc')}</p>
                  <Link href="/tools/redact" className="inline-block mt-4">
                    <Button className="h-14 px-8 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest">
                      {t('serviceShowcases.redactor.cta')}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Before Mockup - Realistic Document */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4">{t('serviceShowcases.redactor.before')}</p>
                  <div
                    className="bg-zinc-100 text-zinc-900 rounded-[2.5rem] p-6 sm:p-10 border border-zinc-300 shadow-xl relative overflow-hidden lg:h-[420px] flex flex-col font-mono"
                    aria-label="Mock unredacted document with exposed sensitive data"
                  >
                    <div className="flex justify-between items-center border-b-2 border-zinc-200 pb-6 mb-8">
                      <div className="font-black text-2xl tracking-tighter text-zinc-800">GLOBAL BANK</div>
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Stmt: 2026-03-01</div>
                    </div>
                    <div className="space-y-8 flex-1 text-sm sm:text-base">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-semibold">Account Holder</span>
                        <span className="font-bold text-red-700 bg-red-100/80 px-2 py-1 rounded shadow-sm">Alex R. Mercer</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-semibold">Account Number</span>
                        <span className="font-bold text-red-700 bg-red-100/80 px-2 py-1 rounded shadow-sm">DE89 3704 0044 0532 01</span>
                      </div>
                      <div className="pt-6 border-t-2 border-zinc-200 space-y-4">
                        <div className="flex justify-between font-black text-zinc-400 text-[10px] tracking-[0.1em] uppercase mb-4">
                          <span className="w-16">Date</span>
                          <span className="flex-1 text-start px-4">Description</span>
                          <span className="w-24 text-end">Amount</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="w-16 text-zinc-600 font-semibold">03/01</span>
                          <span className="flex-1 text-start px-4 text-zinc-800">Payroll Direct Dep.</span>
                          <span className="w-24 text-end text-emerald-600 font-bold">+$4,250.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="w-16 text-zinc-600 font-semibold">03/02</span>
                          <span className="flex-1 text-start px-4 font-bold text-red-700 bg-red-100/80 rounded py-0.5">Psychiatry Clinic Visit</span>
                          <span className="w-24 text-end text-zinc-800">-$250.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After Mockup - Secured Document */}
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">{t('serviceShowcases.redactor.after')}</p>
                    {isRTL ? <ChevronLeft className="w-4 h-4 text-emerald-500" /> : <ArrowRight className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div
                    className="bg-zinc-100 text-zinc-900 rounded-[2.5rem] p-6 sm:p-10 border-[3px] border-emerald-500 shadow-[0_0_120px_rgba(16,185,129,0.15)] relative overflow-hidden lg:h-[420px] flex flex-col font-mono"
                    aria-label="Mock securely redacted document demonstrating pixel flattening"
                  >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-multiply" />
                    <div className="flex justify-between items-center border-b-2 border-zinc-200 pb-6 mb-8 relative z-10">
                      <div className="font-black text-2xl tracking-tighter text-zinc-800">GLOBAL BANK</div>
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Stmt: 2026-03-01</div>
                    </div>
                    <div className="space-y-8 flex-1 text-sm sm:text-base relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-semibold">Account Holder</span>
                        <span className="bg-zinc-900 rounded select-none w-32 h-6 flex items-center justify-center overflow-hidden shadow-inner"><span className="sr-only">Redacted Name</span></span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-semibold">Account Number</span>
                        <span className="bg-zinc-900 rounded select-none w-48 h-6 flex items-center justify-center overflow-hidden shadow-inner"><span className="sr-only">Redacted Account Number</span></span>
                      </div>
                      <div className="pt-6 border-t-2 border-zinc-200 space-y-4">
                        <div className="flex justify-between font-black text-zinc-400 text-[10px] tracking-[0.1em] uppercase mb-4">
                          <span className="w-16">Date</span>
                          <span className="flex-1 text-start px-4">Description</span>
                          <span className="w-24 text-end">Amount</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="w-16 text-zinc-600 font-semibold">03/01</span>
                          <span className="flex-1 text-start px-4 text-zinc-800">Payroll Direct Dep.</span>
                          <span className="w-24 text-end text-emerald-600 font-bold">+$4,250.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="w-16 text-zinc-600 font-semibold">03/02</span>
                          <div className="flex-1 flex px-4">
                            <span className="bg-zinc-900 rounded select-none w-40 h-6 overflow-hidden shadow-inner"><span className="sr-only">Redacted Medical Data</span></span>
                          </div>
                          <span className="w-24 text-end text-zinc-800">-$250.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-14 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-20 w-max">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-emerald-500 to-emerald-400 text-emerald-950 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-black text-[9px] sm:text-[10px] uppercase italic shadow-2xl">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="tracking-widest">Permanent Destruction</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Smart Image Compression */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-[4rem] p-4 sm:p-8 lg:p-20 space-y-12 lg:space-y-16 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
                <div className="space-y-6 max-w-xl text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-sky-500" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">{t('serviceShowcases.compressor.title')}</h3>
                  </div>
                  <p className="text-zinc-500 font-medium leading-relaxed">{t('serviceShowcases.compressor.desc')}</p>
                  <Link href="/tools/compress" className="inline-block mt-4">
                    <Button className="h-14 px-8 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest">
                      {t('serviceShowcases.compressor.cta')}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Before: Bulky Image */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4">{t('serviceShowcases.compressor.before')}</p>
                  <div className="bg-zinc-950 rounded-[2.5rem] p-1 border border-zinc-800 relative overflow-hidden lg:h-[320px] shadow-2xl flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                    <div className="flex flex-col items-center space-y-6 z-10 w-full px-12">
                      <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin opacity-50" />
                        <div className="absolute bottom-2 right-2 text-[8px] font-black text-red-500 tracking-widest">JPG</div>
                      </div>
                      <div className="w-full space-y-2">
                        <div className="h-2 bg-zinc-800 rounded-full w-full overflow-hidden relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-red-500/20" />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          <span>Loading...</span>
                          <span className="text-red-500">8.4 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After: Optimized Image */}
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500">{t('serviceShowcases.compressor.after')}</p>
                    {isRTL ? <ChevronLeft className="w-4 h-4 text-sky-500" /> : <ArrowRight className="w-4 h-4 text-sky-500" />}
                  </div>
                  <div className="bg-zinc-950 rounded-[2.5rem] p-1 border border-sky-500/30 relative overflow-hidden lg:h-[320px] shadow-[0_0_100px_rgba(14,165,233,0.1)] flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 bg-sky-500/5" />
                    <div className="flex flex-col items-center space-y-6 z-10 w-full px-12 transition-transform duration-500 group-hover:scale-105">
                      <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-sky-500/50 flex items-center justify-center relative shadow-[0_0_30px_rgba(14,165,233,0.2)]">
                        <CheckCircle2 className="w-10 h-10 text-sky-500" />
                        <div className="absolute bottom-2 right-2 text-[8px] font-black text-sky-500 tracking-widest bg-sky-500/10 px-1.5 rounded">WEBP</div>
                      </div>
                      <div className="w-full space-y-2">
                        <div className="h-2 bg-sky-500 rounded-full w-full shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
                        <div className="flex justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          <span className="text-sky-500">Instant Load</span>
                          <span className="text-sky-500">850 KB (-90%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Local PDF Merging */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-[4rem] p-4 sm:p-8 lg:p-20 space-y-12 lg:space-y-16 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
                <div className="space-y-6 max-w-xl text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <FileUp className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">{t('serviceShowcases.merger.title')}</h3>
                  </div>
                  <p className="text-zinc-500 font-medium leading-relaxed">{t('serviceShowcases.merger.desc')}</p>
                  <Button onClick={() => window.scrollTo(0, 0)} className="h-14 px-8 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest mt-4">
                    {t('serviceShowcases.merger.cta')}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Before: Scattered Files */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4">{t('serviceShowcases.merger.before')}</p>
                  <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden lg:h-[320px] shadow-2xl flex items-center justify-center">
                    <div className="flex items-center justify-center gap-4 flex-wrap px-8">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className={`w-20 h-28 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-3 ${num === 1 ? '-rotate-12 translate-y-4' : num === 3 ? 'rotate-12 translate-y-4' : '-translate-y-2'}`}>
                          <FileText className="w-6 h-6 text-zinc-500" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Doc {num}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* After: Unified Document */}
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500">{t('serviceShowcases.merger.after')}</p>
                    {isRTL ? <ChevronLeft className="w-4 h-4 text-purple-500" /> : <ArrowRight className="w-4 h-4 text-purple-500" />}
                  </div>
                  <div className="bg-zinc-950 rounded-[2.5rem] border border-purple-500/30 relative overflow-hidden lg:h-[320px] shadow-[0_0_100px_rgba(168,85,247,0.1)] flex items-center justify-center group pointer-events-none">
                    <div className="absolute inset-0 bg-purple-500/5" />
                    <div className="relative">
                      {/* Stack effect */}
                      <div className="absolute -top-4 -start-4 w-32 h-44 bg-zinc-900/50 border border-zinc-800 rounded-2xl -rotate-6 shadow-xl" />
                      <div className="absolute -top-2 -start-2 w-32 h-44 bg-zinc-900/80 border border-zinc-700 rounded-2xl -rotate-3 shadow-2xl" />

                      <div className="relative w-32 h-44 bg-zinc-900 border-2 border-purple-500/50 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center space-y-4 z-10 transition-transform duration-700 group-hover:scale-110">
                        <FileText className="w-10 h-10 text-purple-500" />
                        <div className="space-y-1.5 w-full px-6 opacity-60">
                          <div className="h-1 bg-purple-500/30 rounded-full w-full" />
                          <div className="h-1 bg-purple-500/30 rounded-full w-3/4" />
                          <div className="h-1 bg-purple-500/30 rounded-full w-5/6" />
                        </div>
                        <div className="absolute bottom-4 bg-purple-500 text-purple-950 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest shadow-lg">
                          Merged.pdf
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. PDF to Image */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-[4rem] p-4 sm:p-8 lg:p-20 space-y-12 lg:space-y-16 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
                <div className="space-y-6 max-w-xl text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Images className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">{t('serviceShowcases.pdfToImg.title')}</h3>
                  </div>
                  <p className="text-zinc-500 font-medium leading-relaxed">{t('serviceShowcases.pdfToImg.desc')}</p>
                  <Link href="/tools/pdf-to-img" className="inline-block mt-4">
                    <Button className="h-14 px-8 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest">
                      {t('serviceShowcases.pdfToImg.cta')}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Before: Locked PDF */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4">{t('serviceShowcases.pdfToImg.before')}</p>
                  <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden lg:h-[320px] shadow-2xl flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <FileText className="w-16 h-16 text-zinc-600" />
                        <Lock className="w-6 h-6 text-zinc-500 absolute -bottom-2 -right-2" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-600">Report.pdf</span>
                    </div>
                  </div>
                </div>

                {/* After: Extracted Image Gallery */}
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">{t('serviceShowcases.pdfToImg.after')}</p>
                    {isRTL ? <ChevronLeft className="w-4 h-4 text-orange-500" /> : <ArrowRight className="w-4 h-4 text-orange-500" />}
                  </div>
                  <div className="bg-zinc-950 rounded-[2.5rem] border border-orange-500/30 relative overflow-hidden lg:h-[320px] shadow-[0_0_100px_rgba(249,115,22,0.1)] flex items-center justify-center group pointer-events-none">
                    <div className="absolute inset-0 bg-orange-500/5" />
                    <div className="grid grid-cols-2 gap-4 px-8 z-10 w-full transition-transform duration-700 group-hover:scale-105">
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="aspect-square bg-zinc-900 border border-orange-500/20 rounded-2xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                          <Images className="w-6 h-6 text-orange-500/50 mb-2" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-orange-500">Page {num}</span>
                          <div className="absolute bottom-1 right-1 text-[6px] font-black text-orange-500/80">JPG</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Clean EXIF */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-[4rem] p-4 sm:p-8 lg:p-20 space-y-12 lg:space-y-16 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
                <div className="space-y-6 max-w-xl text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <ImageMinus className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">{t('serviceShowcases.cleanExif.title')}</h3>
                  </div>
                  <p className="text-zinc-500 font-medium leading-relaxed">{t('serviceShowcases.cleanExif.desc')}</p>
                  <Link href="/tools/clean-exif" className="inline-block mt-4">
                    <Button className="h-14 px-8 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest">
                      {t('serviceShowcases.cleanExif.cta')}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Before: EXIF Photo */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4">{t('serviceShowcases.cleanExif.before')}</p>
                  <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden lg:h-[320px] shadow-2xl flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 grayscale" />
                    <div className="z-10 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-red-500/50 space-y-2">
                      <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Hidden Metadata</span>
                      </div>
                      <div className="text-xs text-zinc-300 space-y-1 font-mono">
                        <p>LAT: 40.7128° N</p>
                        <p>LON: 74.0060° W</p>
                        <p>Device: iPhone 14 Pro</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After: Cleaned Photo */}
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">{t('serviceShowcases.cleanExif.after')}</p>
                    {isRTL ? <ChevronLeft className="w-4 h-4 text-blue-500" /> : <ArrowRight className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="bg-zinc-950 rounded-[2.5rem] border border-blue-500/30 relative overflow-hidden lg:h-[320px] shadow-[0_0_100px_rgba(59,130,246,0.1)] flex flex-col items-center justify-center group pointer-events-none">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-80" />
                    <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                    <div className="z-10 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-blue-500/50 space-y-2 transition-transform duration-700 group-hover:scale-105">
                      <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Metadata Stripped</span>
                      </div>
                      <div className="text-xs text-zinc-400 space-y-1 font-mono italic">
                        <p>LAT: null</p>
                        <p>LON: null</p>
                        <p>Device: null</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Secure Password */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-[4rem] p-4 sm:p-8 lg:p-20 space-y-12 lg:space-y-16 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
                <div className="space-y-6 max-w-xl text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                      <KeyRound className="w-6 h-6 text-teal-500" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">{t('serviceShowcases.password.title')}</h3>
                  </div>
                  <p className="text-zinc-500 font-medium leading-relaxed">{t('serviceShowcases.password.desc')}</p>
                  <Link href="/tools/password" className="inline-block mt-4">
                    <Button className="h-14 px-8 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest">
                      {t('serviceShowcases.password.cta')}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Before: Weak Password */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4">{t('serviceShowcases.password.before')}</p>
                  <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden lg:h-[320px] shadow-2xl flex items-center justify-center">
                    <div className="space-y-6 text-center">
                      <div className="text-4xl md:text-5xl font-mono text-zinc-700 tracking-widest blur-[2px]">
                        admin123!
                      </div>
                      <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                        <Globe className="w-4 h-4" />
                        <span>Data Breach Risk</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After: Secure Key */}
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500">{t('serviceShowcases.password.after')}</p>
                    {isRTL ? <ChevronLeft className="w-4 h-4 text-teal-500" /> : <ArrowRight className="w-4 h-4 text-teal-500" />}
                  </div>
                  <div className="bg-zinc-950 rounded-[2.5rem] border border-teal-500/30 relative overflow-hidden lg:h-[320px] shadow-[0_0_100px_rgba(20,184,166,0.1)] flex items-center justify-center group pointer-events-none">
                    <div className="absolute inset-0 bg-teal-500/5" />
                    <div className="space-y-6 text-center z-10 transition-transform duration-700 group-hover:scale-105">
                      <div className="text-xl md:text-2xl font-mono text-teal-500 tracking-[0.2em] bg-zinc-900 border border-teal-500/30 p-4 rounded-2xl break-all">
                        q9F2$xL#pM7!vK4@
                      </div>
                      <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                        <Key className="w-4 h-4" />
                        <span>Crypto-Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="space-y-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-zinc-900 text-emerald-500 border border-zinc-800">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">{t('useCases.title')}</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{t('useCases.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, title: t('useCases.hr.title'), desc: t('useCases.hr.desc') },
              { icon: Scale, title: t('useCases.legal.title'), desc: t('useCases.legal.desc') },
              { icon: EyeOff, title: t('useCases.journalists.title'), desc: t('useCases.journalists.desc') },
              { icon: Globe, title: t('useCases.publicSector.title'), desc: t('useCases.publicSector.desc') },
              { icon: ShieldCheck, title: t('useCases.compliance.title'), desc: t('useCases.compliance.desc') },
              { icon: Zap, title: t('useCases.agile.title'), desc: t('useCases.agile.desc') }
            ].map((useCase, i) => (
              <div key={i} className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] space-y-6 hover:bg-zinc-900 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                  <useCase.icon className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-start">
                  <h4 className="text-lg font-black uppercase tracking-tight italic">{useCase.title}</h4>
                  <p className="text-xs text-zinc-600 font-medium leading-relaxed">{useCase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="relative overflow-hidden bg-emerald-500 rounded-[3rem] lg:rounded-[5rem] p-12 lg:p-24 text-center space-y-10 group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="absolute -top-24 -start-24 w-64 h-64 bg-white/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -end-24 w-64 h-64 bg-emerald-950/20 blur-[100px] rounded-full" />

          <h3 className="text-4xl md:text-7xl font-black text-emerald-950 tracking-tighter uppercase italic leading-none max-w-4xl mx-auto">
            {t('cta.title')}
          </h3>

          <p className="text-emerald-900/70 font-bold uppercase tracking-widest text-sm max-w-xl mx-auto">
            {t('cta.desc')}
          </p>

          <div className="pt-8">
            <Link href="/tools/redact">
              <Button className="h-20 px-12 bg-emerald-950 hover:bg-black text-white font-black rounded-[2rem] transition-all hover:scale-105 active:scale-95 text-xl uppercase italic shadow-2xl">
                {t('cta.button')}
              </Button>
            </Link>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-emerald-950">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">VaultNode</span>
            </div>
            <p className="text-zinc-600 text-sm font-medium w-full max-w-[240px] text-center md:text-start leading-relaxed">
              {footerT('desc')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{footerT('tools')}</h5>
              <ul className="space-y-2">
                <li><Link href="/tools/redact" className="text-sm text-zinc-600 hover:text-white transition-colors">{t('launchRedactor')}</Link></li>
                <li><Link href="/tools/compress" className="text-sm text-zinc-600 hover:text-white transition-colors">{t('imageCompressor')}</Link></li>
                <li><button className="text-sm text-zinc-600 hover:text-white transition-colors">{t('pdfMerger')}</button></li>
                <li><Link href="/tools/pdf-to-img" className="text-sm text-zinc-600 hover:text-white transition-colors">{t('pdfToImg')}</Link></li>
                <li><Link href="/tools/clean-exif" className="text-sm text-zinc-600 hover:text-white transition-colors">{t('cleanExif')}</Link></li>
                <li><Link href="/tools/password" className="text-sm text-zinc-600 hover:text-white transition-colors">{t('password')}</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{footerT('philosophy')}</h5>
              <ul className="space-y-2">
                <li><button className="text-sm text-zinc-600 hover:text-white transition-colors">Zero-Trace</button></li>
                <li><button className="text-sm text-zinc-600 hover:text-white transition-colors">Hardware Sync</button></li>
                <li><button className="text-sm text-zinc-600 hover:text-white transition-colors">Security Audit</button></li>
              </ul>
            </div>
          </div>

          <div className="text-center md:text-end space-y-4">
            <div className="flex items-center justify-center md:justify-end space-x-2 rtl:space-x-reverse text-zinc-700">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{footerT('globalPresence')}</span>
            </div>
            <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} VaultNode Labs. {footerT('rights')}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
