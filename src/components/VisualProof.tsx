"use client";

import React, { memo } from 'react';
import { Shield, Lock, FileText, FilePlus, Scissors, Key, Image, Video, Code, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

// ─── Image-backed sub-renderers ───────────────────────────────────────────────

const RedactorProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Label text={type === 'before' ? 'Original Source' : 'Sanitized Data'} type={type} />
        <div className="w-auto aspect-[3/4] h-full max-h-[85%] bg-white border border-zinc-200 shadow-2xl p-10 flex flex-col gap-6 overflow-hidden">
            <div className="h-4 w-3/4 bg-zinc-100 rounded-full" />
            <div className="space-y-3">
                <div className="flex gap-2">
                    <div className="h-3 w-48 bg-zinc-50 rounded-full" />
                    {type === 'after' && <div className="h-4 w-24 bg-black rounded" />}
                </div>
                <div className="flex gap-2">
                    <div className="h-3 w-64 bg-zinc-50 rounded-full" />
                </div>
                <div className="flex gap-2">
                    <div className="h-3 w-32 bg-zinc-50 rounded-full" />
                    {type === 'after' && <div className="h-4 w-40 bg-black rounded" />}
                </div>
            </div>
            <div className="mt-8 space-y-4">
                {[100, 95, 80, 100, 60].map((w, i) => (
                    <div key={i} className="h-2 bg-zinc-50 rounded-full" style={{ width: `${w}%` }} />
                ))}
            </div>
            <div className="mt-auto border-t pt-6 flex justify-between items-center">
                <div className="h-2 w-24 bg-zinc-100 rounded-full" />
                <div className="relative">
                    <div className="h-2 w-32 bg-zinc-100 rounded-full" />
                    {type === 'after' && <div className="absolute inset-0 bg-black rounded" />}
                </div>
            </div>
        </div>
    </div>
));
RedactorProof.displayName = 'RedactorProof';

const ImageProof = memo(({ type, url, beforeLabel, afterLabel }: {
    type: 'before' | 'after'; url: string; beforeLabel: string; afterLabel: string;
}) => (
    <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${url}')` }}>
        <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
    </div>
));
ImageProof.displayName = 'ImageProof';

const CleanExifProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Label text={type === 'before' ? 'Embedded Metadata' : 'Anonymized Raw'} type={type} />
        <div className="w-full max-w-lg aspect-square h-full max-h-[85%] bg-zinc-900 border border-zinc-800 shadow-2xl p-8 font-mono text-xs flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-center text-zinc-500 border-b border-white/5 pb-4">
                <span className="font-black uppercase tracking-widest text-[10px]">Metadata manifest</span>
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
                        <span className="text-zinc-600 font-bold uppercase tracking-widest text-[9px]">{item.k}</span>
                        {type === 'before' ? (
                            <span className="text-zinc-300">{item.v}</span>
                        ) : (
                            item.r ? (
                                <span className="text-emerald-500/30 font-black italic">[REMOVED]</span>
                            ) : (
                                <span className="text-zinc-300">{item.v}</span>
                            )
                        )}
                    </div>
                ))}
            </div>
            {type === 'after' && (
                <div className="mt-auto bg-emerald-500/5 border border-emerald-500/20 p-4 flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <div className="flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[9px]">Validation Passed</span>
                        <span className="text-emerald-900 text-[8px] font-bold uppercase tracking-widest">No Sensitive Strings Detected</span>
                    </div>
                </div>
            )}
        </div>
    </div>
));
CleanExifProof.displayName = 'CleanExifProof';

const BlurProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center relative overflow-hidden group">
        <Label text={type === 'before' ? 'Obfuscated' : 'Enhanced Depth'} type={type} />
        <div
            className={cn(
                "absolute inset-0 bg-cover bg-center transition-all duration-[2s]",
                type === 'before' ? "blur-2xl scale-110 grayscale" : "blur-0 scale-100 grayscale-0"
            )}
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1200')" }}
        />
        <div className="relative z-10 flex flex-col items-center gap-6">
            <div className={cn(
                "w-64 h-64 border-4 flex items-center justify-center transition-all",
                type === 'before' ? "border-white/10 bg-white/5" : "border-emerald-500 bg-black/40 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
            )}>
                <Image className={cn("w-20 h-20", type === 'before' ? "text-white/20" : "text-emerald-500 shadow-xl")} />
            </div>
            <div className={cn(
                "px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                type === 'before' ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-emerald-500 border-emerald-400 text-white"
            )}>
                {type === 'before' ? "Low Fidelity" : "Ultra Resolution"}
            </div>
        </div>
    </div>
));
BlurProof.displayName = 'BlurProof';

// ─── CSS-based mockups ────────────────────────────────────────────────────────

/** Encrypt: plaintext → cipher text */
const EncryptProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col gap-6 p-10 font-mono text-sm">
        <Label text={type === 'before' ? 'Global Plaintext' : '256-Bit Encrypted'} type={type} />
        {type === 'before' ? (
            <div className="space-y-4 mt-12 bg-zinc-900/50 p-8 border border-white/5 rounded-xl h-full max-h-[80%] overflow-hidden">
                <div className="text-zinc-400 text-sm leading-relaxed">
                    <span className="text-zinc-600 font-black uppercase tracking-widest text-xs">Origin: </span>internal-hq-01.local
                </div>
                <div className="text-zinc-400 text-sm leading-relaxed">
                    <span className="text-zinc-600 font-black uppercase tracking-widest text-xs">Subject: </span>Q3 Financial Projection
                </div>
                <hr className="border-zinc-800 my-4" />
                <p className="text-zinc-300 text-sm leading-loose">
                    CONFIDENTIAL MEMO:<br />
                    All department heads should note the following routing numbers for the offshore accounts:<br />
                    <span className="text-white font-black bg-white/10 px-2 py-0.5 rounded">SWIFT: PF-99482-AD</span><br />
                    <span className="text-white font-black bg-white/10 px-2 py-0.5 rounded">IBAN: US84 0021 3948 2938</span>
                </p>
            </div>
        ) : (
            <div className="space-y-6 mt-12 h-full max-h-[80%] flex flex-col">
                <div className="text-[11px] text-zinc-600 uppercase tracking-[0.3em] font-black">XTS-AES-256 · Galois Counter Mode</div>
                <div className="bg-zinc-900/80 border border-emerald-500/20 rounded-xl p-8 break-all text-[11px] text-emerald-400 leading-relaxed font-mono shadow-[0_0_40px_rgba(16,185,129,0.05)] flex-1 overflow-hidden">
                    0x4829AABB...F39482CC<br />
                    U2FsdGVkX1+mK9vXzT2qR8bN3cWpL7sH<br />
                    4eA1YdFvGs6JtPw0lQrZ9uMxCk8nVhOi<br />
                    XbD2EyR5TsW3aF7gJ6cN4pKmHqUvBeLw<br />
                    K9vXzT2qR8bN3cWpL7sH4eA1YdFvGs6J<br />
                    tPw0lQrZ9uMxCk8nVhOiXbD2EyR5TsW3<br />
                    <span className="text-zinc-600">... [BLOCK CHAINS CONTINUED] ...</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-emerald-500 font-black uppercase tracking-widest bg-emerald-500/5 py-2 px-4 rounded-full self-start border border-emerald-500/10">
                    <Lock className="w-4 h-4" />
                    <span>Cryptographically Isolated</span>
                </div>
            </div>
        )}
    </div>
));
EncryptProof.displayName = 'EncryptProof';

