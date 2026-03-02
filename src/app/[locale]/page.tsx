"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  FileUp, ShieldCheck, Zap, HardDrive, LayoutGrid, X,
  GripVertical, FileText, Loader2, Download, Eraser,
  MousePointer2, Cpu, ArrowDownToLine, CheckCircle2,
  Lock, EyeOff, Scale, Users, Briefcase, Globe, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface VaultFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function Home() {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-24 space-y-32">

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-500 text-xs font-black tracking-widest uppercase italic"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Next-Gen Local Privacy</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic"
            >
              Stop<br />
              <span className="text-emerald-500">Uploading</span><br />
              Your Life.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 text-lg md:text-xl max-w-xl font-medium leading-relaxed mx-auto lg:mx-0"
            >
              The digital world leaks. VaultNode doesn't. Process, redact, and merge your most sensitive documents 100% inside your browser's RAM. No servers. No traces.
            </motion.p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/tools/redact">
                <Button className="h-16 px-8 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-xl shadow-emerald-500/10 transition-all active:scale-95 italic text-lg uppercase">
                  Launch Redactor
                </Button>
              </Link>
              <Link href="/tools/compress">
                <Button variant="outline" className="h-16 px-8 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-2xl font-black transition-all italic text-lg uppercase">
                  Image Compressor
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl lg:flex-shrink-0">
            <Card className="p-1 sm:p-2 bg-zinc-900/50 border-zinc-800 rounded-[3rem] shadow-2xl backdrop-blur-xl group overflow-hidden">
              <div className="p-8 sm:p-12 space-y-8 bg-zinc-950/50 rounded-[2.5rem] border border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <FileUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">PDF Merger</h2>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                    Local-Only
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
                    Select multiple PDFs to merge in your session.
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
                      Merge Files
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
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Engineered for Humans</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">How VaultNode protects you in 3 movements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MousePointer2, step: "01", title: "Select Source", desc: "Drag your files into the vault. They are instantly loaded into your browser's private session RAM." },
              { icon: Cpu, step: "02", title: "Local Mutation", desc: "Our WebAssembly engine processes pixels and vectors locally. No data packets are sent to any server." },
              { icon: ArrowDownToLine, step: "03", title: "Secure Export", desc: "Download your finalized documents. Once you close the tab, your data is permanently wiped from RAM." }
            ].map((item, i) => (
              <div key={i} className="relative p-10 bg-zinc-900/30 border border-zinc-900 rounded-[2.5rem] space-y-6 group hover:border-emerald-500/20 transition-all">
                <div className="absolute top-8 right-10 text-4xl font-black text-white/5 group-hover:text-emerald-500/10 transition-colors uppercase italic">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-2xl group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold uppercase italic tracking-tight">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Before & After */}
        <section className="bg-zinc-900/20 border border-zinc-900 rounded-[4rem] p-8 lg:p-20 space-y-16 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Visual Proof</h2>
              <p className="text-zinc-500 font-medium">Unlike vector redaction that can be "undone," VaultNode flattens images to destroy underlying data permanently.</p>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
              <CheckCircle2 className="w-3 h-3" />
              <span>Rasterized Protection Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
            {/* Before Mockup */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4">Raw Unsecured Data</p>
              <div className="aspect-[4/5] bg-zinc-950 rounded-[3rem] border border-zinc-900 flex items-center justify-center relative group opacity-50 blur-[2px]">
                <div className="space-y-6 w-full px-12 opacity-30">
                  <div className="h-4 bg-zinc-800 rounded-full w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded-full w-full" />
                  <div className="h-4 bg-zinc-800 rounded-full w-1/2" />
                  <div className="pt-8 space-y-4">
                    <div className="h-8 bg-emerald-500/20 rounded-lg w-full flex items-center px-4 font-black italic text-[10px] text-emerald-500">CONFIDENTIAL_SSN_NUMBER</div>
                    <div className="h-8 bg-zinc-800 rounded-lg w-full" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 -rotate-12 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">Vulnerable Source</p>
                </div>
              </div>
            </div>

            {/* After Mockup */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">VaultNode Secured</p>
                <ArrowRight className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="aspect-[4/5] bg-zinc-950 rounded-[3rem] border border-emerald-500/20 flex items-center justify-center relative shadow-[0_0_100px_rgba(16,185,129,0.05)]">
                <div className="space-y-6 w-full px-12 opacity-80">
                  <div className="h-4 bg-zinc-900 rounded-full w-3/4" />
                  <div className="h-4 bg-zinc-900 rounded-full w-full" />
                  <div className="h-4 bg-zinc-900 rounded-full w-1/2" />
                  <div className="pt-8 space-y-4">
                    <div className="h-8 bg-zinc-800 rounded-lg w-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-black animate-in fade-in zoom-in duration-1000" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldCheck className="w-3 h-3 text-white/20" />
                      </div>
                    </div>
                    <div className="h-8 bg-zinc-900 rounded-lg w-full" />
                  </div>
                </div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2">
                  <div className="flex items-center space-x-2 bg-emerald-500 text-emerald-950 px-4 py-2 rounded-full font-black text-[9px] uppercase italic shadow-xl">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Permanent destruction</span>
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
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Global Compliance</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Architected for professionals who can't risk a leak</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, title: "HR Departments", desc: "Redact social security numbers and personal addresses from employee records before internal sharing." },
              { icon: Scale, title: "Legal Counsel", desc: "Blackout privileged information in discovery documents without leaving a digital vector trail behind." },
              { icon: EyeOff, title: "Journalists", desc: "Secure whistleblower sources by permanently removing metadata and identifiable visual information." },
              { icon: Globe, title: "Public Sector", desc: "Process citizen data in compliance with GDPR and CCPA using strictly local hardware execution." },
              { icon: ShieldCheck, title: "Compliance Officers", desc: "Audit high-risk documents in an air-gapped browser session with zero external dependencies." },
              { icon: Zap, title: "Agile Teams", desc: "Merge and optimize project assets fast without waiting for slow cloud uploads or processing queues." }
            ].map((useCase, i) => (
              <div key={i} className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] space-y-6 hover:bg-zinc-900 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                  <useCase.icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
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
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-950/20 blur-[100px] rounded-full" />

          <h3 className="text-4xl md:text-7xl font-black text-emerald-950 tracking-tighter uppercase italic leading-none max-w-4xl mx-auto">
            Ready to claim your digital sovereignty?
          </h3>

          <p className="text-emerald-900/70 font-bold uppercase tracking-widest text-sm max-w-xl mx-auto">
            No accounts. No subscriptions. Just pure local-only file processing for the modern privacy era.
          </p>

          <div className="pt-8">
            <Link href="/tools/redact">
              <Button className="h-20 px-12 bg-emerald-950 hover:bg-black text-white font-black rounded-[2rem] transition-all hover:scale-105 active:scale-95 text-xl uppercase italic shadow-2xl">
                Launch VaultNode Tools
              </Button>
            </Link>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-emerald-950">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">VaultNode</span>
            </div>
            <p className="text-zinc-600 text-sm font-medium w-full max-w-[240px] text-center md:text-left leading-relaxed">
              The world's most private local-only media tools. Powered by hardware-level execution.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tools</h5>
              <ul className="space-y-2">
                <li><Link href="/tools/redact" className="text-sm text-zinc-600 hover:text-white transition-colors">PDF Redactor</Link></li>
                <li><Link href="/tools/compress" className="text-sm text-zinc-600 hover:text-white transition-colors">Image Compressor</Link></li>
                <li><button className="text-sm text-zinc-600 hover:text-white transition-colors">PDF Merger</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Philosophy</h5>
              <ul className="space-y-2">
                <li><button className="text-sm text-zinc-600 hover:text-white transition-colors">Zero-Trace</button></li>
                <li><button className="text-sm text-zinc-600 hover:text-white transition-colors">Hardware Sync</button></li>
                <li><button className="text-sm text-zinc-600 hover:text-white transition-colors">Security Audit</button></li>
              </ul>
            </div>
          </div>

          <div className="text-center md:text-right space-y-4">
            <div className="flex items-center justify-center md:justify-end space-x-2 text-zinc-700">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Presence</span>
            </div>
            <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} VaultNode Labs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
