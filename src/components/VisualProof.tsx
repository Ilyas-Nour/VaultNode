"use client";

import React, { memo } from 'react';
import { Shield, Lock, FileText, FilePlus, Scissors, Key, Image, Video, Code, CheckCircle2, Eye, Sparkles, Presentation, Table, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';


const Label = memo(({ text, type }: { text: string; type: 'before' | 'after' }) => (
    <div className={cn(
        "absolute top-4 start-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10",
        type === 'before' ? "bg-white text-black" : "bg-black text-white border border-white/20"
    )}>
        {text}
    </div>
));
Label.displayName = 'Label';

// ─── Main VisualProof ─────────────────────────────────────────────────────────

interface VisualProofProps {
    toolId: string;
    mode?: 'card' | 'full';
    className?: string;
}

export const VisualProof = memo(({ toolId, mode = 'full', className }: VisualProofProps) => {
    const t = useTranslations('HomePage.beforeAfter');
    const commonT = useTranslations('Tools.common');
    const wpT = useTranslations('HomePage.visualProof');
    const vpT = useTranslations('VisualProof');

    const render = (type: 'before' | 'after') => {
        const getFileInfo = (toolId: string, type: 'before' | 'after') => {
            const isWord = toolId.includes('word') || toolId.includes('docx');
            const isPdf = toolId.includes('pdf');
            const isPpt = toolId.includes('ppt');
            const isExcel = toolId.includes('excel') || toolId.includes('xlsx');
            const isText = toolId.includes('text') || toolId.includes('txt');
            const isScan = toolId.includes('scan');
            const isHtml = toolId.includes('html');

            let ext = '';
            let icon = <FileText className="w-4 h-4" />;
            
            if (type === 'before') {
                if (isWord && toolId.startsWith('word')) ext = '.DOCX';
                else if (isPdf && toolId.startsWith('pdf')) ext = '.PDF';
                else if (isPpt && toolId.startsWith('ppt')) ext = '.PPTX';
                else if (isExcel && toolId.startsWith('excel')) ext = '.XLSX';
                else if (isText && toolId.startsWith('text')) ext = '.TXT';
                else if (isHtml) ext = '.HTML';
                else if (isScan) ext = 'PAPER';
                else if (isPdf) ext = '.PDF';
            } else {
                if (toolId.endsWith('pdf')) ext = '.PDF';
                else if (toolId.endsWith('docx') || toolId.endsWith('word')) ext = '.DOCX';
                else if (toolId.endsWith('ppt')) ext = '.PPTX';
                else if (toolId.endsWith('excel')) ext = '.XLSX';
                else if (toolId.endsWith('text')) ext = '.TXT';
            }

            if (ext === '.PPTX') icon = <Presentation className="w-4 h-4 text-orange-500" />;
            if (ext === '.XLSX') icon = <Table className="w-4 h-4 text-emerald-500" />;

            return { ext, icon, isPpt: ext === '.PPTX' || (type === 'before' && isPpt) };
        };

        const { ext, icon, isPpt } = getFileInfo(toolId, type);

        const LABEL_MAP: Record<string, string> = {
            'redactor': 'redactor',
            'redact': 'redactor',
            'clean-exif': 'cleanExif',
            'blur': 'blur',
            'encrypt': 'encrypt',
            'password': 'password',
            'merger': 'merger',
            'pdf-merge': 'merger',
            'heic': 'heic',
            'heic-to-jpg': 'heic',
            'unlock': 'unlock',
            'unlock-pdf': 'unlock',
            'svg-to-png': 'svgToPng',
            'pdf-to-docx': 'pdfToDocx',
            'pdf-to-img': 'pdfToImg',
            'pdf-split': 'pdfSplit',
            'media-converter': 'mediaConverter',
            'sign': 'sign',
            'stamp': 'stamp',
            'repair': 'repair',
            'number-pages': 'numberPages',
            'enhancer': 'enhancer',
            'bg-remover': 'bgRemover',
            'organize-pages': 'organizePages',
            'text-to-word': 'textToWord',
            'word-to-text': 'wordToText',
            'excel-to-pdf': 'excelToPdf',
            'pdf-to-excel': 'pdfToExcel',
            'word-to-pdf': 'wordToPdf',
            'pdf-to-ppt': 'pdfToPpt',
            'ppt-to-pdf': 'pptToPdf',
            'html-to-pdf': 'htmlToPdf',
            'scan-to-pdf': 'scanToPdf',
            'compress': 'compress',
            'image-to-text': 'imageToText',
        };

        const key = LABEL_MAP[toolId] || 'default';
        const labelText = vpT(`${key}.${type}`);
        const finalLabel = labelText.includes('VisualProof.') ? (type === 'before' ? 'Before' : 'After') : labelText;

        switch (toolId) {
            case 'redactor':
            case 'redact': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-[2s] opacity-50 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    <div className="relative z-10 w-full max-w-sm aspect-[3/4] bg-white border border-zinc-200 shadow-2xl p-8 flex flex-col gap-5 overflow-hidden">
                        <div className="h-4 w-3/4 bg-zinc-200 rounded-sm" />
                        <div className="space-y-3 mt-4">
                            <div className="flex gap-2 items-center">
                                <div className="h-3 w-32 bg-zinc-100 rounded-sm" />
                                <div className={cn("h-4 w-24 rounded-sm transition-all", type === 'after' ? "bg-black" : "bg-zinc-100")} />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-3 w-full bg-zinc-100 rounded-sm" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-3 w-4/5 bg-zinc-100 rounded-sm" />
                            </div>
                            <div className="flex gap-2 items-center mt-4">
                                <div className="h-3 w-20 bg-zinc-100 rounded-sm" />
                                <div className={cn("h-4 w-32 rounded-sm transition-all", type === 'after' ? "bg-black" : "bg-zinc-100")} />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-3 w-full bg-zinc-100 rounded-sm" />
                            </div>
                            <div className="flex gap-2 items-center mt-4">
                                <div className="h-3 w-16 bg-zinc-100 rounded-sm" />
                                <div className={cn("h-4 w-40 rounded-sm transition-all", type === 'after' ? "bg-black" : "bg-zinc-100")} />
                            </div>
                        </div>
                        
                        <div className="mt-8 space-y-3">
                            <div className="flex gap-2">
                                <div className="h-3 w-full bg-zinc-100 rounded-sm" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-3 w-5/6 bg-zinc-100 rounded-sm" />
                            </div>
                        </div>

                        <div className="mt-auto border-t pt-6 flex justify-between items-center">
                            <div className="h-3 w-24 bg-zinc-200 rounded-sm" />
                            <div className="relative">
                                <div className="h-3 w-32 bg-zinc-200 rounded-sm" />
                                <div className={cn("absolute inset-0 rounded-sm transition-all", type === 'after' ? "bg-black" : "bg-transparent")} />
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 'compress': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center relative overflow-hidden group">
                    <Label text={type === 'before' ? vpT('compress.heavy') : vpT('compress.modern')} type={type} />
                    <div
                        className={cn(
                            "absolute inset-0 bg-cover bg-center transition-all duration-[2s]",
                            type === 'before' ? "scale-100" : "scale-105"
                        )}
                        style={{ backgroundImage: "url('/images/proofs/proof_car_1773347841567.png')" }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-8 left-8 z-10">
                        <span className={cn("px-4 py-2 font-black uppercase tracking-[0.2em] text-[10px] border shadow-2xl backdrop-blur-md",
                            type === 'before' ? "bg-black/50 text-white/80 border-white/20" : "bg-emerald-500/80 text-white border-emerald-400/50")}>
                            {type === 'before' ? vpT('compress.lossy') : vpT('compress.advanced')}
                        </span>
                    </div>
                </div>
            );
            case 'clean-exif': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_car_1773347841567.png')" }}
                    />
                    <div className="relative z-10 w-full max-w-lg aspect-square h-full max-h-[85%] bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl p-8 font-mono text-xs flex flex-col gap-4 overflow-hidden">
                        <div className="flex justify-between items-center text-zinc-400 border-b border-white/10 pb-4">
                            <span className="font-black uppercase tracking-widest text-[10px]">{vpT('cleanExif.manifest')}</span>
                            <span className="text-[10px]">ID: 0x9281.RAW</span>
                        </div>
                        <div className="space-y-4 pt-4 flex-1">
                            {[
                                { k: 'Camera', v: 'ILCE-7RM4', r: false },
                                { k: 'Coordinates', v: '48.8584° N, 2.2945° E', r: true },
                                { k: 'Device ID', v: 'SN-048293-8472', r: true },
                                { k: 'Lens Info', v: 'FE 24-70mm F2.8 GM', r: false },
                                { k: 'Exposure', v: '1/250s f/4.0 ISO 100', r: false },
                                { k: 'Software', v: 'Adobe Photoshop 2024', r: true },
                            ].map((item, i) => (
                                <div key={item.k} className="flex justify-between items-center transition-all">
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">{item.k}</span>
                                    {type === 'before' ? (
                                        <span className="text-zinc-200">{item.v}</span>
                                    ) : (
                                        item.r ? (
                                            <span className="text-emerald-500/30 font-black italic">{vpT('cleanExif.removed')}</span>
                                        ) : (
                                            <span className="text-zinc-200">{item.v}</span>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                        {type === 'after' && (
                            <div className="mt-auto bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-4">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                <div className="flex flex-col">
                                    <span className="text-emerald-400 font-black uppercase tracking-widest text-[9px]">{vpT('cleanExif.validation')}</span>
                                    <span className="text-emerald-900 text-[8px] font-bold uppercase tracking-widest">{vpT('cleanExif.noSensitive')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'blur': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className={cn(
                            "absolute inset-0 bg-cover bg-center transition-all duration-700",
                            type === 'before' ? "blur-0 scale-100" : "blur-3xl scale-110"
                        )}
                        style={{ backgroundImage: "url('/images/proofs/proof_premium_portrait.png')" }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className={cn(
                            "w-48 h-48 border-4 flex items-center justify-center transition-all duration-700 rounded-full",
                            type === 'before' ? "border-emerald-500 bg-black/40 shadow-[0_0_50px_rgba(16,185,129,0.3)]" : "border-white/10 bg-white/5"
                        )}>
                            <Eye className={cn("w-16 h-16 transition-all", type === 'before' ? "text-emerald-500 shadow-xl" : "text-white/20")} />
                        </div>
                        <div className={cn(
                            "px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 w-48 text-center",
                            type === 'before' ? "bg-emerald-500 border-emerald-400 text-white" : "bg-black/50 border-white/10 text-white/50 backdrop-blur-md"
                        )}>
                            {type === 'before' ? vpT('blur.sharpFocus') : vpT('blur.fullyObscured')}
                        </div>
                    </div>
                </div>
            );
            case 'enhancer': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div 
                            className={cn(
                                "absolute inset-0 bg-no-repeat transition-all duration-[2s]",
                                type === 'before' ? "blur-sm scale-110 grayscale opacity-40" : "blur-0 scale-[1.15]"
                            )}
                            style={{ 
                                backgroundImage: "url('/images/proofs/proof_enhancer.png')",
                                backgroundSize: '200% auto',
                                backgroundPosition: type === 'before' ? '0% 50%' : '100% 50%'
                            }}
                        />
                    </div>
                    <div className="absolute bottom-6 flex gap-4 z-40">
                         <div className={cn(
                            "px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.3em] transition-all",
                            type === 'before' ? "bg-white text-black border-white" : "bg-amber-500 text-amber-950 border-amber-400"
                        )}>
                             {type === 'before' ? vpT('enhancer.lowFid') : vpT('enhancer.ultraRes')}
                         </div>
                    </div>
                </div>
            );
            case 'bg-remover': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div 
                            className="absolute inset-0 bg-no-repeat transition-all duration-[2s]"
                            style={{ 
                                backgroundImage: "url('/images/proofs/proof_bg_remover.png')",
                                backgroundSize: '200% auto',
                                backgroundPosition: type === 'before' ? '0% 50%' : '100% 50%'
                            }}
                        />
                    </div>
                    <div className="absolute bottom-6 flex gap-4 z-40">
                         <div className={cn(
                            "px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.3em] transition-all",
                            type === 'before' ? "bg-white text-black border-white" : "border-emerald-500 text-emerald-500 bg-emerald-500/10 backdrop-blur"
                        )}>
                             {type === 'before' ? vpT('bgRemover.raw') : vpT('bgRemover.purified')}
                         </div>
                    </div>
                </div>
            );
            case 'encrypt': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col gap-6 p-10 font-mono text-sm relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    {type === 'before' ? (
                        <div className="relative z-10 space-y-4 mt-12 bg-zinc-900/50 backdrop-blur-md p-8 border border-white/5 rounded-xl h-full max-h-[80%] overflow-hidden shadow-2xl">
                            <div className="text-zinc-400 text-sm leading-relaxed">
                                <span className="text-zinc-600 font-black uppercase tracking-widest text-xs">{vpT('encrypt.origin')}: </span>internal-hq-01.local
                            </div>
                            <div className="text-zinc-400 text-sm leading-relaxed">
                                <span className="text-zinc-600 font-black uppercase tracking-widest text-xs">{vpT('encrypt.subject')}: </span>Q3 Financial Projection
                            </div>
                            <hr className="border-zinc-800 my-4" />
                            <p className="text-zinc-300 text-sm leading-loose">
                                {vpT('encrypt.confidential')}:<br />
                                All department heads should note the following routing numbers for the offshore accounts:<br />
                                <span className="text-white font-black bg-white/10 px-2 py-0.5 rounded shadow-lg">SWIFT: PF-99482-AD</span><br />
                                <span className="text-white font-black bg-white/10 px-2 py-0.5 rounded shadow-lg">IBAN: US84 0021 3948 2938</span>
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10 space-y-6 mt-12 h-full max-h-[80%] flex flex-col drop-shadow-2xl">
                            <div className="text-[11px] text-zinc-500 uppercase tracking-[0.3em] font-black backdrop-blur-sm self-start px-2 rounded-sm">{vpT('encrypt.algorithm')}</div>
                            <div className="bg-zinc-900/90 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-8 break-all text-[11px] text-emerald-400 leading-relaxed font-mono shadow-[0_0_80px_rgba(16,185,129,0.1)] flex-1 overflow-hidden">
                                0x4829AABB...F39482CC<br />
                                U2FsdGVkX1+mK9vXzT2qR8bN3cWpL7sH<br />
                                4eA1YdFvGs6JtPw0lQrZ9uMxCk8nVhOi<br />
                                XbD2EyR5TsW3aF7gJ6cN4pKmHqUvBeLw<br />
                                K9vXzT2qR8bN3cWpL7sH4eA1YdFvGs6J<br />
                                tPw0lQrZ9uMxCk8nVhOiXbD2EyR5TsW3<br />
                                <span className="text-zinc-600">... {vpT('encrypt.chains')} ...</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-emerald-400 font-black uppercase tracking-widest bg-emerald-500/10 py-2 px-4 rounded-full self-start border border-emerald-500/20 backdrop-blur-md">
                                <Lock className="w-4 h-4" />
                                <span>{vpT('encrypt.isolated')}</span>
                            </div>
                        </div>
                    )}
                </div>
            );
            case 'password': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-10 p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    {type === 'before' ? (
                        <div className="relative z-10 space-y-6 w-full max-w-sm">
                            <div className="space-y-4">
                                {['password123', 'admin_2024', 'welcome1'].map((p, i) => (
                                    <div key={i} className="flex items-center gap-6 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 px-8 py-4 shadow-2xl group">
                                        <Key className="w-5 h-5 text-zinc-500" />
                                        <span className="text-zinc-400 font-mono text-base">{p}</span>
                                        <div className="ml-auto flex items-center gap-2">
                                            <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em]">{vpT('password.compromised')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full bg-zinc-900/80 backdrop-blur-sm h-2 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-red-500 h-full w-[15%] shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                            </div>
                            <p className="text-zinc-500 bg-zinc-900/50 w-max mx-auto px-4 py-1 rounded backdrop-blur-sm border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-center italic">{vpT('password.resistant')}</p>
                        </div>
                    ) : (
                        <div className="relative z-10 space-y-6 w-full max-w-sm">
                            <div className="space-y-4">
                                {['K@p9$2xL!m3#Qv', 'fN&5zW^4R*T9$G', 'sV!6hY#8nS@1kP'].map((p, i) => (
                                    <div key={i} className="flex items-center gap-6 bg-zinc-900/90 backdrop-blur-md border border-emerald-500/30 px-8 py-4 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                                        <Key className="w-5 h-5 text-emerald-500" />
                                        <span className="text-emerald-300 font-mono text-lg tracking-[0.1em]">{p}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full bg-zinc-900/80 backdrop-blur-sm h-2 rounded-full overflow-hidden border border-emerald-500/20">
                                <div className="bg-emerald-500 h-full w-full shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                            </div>
                            <p className="text-emerald-400 bg-emerald-900/30 w-max mx-auto px-4 py-1 rounded backdrop-blur-sm border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-center italic">{vpT('password.quantum')}</p>
                        </div>
                    )}
                </div>
            );
            case 'merger':
            case 'pdf-merge': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 gap-12 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    {type === 'before' ? (
                        <div className="relative z-10 flex flex-col gap-4 mt-8">
                            {['Legal_Contract_v1.pdf', 'Appendix_Schedules.pdf', 'Addendum_04.pdf'].map((f, i) => (
                                <div key={i} className="flex items-center gap-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 px-6 py-4 w-64 shadow-xl">
                                    <FileText className="w-5 h-5 text-zinc-500" />
                                    <span className="text-zinc-300 text-sm font-mono">{f}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative z-10 flex flex-col items-center gap-4 h-full max-h-[85%] py-8">
                            <div className="relative h-full aspect-[3/4]">
                                <div className="absolute -top-3 -left-3 w-full h-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 shadow-xl" />
                                <div className="absolute -top-1.5 -left-1.5 w-full h-full bg-zinc-850/90 backdrop-blur-md border border-zinc-700 shadow-xl" />
                                <div className="relative w-full h-full bg-zinc-900/95 backdrop-blur-xl border border-emerald-500/30 flex flex-col items-center justify-center gap-6 p-12 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                                    <FilePlus className="w-16 h-16 text-emerald-500 drop-shadow-lg" />
                                    <span className="text-emerald-400 font-mono text-sm font-bold">Consolidated_Contract.pdf</span>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-emerald-500/80 text-[10px] uppercase font-black tracking-widest">{vpT('merger.unified')}</span>
                                        <div className="h-1 w-32 bg-emerald-500/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
            case 'heic':
            case 'heic-to-jpg': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_car_1773347841567.png')" }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-6 h-full max-h-[85%] py-8">
                        <div className={cn(
                            "w-auto aspect-square h-full border-4 flex flex-col items-center justify-center gap-6 shadow-2xl transition-all backdrop-blur-xl",
                            type === 'before' ? "border-zinc-700/50 bg-zinc-900/80" : "border-emerald-500/50 bg-zinc-900/90 shadow-[0_0_80px_rgba(16,185,129,0.2)]"
                        )}>
                            <Image className={cn("w-20 h-20 drop-shadow-xl", type === 'before' ? "text-zinc-500" : "text-emerald-500")} />
                            <div className="text-center px-4">
                                <span className={cn("font-mono text-sm font-black tracking-widest block", type === 'before' ? "text-zinc-400" : "text-emerald-400")}>
                                    {type === 'before' ? 'DSC_9281.HEIC' : 'DSC_9281.jpg'}
                                </span>
                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 block">
                                    {type === 'before' ? `4.8 MB · ${vpT('heic.proprietary')}` : `2.1 MB · ${vpT('heic.universal')}`}
                                </span>
                            </div>
                        </div>
                        {type === 'before' ? (
                            <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black text-center leading-relaxed">
                                {vpT('heic.incompatible')}
                            </div>
                        ) : (
                            <div className="text-[10px] text-emerald-500 uppercase tracking-[0.3em] font-black text-center leading-relaxed backdrop-blur-sm bg-emerald-500/10 px-4 py-1 rounded w-max mx-auto border border-emerald-500/20">
                                {vpT('heic.compatible')}
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'unlock':
            case 'unlock-pdf': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-4 p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    <div className={cn(
                        "relative z-10 w-auto aspect-[3/4] h-full max-h-[85%] border-2 flex flex-col items-start p-10 gap-6 transition-all backdrop-blur-xl",
                        type === 'before' ? "border-zinc-700/50 bg-zinc-900/80 opacity-60" : "border-emerald-500/30 bg-zinc-900/90 shadow-[0_0_80px_rgba(16,185,129,0.15)]"
                    )}>
                        <div className="h-3 w-3/4 bg-zinc-700/80 rounded-full" />
                        <div className="h-3 w-full bg-zinc-700/80 rounded-full" />
                        <div className="h-3 w-full bg-zinc-700/80 rounded-full" />
                        <div className="h-3 w-5/6 bg-zinc-700/80 rounded-full" />
                        <div className="h-3 w-full bg-zinc-700/80 rounded-full" />

                        {type === 'before' && (
                            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 bg-zinc-900 border border-red-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                                    <Lock className="w-8 h-8 text-red-500" />
                                </div>
                                <span className="text-zinc-400 text-xs font-black uppercase tracking-[0.2em] px-3 py-1 bg-red-950/30 border border-red-500/20 rounded">{vpT('unlock.restricted')}</span>
                            </div>
                        )}
                        {type === 'after' && (
                            <>
                                <div className="h-3 w-full bg-zinc-700/80 rounded-full" />
                                <div className="h-3 w-3/4 bg-zinc-700/80 rounded-full" />
                                <div className="mt-auto w-full h-24 bg-zinc-800/40 border border-emerald-500/20 rounded-xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 drop-shadow-lg" />
                                </div>
                                <div className="flex items-center gap-3 text-emerald-400 mt-2 bg-emerald-950/20 px-4 py-2 rounded-full border border-emerald-500/20 w-max self-center">
                                    <Lock className="w-4 h-4 opacity-70" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{vpT('unlock.restored')}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            );
            case 'svg-to-png': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_car_1773347841567.png')" }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-8 h-full max-h-[85%] py-4">
                        <div className={cn(
                            "w-auto aspect-square h-full border-2 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all",
                            type === 'before' ? "border-zinc-700/50 bg-zinc-900/80" : "border-emerald-500/50 bg-zinc-900/90 shadow-[0_0_80px_rgba(16,185,129,0.15)]"
                        )}>
                            {type === 'before' ? (
                                <div className="text-center space-y-6 px-12">
                                    <Code className="w-16 h-16 text-zinc-500 mx-auto" />
                                    <div className="font-mono text-[11px] text-zinc-400 text-left leading-loose bg-black/60 p-6 border border-white/10 rounded-lg shadow-inner">
                                        {`<svg width="100%" height="100%">`}<br />
                                        {`  <rect x="10" y="10" width="80"`}<br />
                                        {`  height="80" fill="#10B981"/>`}<br />
                                        {`</svg>`}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 px-8">
                                    <div className="w-48 h-48 mx-auto relative border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl bg-zinc-950">
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#18181b_0px,#18181b_8px,#27272a_8px,#27272a_16px)] opacity-50" />
                                        <div className="absolute inset-8 bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] rounded-lg" />
                                    </div>
                                    <div className="space-y-1 bg-zinc-950/50 py-2 border border-white/5 rounded backdrop-blur-sm">
                                        <span className="text-emerald-400 font-mono text-xs font-black uppercase tracking-widest">4096 × 4096 PX</span>
                                        <span className="text-zinc-400 text-[10px] block font-bold uppercase tracking-[0.25em]">{vpT('svgToPng.alpha')}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black bg-zinc-950/80 px-4 py-1 rounded backdrop-blur border border-white/5">
                            {type === 'before' ? vpT('svgToPng.geometry') : vpT('svgToPng.bitmaps')}
                        </span>
                    </div>
                </div>
            );
            case 'pdf-to-docx': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4 h-full max-h-[85%] py-4">
                        <div className={cn(
                            "w-auto aspect-[3/4] h-full border-2 flex flex-col p-10 gap-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all backdrop-blur-xl",
                            type === 'before' ? "border-zinc-700/50 bg-zinc-900/80 opacity-70" : "border-emerald-500/40 bg-zinc-900/90 shadow-[0_0_80px_rgba(16,185,129,0.15)]"
                        )}>
                            <div className={cn("text-xs font-black uppercase tracking-[0.2em] mb-4 border-b pb-2",
                                type === 'before' ? "text-zinc-500 border-zinc-700/50" : "text-emerald-400 border-emerald-500/20")}>
                                {type === 'before' ? 'CORPORATE_BYLAWS.pdf' : 'CORPORATE_BYLAWS.docx'}
                            </div>
                            {[100, 75, 100, 50, 85, 65, 90, 40].map((w, i) => (
                                <div key={i} className={cn("h-2 rounded-full", type === 'before' ? "bg-zinc-700/80" : "bg-zinc-600/80")}
                                    style={{ width: `${w}%` }} />
                            ))}
                            {type === 'before' ? (
                                <div className="mt-auto flex items-center justify-center py-4 border border-zinc-700 bg-zinc-950/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] gap-3 backdrop-blur shadow-inner rounded">
                                    <Lock className="w-4 h-4 opacity-50" /> {vpT('pdfToDocx.static')}
                                </div>
                            ) : (
                                <div className="mt-auto flex items-center justify-center py-4 border border-emerald-500/50 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] gap-3 bg-emerald-500/10 backdrop-blur shadow-inner rounded">
                                    {vpT('pdfToDocx.interactive')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
            case 'pdf-to-img': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_car_1773347841567.png')" }}
                    />
                    {type === 'before' ? (
                        <div className="relative z-10 flex flex-col items-center gap-6 h-full max-h-[85%] py-4">
                            <div className="w-auto aspect-[3/4] h-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 flex flex-col p-8 gap-4 shadow-2xl relative">
                                <div className="h-3 w-full bg-zinc-800/80 rounded-full" />
                                <div className="h-3 w-3/4 bg-zinc-800/80 rounded-full" />
                                <div className="flex-1 bg-zinc-800/10 border border-zinc-800/30 rounded-xl my-4 flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-zinc-700 drop-shadow-md" />
                                </div>
                                <div className="h-3 w-full bg-zinc-800/80 rounded-full mt-auto" />
                            </div>
                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] bg-zinc-950/80 px-4 py-1 rounded backdrop-blur border border-white/5">{vpT('pdfToImg.multipage')}</span>
                        </div>
                    ) : (
                        <div className="relative z-10 flex flex-col items-center gap-6 h-full max-h-[85%] py-4">
                            <div className="flex gap-4 h-full items-center">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-auto aspect-[3/4] h-[70%] bg-zinc-900/90 backdrop-blur-md border border-emerald-500/30 flex flex-col items-center justify-center gap-4 p-4 shadow-2xl transition-all hover:-translate-y-2 group/card">
                                        <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center rounded-lg border border-emerald-500/10 shadow-inner">
                                            <Image className="w-8 h-8 text-emerald-500 group-hover/card:scale-110 transition-transform" />
                                        </div>
                                        <span className="text-[9px] text-zinc-400 font-mono font-bold tracking-widest uppercase">page_{i}.png</span>
                                        <div className="h-1 w-full bg-emerald-500/20 rounded-full" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-500/10 px-4 py-1 rounded backdrop-blur border border-emerald-500/20">{vpT('pdfToImg.lossless')}</span>
                        </div>
                    )}
                </div>
            );
            case 'pdf-split': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    {type === 'before' ? (
                        <div className="relative z-10 flex flex-col items-center gap-6 h-full max-h-[85%] py-8">
                            <div className="relative h-full aspect-[3/4]">
                                {[4, 3, 2, 1, 0].map(i => (
                                    <div key={i} className="absolute w-full h-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 shadow-2xl"
                                        style={{ top: i * 6, left: i * 6 }}>
                                    </div>
                                ))}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                    <div className="flex flex-col items-center gap-4">
                                        <FileText className="w-12 h-12 text-zinc-500 drop-shadow-lg" />
                                        <span className="text-zinc-300 text-sm font-mono font-black uppercase tracking-[0.2em] bg-zinc-950/60 px-4 py-1 rounded">{vpT('pdfSplit.master')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 flex gap-8 h-full max-h-[80%] items-center py-4">
                            {[
                                { label: 'SECTION I\npp. 1–20', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' },
                                { label: 'SECTION II\npp. 21–40', color: 'border-zinc-700/50 text-zinc-500 bg-zinc-900/60' },
                                { label: 'SECTION III\npp. 41–64', color: 'border-zinc-700/50 text-zinc-500 bg-zinc-900/60' },
                            ].map((s, i) => (
                                <div key={i} className={cn("w-auto aspect-[3/4] h-full border-2 flex flex-col items-center justify-center gap-6 p-8 shadow-2xl transition-all backdrop-blur-md", s.color)}>
                                    <Scissors className={cn("w-8 h-8 drop-shadow-md", s.color.includes('emerald') ? 'text-emerald-500' : 'text-zinc-600')} />
                                    <span className={cn("text-[10px] font-mono font-black text-center whitespace-pre uppercase tracking-widest", s.color)}>{s.label}</span>
                                    <div className={cn("h-1 w-full rounded-full", s.color.includes('emerald') ? 'bg-emerald-500/20' : 'bg-zinc-800/80')} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
            case 'media-converter': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_car_1773347841567.png')" }}
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-12 h-full max-h-[85%] w-full max-w-lg">
                        {type === 'before' ? (
                            <div className="w-full aspect-video bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 flex flex-col items-center justify-center gap-6 shadow-2xl relative overflow-hidden group">
                                <Video className="w-16 h-16 text-zinc-400 relative z-10 drop-shadow-lg" />
                                <div className="relative z-10 text-center bg-zinc-950/60 backdrop-blur py-2 px-6 rounded-lg border border-white/5">
                                    <span className="text-zinc-300 font-mono text-sm font-bold block uppercase tracking-widest">Global_Presentation.mp4</span>
                                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 block">AVC/H.264 · 245.2 MB</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800/80">
                                    <div className="w-1/3 h-full bg-zinc-500 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full aspect-video bg-zinc-900/90 backdrop-blur-xl border border-emerald-500/30 flex flex-col items-center justify-center gap-8 shadow-[0_0_60px_rgba(16,185,129,0.15)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] relative z-10 bg-zinc-950">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                                </div>
                                <div className="text-center relative z-10 bg-zinc-950/60 backdrop-blur py-2 px-6 rounded-lg border border-emerald-500/20">
                                    <span className="text-emerald-400 font-mono text-sm font-black block uppercase tracking-widest">Global_Presentation.mp3</span>
                                    <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2 block">320 KBPS · 14.8 MB</span>
                                </div>
                                <div className="flex gap-2 items-end h-16 absolute bottom-8 opacity-40">
                                    {[4, 10, 6, 14, 8, 12, 5, 9, 7, 13, 6, 11, 4, 8, 10, 7, 12, 5, 10, 6].map((h, i) => (
                                        <div key={i} className="w-2.5 bg-emerald-500 rounded-sm transition-all duration-500" style={{ height: `${h * 4}px` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <span className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-black bg-zinc-950/80 px-4 py-1.5 rounded backdrop-blur border border-white/5">
                            {type === 'after' ? vpT('mediaConverter.transcoder') : vpT('mediaConverter.vaultSecure')}
                        </span>
                    </div>
                </div>
            );
            case 'sign': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4 w-full h-full max-h-[85%]">
                        <div className={cn(
                            "w-auto aspect-[3/4] h-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col p-8 sm:p-12 gap-6 transition-all backdrop-blur-xl",
                            type === 'before' ? "border-zinc-200/50 opacity-90" : "border-emerald-500/30"
                        )}>
                            <div className="h-2 w-full bg-zinc-200/80 rounded-full" />
                            <div className="h-2 w-3/4 bg-zinc-200/80 rounded-full" />
                            <div className="h-2 w-full bg-zinc-200/80 rounded-full" />
                            <div className="h-2 w-full bg-zinc-200/80 rounded-full" />
                            <div className="h-2 w-2/3 bg-zinc-200/80 rounded-full" />

                            <div className="mt-auto pt-10 border-t-2 border-zinc-200/80">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">{vpT('sign.authorized')}:</span>
                                        <div className="h-2 w-32 bg-zinc-100 rounded" />
                                    </div>
                                    <div className="flex flex-col gap-2 relative">
                                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">{vpT('sign.signature')}:</span>
                                        <div className="h-2 w-32 bg-zinc-100 rounded" />
                                        {type === 'after' && (
                                            <div className="absolute -top-10 left-0 text-blue-900 font-serif italic text-3xl leading-none transform -rotate-12 filter drop-shadow-md select-none pointer-events-none whitespace-nowrap">
                                                Alex J. Smith
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 'stamp': return (
                <div className="w-full h-full flex items-center justify-center bg-zinc-950 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-[20s] linear animate-slow-zoom grayscale" style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }} />
                    {type === 'after' && (
                        <div className="absolute bottom-12 right-12 transition-all">
                            <div className="border-[6px] border-emerald-500/30 p-8 rounded-[40px] backdrop-blur-xl bg-black/60 shadow-[0_0_80px_rgba(16,185,129,0.3)] border-double outline outline-1 outline-emerald-500/20 rotate-12">
                                <div className="flex flex-col items-center gap-3">
                                    <Shield className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <div className="text-center">
                                        <span className="text-xl font-black tracking-tighter text-emerald-500 uppercase italic block leading-none">VaultNode Secure</span>
                                        <span className="text-emerald-800 font-mono text-[10px] font-black uppercase tracking-[0.4em] block mt-1">{vpT('stamp.stamped')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
            case 'repair': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 gap-12 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-6 h-full max-h-[85%] py-8">
                        {type === 'before' ? (
                            <div className="flex flex-col items-center gap-8 h-full justify-center">
                                <div className="w-48 h-48 border-4 border-red-500/20 flex items-center justify-center bg-red-950/40 backdrop-blur-md rounded-full animate-pulse shadow-[0_0_70px_rgba(239,68,68,0.15)]">
                                    <Code className="w-20 h-20 text-red-500/60 drop-shadow-md" />
                                </div>
                                <div className="text-center space-y-2 bg-zinc-950/80 backdrop-blur px-8 py-4 rounded border border-red-500/10">
                                    <span className="text-red-500 font-mono text-sm font-black uppercase tracking-[0.2em] block">{vpT('repair.integrityFailure')}</span>
                                    <span className="text-red-900 font-mono text-[10px] uppercase font-bold tracking-[0.3em] block italic">Offset: 0x000FF421 · EOF Missing</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-8 h-full justify-center">
                                <div className="w-48 h-48 border-4 border-emerald-500/40 flex items-center justify-center bg-emerald-950/40 backdrop-blur-md rounded-full shadow-[0_0_80px_rgba(16,185,129,0.2)]">
                                    <CheckCircle2 className="w-20 h-20 text-emerald-500 drop-shadow-md" />
                                </div>
                                <div className="text-center space-y-2 bg-zinc-950/80 backdrop-blur px-8 py-4 rounded border border-emerald-500/20">
                                    <span className="text-emerald-400 font-mono text-sm font-black uppercase tracking-[0.2em] block">{vpT('repair.recovered')}</span>
                                    <span className="text-emerald-900 font-mono text-[10px] uppercase font-bold tracking-[0.3em] block italic">{vpT('repair.rebuilt')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'number-pages': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    <div className="relative z-10 flex gap-8 h-full max-h-[75%] items-center">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-auto aspect-[3/4] h-full bg-white/95 backdrop-blur-md border border-zinc-200/50 shadow-2xl relative flex flex-col p-6 gap-3 overflow-hidden">
                                <div className="h-2 w-full bg-zinc-200/80 rounded-full" />
                                <div className="h-2 w-5/6 bg-zinc-200/80 rounded-full" />
                                <div className="h-2 w-full bg-zinc-200/80 rounded-full" />
                                <div className="h-2 w-full bg-zinc-200/80 rounded-full" />
                                <div className="mt-auto h-2 w-full bg-zinc-200/80 rounded-full" />
                                <div className="h-2 w-1/2 bg-zinc-200/80 rounded-full" />
                                {type === 'after' && (
                                    <div className="absolute bottom-6 left-0 right-0 text-center">
                                        <span className="bg-emerald-50 px-3 py-1 rounded-sm text-emerald-600 font-mono text-[9px] font-black uppercase tracking-widest border border-emerald-200/50 shadow-sm inline-block transform scale-110">
                                            PAGE {i}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'organize-pages': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 grayscale"
                        style={{ backgroundImage: "url('/images/proofs/proof_document_1773347701051.png')" }}
                    />
                    <div className="relative z-10 grid grid-cols-2 gap-6 h-full max-h-[85%] py-4">
                        {(type === 'before' ? ['03', '01', '04', '02'] : ['01', '02', '03', '04']).map((n, i) => (
                            <div key={i} className={cn(
                                "w-auto aspect-[3/4] h-full border-2 flex flex-col items-center justify-center gap-4 transition-all shadow-2xl backdrop-blur-md",
                                type === 'before' ? "bg-zinc-900/80 border-zinc-700/50" : "bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                            )}>
                                <FileText className={cn("w-8 h-8 drop-shadow-md", type === 'before' ? "text-zinc-600" : "text-emerald-500")} />
                                <span className={cn("font-mono text-xs font-black tracking-[0.2em] bg-black/40 px-2 py-0.5 rounded", type === 'before' ? "text-zinc-500" : "text-emerald-400")}>PAGE {n}</span>
                                <div className="flex flex-col gap-1 w-12">
                                    <div className={cn("h-1 rounded-full", type === 'before' ? "bg-zinc-700/80" : "bg-emerald-500/50")} />
                                    <div className={cn("h-1 rounded-full w-2/3", type === 'before' ? "bg-zinc-700/80" : "bg-emerald-500/50")} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'text-to-word': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div className="relative z-10 w-full h-full flex items-center justify-center gap-8">
                        {type === 'before' ? (
                            <div className="w-48 h-64 bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col gap-3 font-mono text-[10px] text-zinc-500 overflow-hidden">
                                <span>$ cat notes.txt</span>
                                <div className="space-y-1 mt-2">
                                    <div className="h-1.5 w-full bg-zinc-800" />
                                    <div className="h-1.5 w-3/4 bg-zinc-800" />
                                    <div className="h-1.5 w-full bg-zinc-800" />
                                    <div className="h-1.5 w-1/2 bg-zinc-800" />
                                </div>
                                <div className="mt-auto flex items-center gap-2">
                                    <FileText className="w-3 h-3" />
                                    <span className="text-[8px] uppercase font-black uppercase tracking-widest text-zinc-600">Raw Stream</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-48 h-64 bg-white border border-zinc-200 shadow-2xl p-8 flex flex-col gap-5 overflow-hidden transform rotate-2">
                                <div className="h-4 w-3/4 bg-zinc-100 rounded-sm mb-4" />
                                <div className="space-y-3">
                                    {[100, 90, 95, 80].map((w, i) => (
                                        <div key={i} className="h-2 bg-zinc-50 rounded-full" style={{ width: `${w}%` }} />
                                    ))}
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="w-12 h-12 bg-blue-50/50 border border-blue-100 flex items-center justify-center rounded-sm">
                                        <FileText className="w-6 h-6 text-blue-600 opacity-60" />
                                    </div>
                                    <div className="h-6 w-16 bg-blue-600/10 border border-blue-600/20 rounded-full" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'word-to-text': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={finalLabel} type={type} />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {type === 'before' ? (
                            <div className="w-48 h-64 bg-white border border-zinc-200 shadow-2xl p-8 flex flex-col gap-5 overflow-hidden filter grayscale opacity-60">
                                <div className="h-4 w-3/4 bg-zinc-100 rounded-sm mb-4" />
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-2 w-full bg-zinc-50 rounded-full" />
                                ))}
                                <div className="mt-8 text-zinc-200 font-black text-4xl uppercase tracking-tighter self-center transform -rotate-45 select-none">DOCX</div>
                            </div>
                        ) : (
                            <div className="w-64 h-48 bg-zinc-900/90 border border-emerald-500/30 p-8 flex flex-col gap-4 shadow-[0_0_50px_rgba(16,185,129,0.1)] rounded-lg">
                                <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4 mb-2">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    <span className="text-emerald-400 font-mono text-[10px] uppercase font-black tracking-widest">Extracted Content</span>
                                </div>
                                <div className="space-y-2">
                                    {[100, 95, 100, 60].map((w, i) => (
                                        <div key={i} className="h-1.5 bg-emerald-500/10 rounded-full" style={{ width: `${w}%` }} />
                                    ))}
                                </div>
                                <div className="mt-auto flex justify-between items-center bg-emerald-500/5 px-4 py-2 rounded border border-emerald-500/10">
                                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest line-through decoration-emerald-500/40">binary data</span>
                                    <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest font-mono">plain text ✓</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'excel-to-pdf':
            case 'pdf-to-excel':
                return (
                    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                        <Label text={finalLabel} type={type} />
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded text-[9px] font-black text-emerald-500 z-20">
                            {icon}
                            <span>{ext}</span>
                        </div>
                        <div className="relative z-10 w-full h-full max-w-lg aspect-video flex items-center justify-center">
                            {type === 'before' ? (
                                <div className="w-full h-full bg-zinc-900/80 border border-zinc-800 flex flex-col shadow-2xl overflow-hidden">
                                    <div className="h-6 bg-zinc-800/50 border-b border-zinc-700/50 flex items-center px-2 gap-4">
                                        <div className="flex gap-1">
                                            {['A', 'B', 'C', 'D', 'E'].map(l => <div key={l} className="w-10 text-[8px] text-zinc-600 font-bold text-center">{l}</div>)}
                                        </div>
                                    </div>
                                    <div className="flex-1 grid grid-cols-5 grid-rows-6 border-collapse">
                                        {Array.from({ length: 30 }).map((_, i) => (
                                            <div key={i} className="border border-zinc-800/20 p-2 flex items-center relative">
                                                {i % 5 === 0 && <span className="absolute left-1 top-1 text-[6px] text-zinc-700">{Math.floor(i/5) + 1}</span>}
                                                <div className={cn("h-1 rounded-full", i % 7 === 0 ? "w-1/2 bg-emerald-500/20" : "w-3/4 bg-zinc-800/40")} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-[75%] h-full bg-white border border-zinc-200 shadow-2xl p-6 flex flex-col gap-4 overflow-hidden transform rotate-1">
                                    <div className="flex justify-between items-center bg-zinc-50 p-3 rounded border border-zinc-100 mb-2">
                                        <div className="h-1.5 w-24 bg-zinc-900 rounded-full" />
                                        <div className="h-1.5 w-12 bg-emerald-500/20 rounded-full" />
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-3 items-center">
                                                <div className="h-1 w-full bg-zinc-100 rounded-full" />
                                                <div className="h-1 w-16 bg-zinc-100 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'word-to-pdf':
            case 'pdf-to-docx':
            case 'ppt-to-pdf':
            case 'pdf-to-ppt':
            case 'html-to-pdf':
            case 'scan-to-pdf':
            case 'text-to-word':
                return (
                    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                        <Label text={finalLabel} type={type} />
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1 rounded text-[9px] font-black text-zinc-400 z-20">
                            {icon}
                            <span>{ext}</span>
                        </div>
                        <div className="relative z-10 w-full h-full max-w-lg aspect-video flex items-center justify-center">
                            {type === 'before' ? (
                                <div className={cn(
                                    "bg-zinc-900 border border-zinc-800 flex flex-col shadow-2xl overflow-hidden p-8 opacity-60",
                                    isPpt ? "aspect-[16/9] w-[80%]" : "w-[60%] h-full"
                                )}>
                                    <div className="h-4 w-3/4 bg-zinc-800 rounded-sm mb-6" />
                                    <div className="space-y-3">
                                        {[90, 100, 95, 80, 100, 70, 90, 85].map((w, i) => (
                                            <div key={i} className="h-1.5 bg-zinc-800 rounded-full" style={{ width: `${w}%` }} />
                                        ))}
                                    </div>
                                    {isPpt && (
                                        <div className="mt-auto flex gap-2">
                                            {[1, 2, 3].map(i => <div key={i} className="w-8 h-6 bg-zinc-800/50 rounded-sm" />)}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={cn(
                                    "bg-white border border-zinc-200 shadow-2xl flex flex-col gap-5 overflow-hidden transform",
                                    isPpt ? "aspect-[16/9] w-[80%] p-6 -rotate-1" : "w-[60%] h-full p-10 -rotate-1"
                                )}>
                                    <div className="h-4 w-1/2 bg-zinc-900 rounded-sm mb-4" />
                                    <div className="space-y-3">
                                        {[100, 100, 95, 90, 100, 85].map((w, i) => (
                                            <div key={i} className="h-2 bg-zinc-100 rounded-full" style={{ width: `${w}%` }} />
                                        ))}
                                    </div>
                                    {isPpt ? (
                                        <div className="mt-auto grid grid-cols-2 gap-4">
                                            <div className="aspect-video bg-zinc-50 border border-zinc-100 rounded flex items-center justify-center">
                                                <Presentation className="w-4 h-4 text-zinc-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-1.5 w-full bg-zinc-100 rounded-full" />
                                                <div className="h-1.5 w-3/4 bg-zinc-100 rounded-full" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-10 p-6 border-2 border-dashed border-zinc-100 rounded-lg flex flex-col gap-2">
                                            <div className="h-2 w-1/4 bg-zinc-200 rounded-full" />
                                            <div className="h-4 w-1/2 bg-zinc-50 rounded-sm" />
                                        </div>
                                    )}
                                    <div className="mt-auto flex justify-between items-center text-[8px] font-black text-zinc-300 uppercase tracking-widest border-t border-zinc-50 pt-4">
                                        <span>Vault Manifest v2.1</span>
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-2.5 h-2.5 text-emerald-500" />
                                            <span>Sovereign Output</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'image-to-text':
                return (
                    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                        <Label text={finalLabel} type={type} />
                        <div className="relative z-10 w-full h-full max-w-lg aspect-video flex items-center justify-center">
                            {type === 'before' ? (
                                <div className="w-[60%] h-full bg-[#fdfaf1] border border-zinc-200 shadow-2xl p-8 flex flex-col gap-4 overflow-hidden relative">
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(transparent,transparent_20px,#000_21px)]" />
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <PenTool className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="h-2 w-24 bg-zinc-200 rounded-full" />
                                    </div>
                                    <svg viewBox="0 0 200 100" className="w-full h-auto opacity-40">
                                        <path d="M10 20 Q 30 10 50 25 T 90 20 T 130 30 T 180 15" stroke="currentColor" fill="none" strokeWidth="1.5" className="text-zinc-800" />
                                        <path d="M15 45 Q 40 35 65 50 T 115 40 T 170 55" stroke="currentColor" fill="none" strokeWidth="1.2" className="text-zinc-700" />
                                        <path d="M20 75 Q 50 65 80 80 T 140 70 T 185 85" stroke="currentColor" fill="none" strokeWidth="1.8" className="text-zinc-900" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-full h-[70%] bg-zinc-900 border border-emerald-500/20 p-8 flex flex-col gap-4 shadow-[0_0_80px_rgba(16,185,129,0.05)] rounded-sm">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4 text-white/90">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            </div>
                                            <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">OCR Success</span>
                                        </div>
                                        <span className="text-zinc-600 font-mono text-[9px]">Confidence: 99.4%</span>
                                    </div>
                                    <div className="space-y-3 font-mono text-[11px] text-zinc-300">
                                        <p>&gt; Reconstructing semantic fragments...</p>
                                        <p className="text-emerald-500/80">The quick brown fox jumps over the lazy dog.</p>
                                        <div className="h-1.5 w-1/2 bg-zinc-800 rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'word-to-text':
                return (
                    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                        <Label text={finalLabel} type={type} />
                        <div className="relative z-10 w-full h-full max-w-lg aspect-video flex items-center justify-center">
                            {type === 'before' ? (
                                <div className="w-[60%] h-full bg-white border border-zinc-200 shadow-2xl p-8 flex flex-col gap-5 overflow-hidden filter grayscale opacity-40">
                                    <div className="h-4 w-3/4 bg-zinc-100 rounded-sm mb-4" />
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-1.5 w-full bg-zinc-50 rounded-full" />
                                    ))}
                                    <div className="mt-auto border-t pt-4">
                                        <div className="h-1.5 w-1/2 bg-zinc-50 rounded-full" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-[60%] bg-zinc-900 border border-emerald-500/20 p-8 flex flex-col gap-3 shadow-[0_0_80px_rgba(16,185,129,0.05)] rounded-sm font-mono text-[10px]">
                                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
                                        <span className="text-emerald-500 font-bold">$</span>
                                        <span className="text-zinc-500 uppercase tracking-widest text-[9px]">Text Buffer Extracted</span>
                                    </div>
                                    <div className="space-y-2">
                                        {[100, 95, 80, 100, 75].map((w, i) => (
                                            <div key={i} className="h-1 bg-emerald-500/40 rounded-full" style={{ width: `${w}%` }} />
                                        ))}
                                    </div>
                                    <div className="mt-auto text-emerald-500/40 text-[8px] uppercase tracking-[0.4em] text-center">Plaintext Isolation Complete</div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default: return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <Label text={finalLabel} type={type} />
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="w-24 h-24 border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center relative shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />
                            <Lock className={cn("w-10 h-10 transition-all", type === 'after' ? "text-emerald-500" : "text-zinc-600")} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                    className={cn("h-full transition-all duration-1000", type === 'after' ? "w-full bg-emerald-500" : "w-1/3 bg-zinc-600")} 
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">{toolId.replace(/-/g, ' ')}</span>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">{wpT('label')}</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white italic">
                {t(`${toolId.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}.after`)}
            </h3>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
                <div className={cn(
                    "relative bg-black overflow-hidden",
                    (toolId === 'bg-remover' || toolId === 'enhancer') ? "aspect-square max-w-sm mx-auto w-full" : "aspect-video"
                )}>
                    {render('before')}
                </div>
                <div className={cn(
                    "relative bg-black overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]",
                    (toolId === 'bg-remover' || toolId === 'enhancer') ? "aspect-square max-w-sm mx-auto w-full" : "aspect-video"
                )}>
                    {render('after')}
                </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2 text-zinc-600">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">{vpT('integrity')}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">{vpT('metadata')}</span>
                </div>
            </div>
        </div>
    );
});

VisualProof.displayName = 'VisualProof';