/** Password: weak → strong entropy */
const PasswordProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-10 p-4">
        <Label text={type === 'before' ? 'Weak Credentials' : 'Perfect Entropy'} type={type} />
        {type === 'before' ? (
            <div className="space-y-6 w-full max-w-sm">
                <div className="space-y-4">
                    {['password123', 'admin_2024', 'welcome1'].map((p, i) => (
                        <div key={i} className="flex items-center gap-6 bg-zinc-900 border border-zinc-800 px-8 py-4 shadow-xl group">
                            <Key className="w-5 h-5 text-zinc-700" />
                            <span className="text-zinc-500 font-mono text-base">{p}</span>
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em]">Compromised</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-[15%] shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                </div>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] text-center italic">Brute-force resistant: ZERO</p>
            </div>
        ) : (
            <div className="space-y-6 w-full max-w-sm">
                <div className="space-y-4">
                    {['K@p9$2xL!m3#Qv', 'fN&5zW^4R*T9$G', 'sV!6hY#8nS@1kP'].map((p, i) => (
                        <div key={i} className="flex items-center gap-6 bg-zinc-900 border border-emerald-500/20 px-8 py-4 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                            <Key className="w-5 h-5 text-emerald-500" />
                            <span className="text-emerald-300 font-mono text-lg tracking-[0.1em]">{p}</span>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                </div>
                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] text-center italic">128-bit Entropy · Quantum Ready</p>
            </div>
        )}
    </div>
));
PasswordProof.displayName = 'PasswordProof';

/** PDF Merge: multiple files → single file */
const MergeProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 gap-12">
        <Label text={type === 'before' ? '3 Separate Files' : '1 Merged Document'} type={type} />
        {type === 'before' ? (
            <div className="flex flex-col gap-4 mt-8">
                {['Legal_Contract_v1.pdf', 'Appendix_Schedules.pdf', 'Addendum_04.pdf'].map((f, i) => (
                    <div key={i} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 px-6 py-4 w-64 shadow-xl">
                        <FileText className="w-5 h-5 text-zinc-500" />
                        <span className="text-zinc-300 text-sm font-mono">{f}</span>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center gap-4 h-full max-h-[85%] py-8">
                <div className="relative h-full aspect-[3/4]">
                    <div className="absolute -top-3 -left-3 w-full h-full bg-zinc-800 border border-zinc-700 shadow-xl" />
                    <div className="absolute -top-1.5 -left-1.5 w-full h-full bg-zinc-850 border border-zinc-700 shadow-xl" />
                    <div className="relative w-full h-full bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-6 p-12 shadow-2xl">
                        <FilePlus className="w-16 h-16 text-emerald-500" />
                        <span className="text-emerald-400 font-mono text-sm font-bold">Consolidated_Contract.pdf</span>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">3 files unified</span>
                            <div className="h-1 w-32 bg-zinc-800 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
));
MergeProof.displayName = 'MergeProof';

/** HEIC → JPG */
const HeicProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4">
        <Label text={type === 'before' ? 'HEIC (Apple Format)' : 'Universal JPEG'} type={type} />
        <div className="flex flex-col items-center gap-6 h-full max-h-[85%] py-8">
            <div className={cn(
                "w-auto aspect-square h-full border-4 flex flex-col items-center justify-center gap-6 shadow-2xl transition-all",
                type === 'before' ? "border-zinc-700 bg-zinc-900" : "border-emerald-500 bg-zinc-900 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            )}>
                <Image className={cn("w-20 h-20", type === 'before' ? "text-zinc-600" : "text-emerald-500")} />
                <div className="text-center">
                    <span className={cn("font-mono text-sm font-black tracking-widest block", type === 'before' ? "text-zinc-500" : "text-emerald-400")}>
                        {type === 'before' ? 'DSC_9281.HEIC' : 'DSC_9281.jpg'}
                    </span>
                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 block">
                        {type === 'before' ? '4.8 MB · Proprietary' : '2.1 MB · Universal'}
                    </span>
                </div>
            </div>
            {type === 'before' ? (
                <div className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black text-center leading-relaxed">
                    ✗ Incompatible with Windows/Android
                </div>
            ) : (
                <div className="text-[10px] text-emerald-500 uppercase tracking-[0.3em] font-black text-center leading-relaxed">
                    ✓ Cross-Platform Compatible
                </div>
            )}
        </div>
    </div>
));
HeicProof.displayName = 'HeicProof';

/** Unlock PDF */
const UnlockProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-4 p-4">
        <Label text={type === 'before' ? 'Password Protected' : 'Unlocked & Free'} type={type} />
        <div className={cn(
            "relative w-auto aspect-[3/4] h-full max-h-[85%] border-2 flex flex-col items-start p-10 gap-6 transition-all",
            type === 'before' ? "border-zinc-700 bg-zinc-900 opacity-60" : "border-emerald-500/30 bg-zinc-900 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        )}>
            <div className="h-3 w-3/4 bg-zinc-800 rounded-full" />
            <div className="h-3 w-full bg-zinc-800 rounded-full" />
            <div className="h-3 w-full bg-zinc-800 rounded-full" />
            <div className="h-3 w-5/6 bg-zinc-800 rounded-full" />
            <div className="h-3 w-full bg-zinc-800 rounded-full" />

            {type === 'before' && (
                <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-[4px] flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 border border-red-500/50 flex items-center justify-center shadow-2xl">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">Restricted Access</span>
                </div>
            )}
            {type === 'after' && (
                <>
                    <div className="h-3 w-full bg-zinc-800 rounded-full" />
                    <div className="h-3 w-3/4 bg-zinc-800 rounded-full" />
                    <div className="mt-auto w-full h-24 bg-zinc-800/40 border border-zinc-800 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-3 text-emerald-500 mt-2">
                        <Lock className="w-4 h-4 opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Standard PDF Permissions Restored</span>
                    </div>
                </>
            )}
        </div>
    </div>
));
UnlockProof.displayName = 'UnlockProof';

/** SVG → PNG */
const SvgToPngProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4">
        <Label text={type === 'before' ? 'SVG Vector' : 'PNG Raster'} type={type} />
        <div className="flex flex-col items-center gap-8 h-full max-h-[85%] py-4">
            <div className={cn(
                "w-auto aspect-square h-full border-2 flex items-center justify-center shadow-2xl",
                type === 'before' ? "border-zinc-700 bg-zinc-900" : "border-emerald-500 bg-zinc-900"
            )}>
                {type === 'before' ? (
                    <div className="text-center space-y-6 px-12">
                        <Code className="w-16 h-16 text-zinc-500 mx-auto" />
                        <div className="font-mono text-[11px] text-zinc-600 text-left leading-loose bg-black/40 p-6 border border-white/5 rounded-lg">
                            {`<svg width="100%" height="100%">`}<br />
                            {`  <rect x="10" y="10" width="80"`}<br />
                            {`  height="80" fill="#10B981"/>`}<br />
                            {`</svg>`}
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="w-48 h-48 mx-auto relative border border-emerald-500/20">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#18181b_0px,#18181b_8px,#27272a_8px,#27272a_16px)]" />
                            <div className="absolute inset-8 bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-emerald-400 font-mono text-xs font-black uppercase tracking-widest">4096 × 4096 PX</span>
                            <span className="text-zinc-600 text-[10px] block font-bold uppercase tracking-[0.25em]">Alpha Channel preserved</span>
                        </div>
                    </div>
                )}
            </div>
            <span className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">
                {type === 'before' ? 'Code-defined Geometry' : 'High-Resolution Bitmaps'}
            </span>
        </div>
    </div>
));
SvgToPngProof.displayName = 'SvgToPngProof';

/** PDF → Word */
const PdfToDocxProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4">
        <Label text={type === 'before' ? 'Locked PDF' : 'Editable DOCX'} type={type} />
        <div className="flex flex-col items-center gap-4 h-full max-h-[85%] py-4">
            <div className={cn(
                "w-auto aspect-[3/4] h-full border-2 flex flex-col p-10 gap-4 shadow-2xl transition-all",
                type === 'before' ? "border-zinc-700 bg-zinc-900 opacity-60" : "border-emerald-500 bg-zinc-900 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
            )}>
                <div className={cn("text-xs font-black uppercase tracking-[0.2em] mb-4 border-b pb-2",
                    type === 'before' ? "text-zinc-600 border-zinc-800" : "text-emerald-500 border-emerald-500/20")}>
                    {type === 'before' ? 'CORPORATE_BYLAWS.pdf' : 'CORPORATE_BYLAWS.docx'}
                </div>
                {[100, 75, 100, 50, 85, 65, 90, 40].map((w, i) => (
                    <div key={i} className={cn("h-2 rounded-full", type === 'before' ? "bg-zinc-800" : "bg-zinc-700")}
                        style={{ width: `${w}%` }} />
                ))}
                {type === 'before' ? (
                    <div className="mt-auto flex items-center justify-center py-4 border border-zinc-800 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] gap-3">
                        <Lock className="w-4 h-4" /> STATIC · READ ONLY
                    </div>
                ) : (
                    <div className="mt-auto flex items-center justify-center py-4 border border-emerald-500 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] gap-3 bg-emerald-500/5">
                        ✏️ INTERACTIVE · EDITABLE
                    </div>
                )}
            </div>
        </div>
    </div>
));
PdfToDocxProof.displayName = 'PdfToDocxProof';

/** PDF → Images */
const PdfToImgProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4">
        <Label text={type === 'before' ? 'PDF Document' : 'PNG Pages'} type={type} />
        {type === 'before' ? (
            <div className="flex flex-col items-center gap-6 h-full max-h-[85%] py-4">
                <div className="w-auto aspect-[3/4] h-full bg-zinc-900 border border-zinc-700 flex flex-col p-8 gap-4 shadow-2xl relative">
                    <div className="h-3 w-full bg-zinc-800 rounded-full" />
                    <div className="h-3 w-3/4 bg-zinc-800 rounded-full" />
                    <div className="flex-1 bg-zinc-800/20 border border-zinc-800 rounded-xl my-4 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-zinc-700" />
                    </div>
                    <div className="h-3 w-full bg-zinc-800 rounded-full mt-auto" />
                </div>
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Multi-page PDF Document</span>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-6 h-full max-h-[85%] py-4">
                <div className="flex gap-4 h-full items-center">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-auto aspect-[3/4] h-[70%] bg-zinc-900 border border-emerald-500/30 flex flex-col items-center justify-center gap-4 p-4 shadow-xl transition-transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center rounded-lg">
                                <Image className="w-8 h-8 text-emerald-500" />
                            </div>
                            <span className="text-[9px] text-zinc-500 font-mono font-bold tracking-widest uppercase">page_{i}.png</span>
                            <div className="h-1 w-full bg-emerald-500/20 rounded-full" />
                        </div>
                    ))}
                </div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">300 DPI · Lossless Assets</span>
            </div>
        )}
    </div>
));
PdfToImgProof.displayName = 'PdfToImgProof';

