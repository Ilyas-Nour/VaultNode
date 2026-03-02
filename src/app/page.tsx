"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { FileUp, ShieldCheck, Zap, HardDrive, LayoutGrid, X, GripVertical, FileText, Loader2, Download, Eraser } from "lucide-react";
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

  // Initialize Worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('../lib/pdf.worker.ts', import.meta.url));

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

    return () => {
      workerRef.current?.terminate();
    };
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

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);

    try {
      // Read all files as ArrayBuffers
      const fileBuffers = await Promise.all(
        files.map(vf => vf.file.arrayBuffer())
      );

      workerRef.current?.postMessage({
        type: 'MERGE_PDFS',
        payload: { fileBuffers }
      });
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
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start mt-12 mb-12">

        {/* Main Content */}
        <div className="flex flex-col items-center lg:items-start space-y-12 w-full">

          {/* Header */}
          <div className="space-y-4 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs sm:text-sm font-bold tracking-tight uppercase"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Private Local Processing</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] lg:leading-[0.85]"
            >
              Your Files.<br />
              <span className="text-emerald-500">Zero Uploads.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start space-x-4 pt-6"
            >
              <Link href="/tools/redact">
                <Button variant="outline" className="h-12 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 rounded-xl px-6 font-bold transition-all hover:scale-105 active:scale-95">
                  <Eraser className="mr-2 h-4 w-4" />
                  Try Secure Redactor
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Conditional UI: Dropzone or File List */}
          <div className="w-full max-w-2xl space-y-6">
            <AnimatePresence mode="wait">
              {files.length === 0 ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full"
                >
                  <div
                    {...getRootProps()}
                    className={`
                        relative w-full aspect-[4/3] sm:aspect-[16/8] rounded-[2.5rem] border-2 border-dashed 
                        transition-all duration-700 cursor-pointer flex flex-col items-center justify-center space-y-6
                        ${isDragActive
                        ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_80px_rgba(16,185,129,0.1)] scale-102"
                        : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700"
                      }
                      `}
                  >
                    <input {...getInputProps()} />
                    <div className={`p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800 transition-all duration-700 shadow-2xl ${isDragActive ? "scale-110 border-emerald-500/50" : ""}`}>
                      <FileUp className={`w-10 h-10 transition-colors duration-500 ${isDragActive ? "text-emerald-500" : "text-zinc-600"}`} />
                    </div>

                    <div className="text-center space-y-2 px-8">
                      <h3 className="text-xl font-bold tracking-tight text-white">
                        Drop Files Locally
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">
                        Your PDF data stays in your RAM.<br />
                        <span className="italic">100% Client-Side.</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-8 w-full"
                >
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight text-white">
                        {files.length} {files.length === 1 ? 'Document' : 'Documents'}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFiles([])}
                      className="text-zinc-500 hover:text-white font-bold"
                    >
                      Clear All
                    </Button>
                  </div>

                  <Reorder.Group
                    axis="y"
                    values={files}
                    onReorder={setFiles}
                    className="space-y-4 max-h-[40vh] overflow-y-auto px-1 py-1 custom-scroll"
                  >
                    {files.map((file) => (
                      <Reorder.Item
                        key={file.id}
                        value={file}
                        className="touch-none"
                      >
                        <Card className="p-5 bg-zinc-900/40 border-zinc-800/50 flex items-center space-x-4 backdrop-blur-xl rounded-2xl hover:bg-zinc-900/60 transition-colors">
                          <GripVertical className="w-4 h-4 text-zinc-800 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate pr-4">{file.name}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600 mt-1">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); removeFile(file.id); }}
                            className="h-10 w-10 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </Card>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  <div className="flex flex-col space-y-6 pt-4">
                    <Button
                      onClick={handleMerge}
                      disabled={isProcessing || files.length < 2}
                      className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xl rounded-2xl shadow-xl transition-all duration-500 active:scale-95"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download className="mr-3 h-5 w-5" />
                          Merge Locally
                        </>
                      )}
                    </Button>
                    <div className="flex items-center justify-center space-x-2 text-zinc-600">
                      <ShieldCheck className="w-3 h-3" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        Privacy Shield: Local processing active
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-8">
            {[
              { icon: Zap, title: "Instant", desc: "No latency." },
              { icon: HardDrive, title: "Private", desc: "Vault local." },
              { icon: LayoutGrid, title: "Unified", desc: "Solid UX." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`${i === 2 ? 'col-span-2 sm:col-span-1' : ''} p-5 rounded-3xl bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center space-y-2 text-center hover:border-emerald-500/30 transition-all duration-500 group`}
              >
                <div className="p-2 rounded-xl bg-zinc-900 group-hover:bg-emerald-500/10 transition-colors">
                  <f.icon className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-black uppercase tracking-tighter text-white">{f.title}</span>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Sidebar / Desktop AdSense Placeholder */}
        <aside className="hidden lg:block space-y-6">
          <div className="sticky top-12 p-8 rounded-[2.5rem] bg-zinc-900/30 border border-zinc-900 min-h-[600px] flex flex-col items-center justify-center text-center space-y-8 backdrop-blur-3xl">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">Official Partner</span>
              <div className="w-full h-px bg-zinc-800" />
            </div>

            <div className="w-[300px] h-[600px] bg-zinc-950/50 rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 group hover:border-emerald-500/20 transition-all">
              <div className="w-16 h-16 border-2 border-zinc-800 rounded-3xl rotate-45 flex items-center justify-center mb-6 group-hover:border-emerald-500/20 transition-all">
                <ShieldCheck className="w-6 h-6 text-zinc-700 group-hover:text-emerald-500/50 transition-all -rotate-45" />
              </div>
              <p className="text-xs text-zinc-600 font-bold tracking-tight px-4 leading-relaxed italic">
                Secure your digital workspace with VaultNode Premium. Local encryption for the modern era.
              </p>
            </div>

            <div className="text-[9px] uppercase tracking-widest text-zinc-700 font-bold">
              v1.0.4-Stable
            </div>
          </div>
        </aside>

      </div>

      {/* Footer Branding */}
      <footer className="mt-auto py-8 border-t border-zinc-900 w-full flex justify-center">
        <p className="text-zinc-600 text-sm">
          Built for privacy. Powered by WebAssembly. © {new Date().getFullYear()} VaultNode.
        </p>
      </footer>
    </main>
  );
}
