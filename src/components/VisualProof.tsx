"use client";

import React, { memo } from 'react';
import { Shield, Lock, FileText, FilePlus, Scissors, Key, Image, Video, Code, CheckCircle2, Eye, Sparkles } from 'lucide-react';
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
        const beforeLabel = vpT(toolId === 'redactor' ? 'redactor.before' :
            toolId === 'clean-exif' ? 'cleanExif.before' :
                toolId === 'blur' ? 'blur.before' :
                    toolId === 'encrypt' ? 'encrypt.before' :
                        toolId === 'password' ? 'password.before' :
                            toolId === 'merger' ? 'merger.before' :
                                toolId === 'heic' ? 'heic.before' :
                                    toolId === 'unlock' ? 'unlock.before' :
                                        toolId === 'svg-to-png' ? 'svgToPng.before' :
                                            toolId === 'pdf-to-docx' ? 'pdfToDocx.before' :
                                                toolId === 'pdf-to-img' ? 'pdfToImg.before' :
                                                    toolId === 'pdf-split' ? 'pdfSplit.before' :
                                                        toolId === 'media-converter' ? 'mediaConverter.before' :
                                                            toolId === 'sign' ? 'sign.before' :
                                                                toolId === 'stamp' ? 'stamp.before' :
                                                                    toolId === 'repair' ? 'repair.before' :
                                                                        toolId === 'number-pages' ? 'numberPages.before' :
                                                                            toolId === 'enhancer' ? 'enhancer.before' :
                                                                                toolId === 'bg-remover' ? 'bgRemover.before' :
                                                                                    toolId === 'organize-pages' ? 'organizePages.before' : 'before');

        const afterLabel = vpT(toolId === 'redactor' ? 'redactor.after' :
            toolId === 'clean-exif' ? 'cleanExif.after' :
                toolId === 'blur' ? 'blur.after' :
                    toolId === 'encrypt' ? 'encrypt.after' :
                        toolId === 'password' ? 'password.after' :
                            toolId === 'merger' ? 'merger.after' :
                                toolId === 'heic' ? 'heic.after' :
                                    toolId === 'unlock' ? 'unlock.after' :
                                        toolId === 'svg-to-png' ? 'svgToPng.after' :
                                            toolId === 'pdf-to-docx' ? 'pdfToDocx.after' :
                                                toolId === 'pdf-to-img' ? 'pdfToImg.after' :
                                                    toolId === 'pdf-split' ? 'pdfSplit.after' :
                                                        toolId === 'media-converter' ? 'mediaConverter.after' :
                                                            toolId === 'sign' ? 'sign.after' :
                                                                toolId === 'stamp' ? 'stamp.after' :
                                                                    toolId === 'repair' ? 'repair.after' :
                                                                        toolId === 'number-pages' ? 'numberPages.after' :
                                                                            toolId === 'enhancer' ? 'enhancer.after' :
                                                                                toolId === 'bg-remover' ? 'bgRemover.after' :
                                                                                    toolId === 'organize-pages' ? 'organizePages.after' : 'after');

        switch (toolId) {
            case 'redactor': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center relative overflow-hidden group">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
                    <div
                        className={cn(
                            "absolute inset-0 bg-cover bg-center transition-all duration-[1.5s]",
                            type === 'before' ? "blur-sm scale-100 grayscale opacity-40" : "blur-0 scale-105"
                        )}
                        style={{ backgroundImage: "url('/images/proofs/proof_enhancer.png')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className={cn(
                            "w-48 h-48 border-4 flex items-center justify-center transition-all duration-700 rounded-2xl",
                            type === 'before' ? "border-zinc-800 bg-black/40" : "border-amber-500 bg-black/20 shadow-[0_0_50px_rgba(245,158,11,0.3)]"
                        )}>
                            <Sparkles className={cn("w-16 h-16 transition-all", type === 'after' ? "text-amber-500 shadow-xl" : "text-zinc-700")} />
                        </div>
                        <div className={cn(
                            "px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 w-48 text-center",
                            type === 'after' ? "bg-amber-500 border-amber-400 text-amber-950" : "bg-black/50 border-white/10 text-white/50 backdrop-blur-md"
                        )}>
                            {type === 'before' ? vpT('enhancer.lowRes') : vpT('enhancer.ultraRes')}
                        </div>
                    </div>
                </div>
            );
            case 'bg-remover': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center relative overflow-hidden group">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
                    {type === 'before' ? (
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-all duration-[2s]"
                            style={{ backgroundImage: "url('/images/proofs/proof_bg_remover.png')" }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3MhRAxpR+f8YYGC8vH/9H7dEWSkTPHIlSeGmaUQ3m8EBBA9K1/V7DfsAAAAASUVORK5CYII=')" }} />
                            <div 
                                className="w-full h-full bg-contain bg-center bg-no-repeat transition-all duration-[1s] scale-105 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                                style={{ backgroundImage: "url('/images/proofs/proof_bg_remover.png')", clipPath: 'inset(0 0 0 50%)' }}
                            />
                        </div>
                    )}
                    <div className="absolute bottom-10 flex gap-4 z-10">
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
            case 'merger': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 gap-12 relative overflow-hidden group">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
            case 'heic': return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
            case 'unlock': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-4 p-4 relative overflow-hidden group">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
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
            case 'enhancer': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div
                            className={cn(
                                "absolute inset-0 bg-cover bg-center transition-all duration-1000",
                                type === 'before' ? "blur-sm opacity-60 grayscale" : "blur-0 opacity-100"
                            )}
                            style={{ backgroundImage: "url('/images/proofs/proof_enhancer.png')" }}
                        />
                        {type === 'after' && (
                            <div className="relative z-20 flex flex-col items-center gap-4">
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/50 backdrop-blur-xl rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em]">{vpT('enhancer.sharpened')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'bg-remover': return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div
                            className={cn(
                                "absolute inset-0 bg-cover bg-center transition-all duration-1000",
                                type === 'before' ? "opacity-100" : "opacity-0"
                            )}
                            style={{ backgroundImage: "url('/images/proofs/proof_bg_remover.png')" }}
                        />
                        {type === 'after' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-checkerboard opacity-20" />
                        )}
                        <div
                            className={cn(
                                "relative z-30 w-full h-full bg-contain bg-no-repeat bg-center transition-all duration-1000",
                                type === 'after' ? "scale-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" : "opacity-0 invisible"
                            )}
                            style={{ backgroundImage: "url('/images/proofs/proof_premium_portrait.png')" }}
                        />
                    </div>
                </div>
            );
            default: return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
                    <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
                    <span className="text-zinc-700 font-mono text-xs italic tracking-widest">{toolId.toUpperCase()}</span>
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

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-hidden">
                <div className="relative aspect-video bg-black overflow-hidden">
                    {render('before')}
                </div>
                <div className="relative aspect-video bg-black overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    {render('after')}
                </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
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