/** PDF Split */
const PdfSplitProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4">
        <Label text={type === 'before' ? 'Single PDF' : 'Split into Ranges'} type={type} />
        {type === 'before' ? (
            <div className="flex flex-col items-center gap-6 h-full max-h-[85%] py-8">
                <div className="relative h-full aspect-[3/4]">
                    {[4, 3, 2, 1, 0].map(i => (
                        <div key={i} className="absolute w-full h-full bg-zinc-900 border border-zinc-700 shadow-xl"
                            style={{ top: i * 6, left: i * 6 }}>
                        </div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="flex flex-col items-center gap-4">
                            <FileText className="w-12 h-12 text-zinc-600" />
                            <span className="text-zinc-500 text-sm font-mono font-bold uppercase tracking-[0.2em]">64 Page Master</span>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex gap-8 h-full max-h-[80%] items-center py-4">
                {[
                    { label: 'SECTION I\npp. 1–20', color: 'border-emerald-500 text-emerald-500' },
                    { label: 'SECTION II\npp. 21–40', color: 'border-zinc-700 text-zinc-500' },
                    { label: 'SECTION III\npp. 41–64', color: 'border-zinc-700 text-zinc-500' },
                ].map((s, i) => (
                    <div key={i} className={cn("w-auto aspect-[3/4] h-full bg-zinc-900 border-2 flex flex-col items-center justify-center gap-6 p-8 shadow-2xl transition-all", s.color)}>
                        <Scissors className={cn("w-8 h-8", s.color.includes('emerald') ? 'text-emerald-500' : 'text-zinc-600')} />
                        <span className={cn("text-[10px] font-mono font-black text-center whitespace-pre uppercase tracking-widest", s.color)}>{s.label}</span>
                        <div className={cn("h-1 w-full rounded-full", s.color.includes('emerald') ? 'bg-emerald-500/20' : 'bg-zinc-800')} />
                    </div>
                ))}
            </div>
        )}
    </div>
));
PdfSplitProof.displayName = 'PdfSplitProof';

/** Media Converter */
const MediaConverterProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4">
        <Label text={type === 'before' ? 'Container: MP4' : 'Codec: AAC / MP3'} type={type} />
        <div className="flex flex-col items-center justify-center gap-12 h-full max-h-[85%] w-full max-w-lg">
            {type === 'before' ? (
                <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center gap-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cover bg-center opacity-20 grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800')" }} />
                    <Video className="w-16 h-16 text-zinc-500 relative z-10" />
                    <div className="relative z-10 text-center">
                        <span className="text-zinc-300 font-mono text-sm font-bold block uppercase tracking-widest">Global_Presentation_2026.mp4</span>
                        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2 block">AVC/H.264 · 245.2 MB</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                        <div className="w-1/3 h-full bg-zinc-600" />
                    </div>
                </div>
            ) : (
                <div className="w-full aspect-video bg-zinc-900 border border-emerald-500/30 flex flex-col items-center justify-center gap-8 shadow-[0_0_60px_rgba(16,185,129,0.1)] relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <span className="text-emerald-400 font-mono text-sm font-black block uppercase tracking-widest">Global_Presentation_2026.mp3</span>
                        <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2 block">LAME MP3 · 320 KBPS · 14.8 MB</span>
                    </div>
                    <div className="flex gap-2 items-end h-12">
                        {[4, 10, 6, 14, 8, 12, 5, 9, 7, 13, 6, 11, 4, 8, 10, 7].map((h, i) => (
                            <div key={i} className="w-1.5 bg-emerald-500 rounded-full transition-all duration-500" style={{ height: `${h * 3}px`, opacity: 0.3 + (h / 20) }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
));
MediaConverterProof.displayName = 'MediaConverterProof';

/** Sign Paper */
const SignProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4">
        <Label text={type === 'before' ? 'Empty Line' : 'Signed Document'} type={type} />
        <div className="flex flex-col items-center gap-4 w-full h-full max-h-[85%]">
            <div className="w-auto aspect-[3/4] h-full bg-white border border-zinc-200 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col p-8 sm:p-12 gap-6">
                <div className="h-2 w-full bg-zinc-100 rounded-full" />
                <div className="h-2 w-3/4 bg-zinc-100 rounded-full" />
                <div className="h-2 w-full bg-zinc-100 rounded-full" />
                <div className="h-2 w-full bg-zinc-100 rounded-full" />
                <div className="h-2 w-2/3 bg-zinc-100 rounded-full" />

                <div className="mt-auto pt-10 border-t-2 border-zinc-100">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Authorized Person:</span>
                            <div className="h-2 w-32 bg-zinc-50 rounded" />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Signature:</span>
                            <div className="h-2 w-32 bg-zinc-100 rounded" />
                            {type === 'after' && (
                                <div className="absolute -top-10 left-0 text-blue-900 font-serif italic text-3xl leading-none transform -rotate-12 filter drop-shadow-sm select-none pointer-events-none whitespace-nowrap">
                                    Alex J. Smith
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
));
SignProof.displayName = 'SignProof';

/** Stamp Photo */
const StampProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950 relative overflow-hidden group">
        <Label text={type === 'before' ? 'Original Asset' : 'Authenticated'} type={type} />
        <div className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-[20s] linear animate-slow-zoom" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1200')" }} />
        {type === 'after' && (
            <div className="absolute bottom-12 right-12 transition-all">
                <div className="border-[6px] border-emerald-500/30 p-8 rounded-[40px] backdrop-blur-xl bg-black/60 shadow-[0_0_80px_rgba(16,185,129,0.3)] border-double outline outline-1 outline-emerald-500/20 rotate-12">
                    <div className="flex flex-col items-center gap-3">
                        <Shield className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        <div className="text-center">
                            <span className="text-xl font-black tracking-tighter text-emerald-500 uppercase italic block leading-none">VaultNode Secure</span>
                            <span className="text-emerald-800 font-mono text-[10px] font-black uppercase tracking-[0.4em] block mt-1">Authenticity Stamped</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
));
StampProof.displayName = 'StampProof';

/** Repair File */
const RepairProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4 gap-12">
        <Label text={type === 'before' ? 'Broken Data' : 'Fixed File'} type={type} />
        <div className="flex flex-col items-center gap-6 h-full max-h-[85%] py-8">
            {type === 'before' ? (
                <div className="flex flex-col items-center gap-8 h-full justify-center">
                    <div className="w-48 h-48 border-4 border-red-500/20 flex items-center justify-center bg-red-950/10 rounded-full animate-pulse shadow-[0_0_70px_rgba(239,68,68,0.1)]">
                        <Code className="w-20 h-20 text-red-500/60" />
                    </div>
                    <div className="text-center space-y-2">
                        <span className="text-red-500 font-mono text-sm font-black uppercase tracking-[0.2em] block">Structural Integrity Failure</span>
                        <span className="text-red-900 font-mono text-[10px] uppercase font-bold tracking-[0.3em] block italic">Offset: 0x000FF421 · EOF Missing</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8 h-full justify-center">
                    <div className="w-48 h-48 border-4 border-emerald-500/40 flex items-center justify-center bg-emerald-950/10 rounded-full shadow-[0_0_80px_rgba(16,185,129,0.15)]">
                        <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                    </div>
                    <div className="text-center space-y-2">
                        <span className="text-emerald-400 font-mono text-sm font-black uppercase tracking-[0.2em] block">Object Stream Recovered</span>
                        <span className="text-emerald-900 font-mono text-[10px] uppercase font-bold tracking-[0.3em] block italic">Cross-Ref Table Rebuilt · 100% Fixed</span>
                    </div>
                </div>
            )}
        </div>
    </div>
));
RepairProof.displayName = 'RepairProof';

/** Number Pages */
const NumberPagesProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-4">
        <Label text={type === 'before' ? 'No Numbers' : 'Numbered Pages'} type={type} />
        <div className="flex gap-8 h-full max-h-[75%] items-center">
            {[1, 2, 3].map((i) => (
                <div key={i} className="w-auto aspect-[3/4] h-full bg-white border border-zinc-200 shadow-2xl relative flex flex-col p-6 gap-3 overflow-hidden">
                    <div className="h-2 w-full bg-zinc-50 rounded-full" />
                    <div className="h-2 w-5/6 bg-zinc-50 rounded-full" />
                    <div className="h-2 w-full bg-zinc-50 rounded-full" />
                    <div className="h-2 w-full bg-zinc-50 rounded-full" />
                    <div className="mt-auto h-2 w-full bg-zinc-50 rounded-full" />
                    <div className="h-2 w-1/2 bg-zinc-50 rounded-full" />
                    {type === 'after' && (
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <span className="bg-zinc-100 px-3 py-1 rounded text-zinc-500 font-mono text-[9px] font-black uppercase tracking-widest border border-zinc-200">
                                PAGE {i}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
));
NumberPagesProof.displayName = 'NumberPagesProof';

/** Organize Pages */
const OrganizePagesProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Label text={type === 'before' ? 'Jumbled' : 'Sorted'} type={type} />
        <div className="grid grid-cols-2 gap-6 h-full max-h-[85%] py-4">
            {(type === 'before' ? ['03', '01', '04', '02'] : ['01', '02', '03', '04']).map((n, i) => (
                <div key={i} className={cn(
                    "w-auto aspect-[3/4] h-full border-2 flex flex-col items-center justify-center gap-4 transition-all shadow-xl",
                    type === 'before' ? "bg-zinc-900 border-zinc-800" : "bg-emerald-950/10 border-emerald-500/20"
                )}>
                    <FileText className={cn("w-8 h-8", type === 'before' ? "text-zinc-700" : "text-emerald-500")} />
                    <span className={cn("font-mono text-xs font-black tracking-[0.2em]", type === 'before' ? "text-zinc-600" : "text-emerald-400")}>PAGE {n}</span>
                    <div className="flex flex-col gap-1 w-12">
                        <div className={cn("h-1 rounded-full", type === 'before' ? "bg-zinc-800" : "bg-emerald-500/20")} />
                        <div className={cn("h-1 rounded-full w-2/3", type === 'before' ? "bg-zinc-800" : "bg-emerald-500/20")} />
                    </div>
                </div>
            ))}
        </div>
    </div>
));
OrganizePagesProof.displayName = 'OrganizePagesProof';

const Label = memo(({ text, type }: { text: string; type: 'before' | 'after' }) => (
    <div className={cn(
        "absolute top-4 left-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10",
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

    const render = (type: 'before' | 'after') => {
        const beforeLabel = commonT('before') || 'Before';
        const afterLabel = commonT('after') || 'After';

        switch (toolId) {
            case 'redactor': return <RedactorProof type={type} />;
            case 'compress': return (
                <div className="w-full h-full bg-cover bg-center bg-no-repeat group" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1200')` }}>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <Label text={type === 'before' ? "Heavy: 18.5 MB" : "Modern: 1.2 MB"} type={type} />
                    <div className="absolute bottom-8 left-8">
                        <span className={cn("px-4 py-2 font-black uppercase tracking-[0.2em] text-[10px] border shadow-2xl",
                            type === 'before' ? "bg-white text-black border-white" : "bg-emerald-500 text-white border-emerald-400")}>
                            {type === 'before' ? "Lossy Padding" : "Advanced LZ-Optimized"}
                        </span>
                    </div>
                </div>
            );
            case 'clean-exif': return <CleanExifProof type={type} />;
            case 'blur': return <BlurProof type={type} />;
            case 'encrypt': return <EncryptProof type={type} />;
            case 'password': return <PasswordProof type={type} />;
            case 'merger': return <MergeProof type={type} />;
            case 'heic': return <HeicProof type={type} />;
            case 'unlock': return <UnlockProof type={type} />;
            case 'svg-to-png': return <SvgToPngProof type={type} />;
            case 'pdf-to-docx': return <PdfToDocxProof type={type} />;
            case 'pdf-to-img': return <PdfToImgProof type={type} />;
            case 'pdf-split': return <PdfSplitProof type={type} />;
            case 'media-converter': return <MediaConverterProof type={type} />;
            case 'sign': return <SignProof type={type} />;
            case 'stamp': return <StampProof type={type} />;
            case 'repair': return <RepairProof type={type} />;
            case 'number-pages': return <NumberPagesProof type={type} />;
            case 'organize-pages': return <OrganizePagesProof type={type} />;
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
            {/* Label */}
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">{wpT('label')}</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-white italic">
                {t(`${toolId.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}.after`)}
            </h3>

            {/* Full-width split */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-hidden">
                <div className="relative aspect-video bg-black overflow-hidden">
                    {render('before')}
                </div>
                <div className="relative aspect-video bg-black overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    {render('after')}
                </div>
            </div>

            {/* Footer badges */}
            <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-zinc-600">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Full Bit Integrity</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Zero Cloud Metadata</span>
                </div>
            </div>
        </div>
    );
});

VisualProof.displayName = 'VisualProof';
