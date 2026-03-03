"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, Loader2, ChevronLeft, Image as ImageIcon, Settings2, FileArchive, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { useTranslations } from "next-intl";

export default function PdfToImgTool() {
    const tc = useTranslations("Tools.common");
    const t = useTranslations("Tools.pdfToImg");

    const [file, setFile] = useState<File | null>(null);
    const [scale, setScale] = useState<number>(2); // 1 = Normal, 2 = High, 3 = Ultra
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Next.js pdfjs-dist Worker Fix
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    const handleExtract = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            setTotalPages(pdf.numPages);
            const zip = new JSZip();

            // Create a temporary canvas for rendering
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) throw new Error("Could not create canvas context");

            for (let i = 1; i <= pdf.numPages; i++) {
                setProgress(i);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: ctx,
                    viewport: viewport
                } as any).promise;

                // Convert to blob
                const blob = await new Promise<Blob | null>((resolve) => {
                    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95);
                });

                if (blob) {
                    const pageNum = i.toString().padStart(3, '0');
                    zip.file(`page_${pageNum}.jpg`, blob);
                }
            }

            // Generate ZIP
            const zipContent = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(zipContent);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace('.pdf', '')}_images.zip`;
            link.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Extraction error:", error);
            alert("Error extracting images. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 font-sans pb-24">
            {/* Header */}
            <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1 rtl:rotate-180" />
                        <span className="text-sm font-bold uppercase tracking-widest">{tc('backHome')}</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600 font-bold tracking-widest uppercase text-xs">{tc('vaultNode')}</span>
                        <span className="text-emerald-500 font-black uppercase italic tracking-tighter text-sm">{t('titleHighlight')}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-12 lg:pt-20 space-y-12">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                        <FileArchive className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        {t('titleHighlight')} <span className="text-emerald-500">PDF</span>
                    </h1>
                </div>

                {!file ? (
                    <Card
                        {...getRootProps()}
                        className={`p-12 sm:p-24 border-2 border-dashed rounded-[3rem] text-center cursor-pointer transition-all duration-500 ${isDragActive ? 'border-emerald-500 bg-emerald-500/5 scale-102' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50'}`}
                    >
                        <input {...getInputProps()} />
                        <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <FileUp className={`w-8 h-8 transition-colors duration-300 ${isDragActive ? 'text-emerald-500' : 'text-zinc-500'}`} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4">{t('dropTitle')}</h3>
                        <p className="text-sm font-medium text-zinc-500">{t('dropDesc')}</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main File View */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="p-8 bg-zinc-900/20 border-zinc-800 rounded-[2.5rem] overflow-hidden relative min-h-[400px] flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                                <div className="z-10 text-center space-y-6 w-full px-8">
                                    <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto">
                                        <FileUp className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 truncate flex items-center gap-3 w-full">
                                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase">PDF</span>
                                        </div>
                                        <span className="font-bold text-sm truncate flex-1 text-start rtl:text-end">{file.name}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Controls Sidebar */}
                        <div className="space-y-6">
                            <Card className="p-6 bg-zinc-900/50 border-zinc-800 rounded-[2rem] space-y-8 backdrop-blur-xl">
                                <div className="flex items-center gap-3 text-emerald-500">
                                    <Settings2 className="w-5 h-5" />
                                    <h3 className="font-bold text-sm tracking-widest uppercase">{t('selectDensity')}</h3>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { val: 1, label: t('normal'), desc: '72 DPI' },
                                        { val: 2, label: t('high'), desc: '144 DPI' },
                                        { val: 3, label: t('ultra'), desc: '216 DPI' },
                                    ].map((s) => (
                                        <button
                                            key={s.val}
                                            onClick={() => setScale(s.val)}
                                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${scale === s.val ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'}`}
                                        >
                                            <span className="font-bold text-sm">{s.label}</span>
                                            <span className="text-xs font-medium opacity-50">{s.desc}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-4 space-y-4">
                                    {isProcessing && totalPages > 0 ? (
                                        <div className="space-y-3 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-emerald-500">
                                                <span>{t('extractingPage')} {progress} / {totalPages}</span>
                                                <span>{Math.round((progress / totalPages) * 100)}%</span>
                                            </div>
                                            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden flex flex-row rtl:flex-row-reverse">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-300"
                                                    style={{ width: `${(progress / totalPages) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleExtract}
                                            disabled={isProcessing}
                                            className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all active:scale-95"
                                        >
                                            <ImageIcon className="w-5 h-5 me-2" />
                                            {t('convertPages')}
                                        </Button>
                                    )}
                                </div>
                            </Card>

                            <div className="flex items-center justify-center gap-2 text-zinc-600 font-black text-[10px] uppercase tracking-widest">
                                <Shield className="w-3 h-3" />
                                <span>{tc('securedBy')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
