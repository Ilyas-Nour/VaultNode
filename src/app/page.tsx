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
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>100% Private. Local Processing.</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            >
              Your Files.<br />
              Your Browser.<br />
              <span className="text-emerald-500">Zero Uploads.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4 pt-4"
            >
              <Link href="/tools/redact">
                <Button variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
                  <Eraser className="mr-2 h-4 w-4" />
                  Try PDF Redactor
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
                      relative w-full aspect-[16/10] sm:aspect-[16/8] rounded-3xl border-2 border-dashed 
                      transition-all duration-500 cursor-pointer flex flex-col items-center justify-center space-y-6
                      ${isDragActive
                        ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                      }
                    `}
                  >
                    <input {...getInputProps()} />
                    <div className={`p-4 rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-500 ${isDragActive ? "scale-110 shadow-lg border-emerald-500/50" : ""}`}>
                      <FileUp className={`w-10 h-10 transition-colors duration-500 ${isDragActive ? "text-emerald-500" : "text-zinc-500"}`} />
                    </div>

                    <div className="text-center space-y-2 px-4">
                      <h3 className="text-xl font-semibold text-white">
                        Drag & drop PDF files here
                      </h3>
                      <p className="text-zinc-500">
                        or click to browse from your computer
                      </p>
                    </div>

                    <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
                      <div className={`absolute inset-0 pulse-emerald opacity-0 transition-opacity duration-500 ${isDragActive ? "opacity-100" : ""}`} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-emerald-500" />
                      <span>{files.length} Files Ready</span>
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFiles([])}
                      className="text-zinc-500 hover:text-white"
                    >
                      Clear All
                    </Button>
                  </div>

                  <Reorder.Group
                    axis="y"
                    values={files}
                    onReorder={setFiles}
                    className="space-y-3"
                  >
                    {files.map((file) => (
                      <Reorder.Item
                        key={file.id}
                        value={file}
                        className="touch-none"
                      >
                        <Card className="p-4 bg-zinc-900/50 border-zinc-800/50 flex items-center space-x-4 glow-hover cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-4 h-4 text-zinc-700 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); removeFile(file.id); }}
                            className="h-8 w-8 text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </Card>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  <div className="flex flex-col space-y-4">
                    <Button
                      onClick={handleMerge}
                      disabled={isProcessing || files.length < 2}
                      className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing PDFs...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Merge PDFs Locally
                        </>
                      )}
                    </Button>
                    <p className="text-center text-xs text-zinc-500">
                      Privacy Shield Active: Files are processed 100% in-browser using WebAssembly.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl pt-12">
            {[
              { icon: Zap, title: "Instant", desc: "No queueing." },
              { icon: HardDrive, title: "Offline", desc: "Works without net." },
              { icon: LayoutGrid, title: "Private", desc: "Local-only." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex flex-col items-center space-y-2 text-center glow-hover"
              >
                <f.icon className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-semibold text-white">{f.title}</span>
                <span className="text-xs text-zinc-500">{f.desc}</span>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Sidebar / Desktop AdSense Placeholder */}
        <aside className="hidden lg:block space-y-6">
          <div className="sticky top-12 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 min-h-[600px] flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Advertisement</span>
            <div className="w-[300px] h-[600px] bg-zinc-800/20 flex items-center justify-center text-xs text-zinc-600 border border-dashed border-zinc-800">
              300 x 600 STICKY BANNER
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
