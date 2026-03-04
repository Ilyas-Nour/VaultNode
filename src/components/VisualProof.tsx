/**
 * 🎨 PRIVAFLOW | Visual Proof System
 * ---------------------------------------------------------
 * A high-fidelity visualization engine that demonstrates
 * "Before vs After" states for privacy tools.
 * 
 * Performance: Optimized (Memoized sub-components)
 * Aesthetics: Premium / Ultra-Clean
 */

"use client";

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Lock,
    Unlock,
    Shield,
    FileText,
    Image as ImageIcon,
    ArrowRight,
    MapPin,
    Calendar,
    Eye,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

// --- SUB-COMPONENTS (Memoized for Speed) ---

/**
 * 📄 Document Markup Sub-renderer
 */
const RedactorProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="relative w-full h-full bg-white rounded-lg p-6 shadow-sm flex flex-col gap-4 overflow-hidden">
        <div className="space-y-3">
            <div className="h-3 w-3/4 bg-zinc-100 rounded" />
            <div className="h-3 w-full bg-zinc-100 rounded" />
            <div className="relative group/text">
                <div className="h-3 w-1/2 bg-zinc-100 rounded" />
                <span className={cn(
                    "absolute top-0 left-0 h-3 bg-emerald-500/20 px-2 text-[8px] font-black text-emerald-950 rounded flex items-center transition-all duration-700",
                    type === 'after' && "bg-black opacity-100 w-full text-transparent"
                )}>
                    {type === 'before' ? "NAME: JOHN DOE" : ""}
                </span>
            </div>
            <div className="h-3 w-full bg-zinc-100 rounded" />
            <div className="relative">
                <div className="h-3 w-2/3 bg-zinc-100 rounded" />
                <span className={cn(
                    "absolute top-0 left-0 h-3 bg-emerald-500/20 px-2 text-[8px] font-black text-emerald-950 rounded flex items-center transition-all duration-700 delay-100",
                    type === 'after' && "bg-black opacity-100 w-3/4 text-transparent"
                )}>
                    {type === 'before' ? "PHONE: 555-0199" : ""}
                </span>
            </div>
        </div>
        <div className="mt-auto flex justify-between items-center">
            <div className="w-10 h-12 bg-zinc-50 border border-zinc-100 rounded flex items-center justify-center text-[12px] font-black text-zinc-300">ID</div>
            <div className="w-16 h-4 bg-zinc-100 rounded" />
        </div>
    </div>
));
RedactorProof.displayName = 'RedactorProof';

/**
 * 🖼️ Image Transformation Sub-renderer
 */
const ImageProof = memo(({ type, url, beforeLabel, afterLabel }: { type: 'before' | 'after', url: string, beforeLabel: string, afterLabel: string }) => (
    <div className="relative w-full h-full rounded-lg overflow-hidden group/photo">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${url}')` }} />
        <div className="absolute inset-0 bg-black/20" />
        <div className={cn(
            "absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md border font-black text-[10px] uppercase tracking-widest transition-all duration-700",
            type === 'before' ? "bg-red-500/20 border-red-500/40 text-red-100" : "bg-emerald-500/20 border-emerald-500/40 text-emerald-100 scale-110"
        )}>
            {type === 'before' ? beforeLabel : afterLabel}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <ImageIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-[8px] font-black text-white uppercase tracking-tighter shadow-sm">
                {type === 'after' ? "100% QUALITY KEPT" : "UNOPTIMIZED RAW"}
            </span>
        </div>
    </div>
));
ImageProof.displayName = 'ImageProof';

/**
 * 🔐 Security Unlock Sub-renderer
 */
const UnlockProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="relative w-full h-full bg-white rounded-lg p-4 shadow-sm flex flex-col gap-3 overflow-hidden">
        <div className={cn("space-y-3 transition-all duration-1000", type === 'before' && "blur-[6px] opacity-40")}>
            <div className="h-3 w-1/4 bg-zinc-200 rounded" />
            <div className="space-y-2">
                <div className="h-2 w-full bg-zinc-100 rounded" />
                <div className="h-2 w-full bg-zinc-100 rounded" />
                <div className="h-2 w-3/4 bg-zinc-100 rounded" />
            </div>
            <div className="h-20 w-full bg-zinc-50 border border-zinc-100 rounded-xl" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
                "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-2xl",
                type === 'before' ? "bg-red-500 text-white rotate-0" : "bg-emerald-500 text-emerald-950 scale-0 opacity-0 -rotate-12"
            )}>
                <Lock className="w-8 h-8" />
            </div>
            {type === 'after' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center text-emerald-950 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                >
                    <Unlock className="w-8 h-8" />
                </motion.div>
            )}
        </div>
    </div>
));
UnlockProof.displayName = 'UnlockProof';

// --- MAIN COMPONENT ---

interface VisualProofProps {
    toolId: string;
    mode?: 'card' | 'full';
    className?: string;
}

/**
 * 💎 VisualProof Engine
 * Orchestrates all demo visualizations.
 */
export const VisualProof = memo(({ toolId, mode = 'card', className }: VisualProofProps) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    /**
     * Component mapping for extreme performance.
     * Prevents logic recreation on re-renders.
     */
    const content = useMemo(() => {
        const render = (type: 'before' | 'after') => {
            switch (toolId) {
                case 'redactor':
                    return <RedactorProof type={type} />;

                case 'compress':
                    return (
                        <ImageProof
                            type={type}
                            url="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=400"
                            beforeLabel="HEAVY: 12.5 MB"
                            afterLabel="OPTIMIZED: 0.8 MB"
                        />
                    );

                case 'unlock':
                    return <UnlockProof type={type} />;

                case 'clean-exif':
                    return (
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center" />
                            <div className="absolute top-4 left-4 space-y-2">
                                {[
                                    { icon: MapPin, text: "40.7128° N", color: "bg-red-500" },
                                    { icon: Calendar, text: "MARCH 12, 2024", color: "bg-blue-500" },
                                    { icon: ImageIcon, text: "IPHONE 15 PRO", color: "bg-zinc-500" }
                                ].map((tag, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex items-center gap-2 px-2 py-1 rounded-md backdrop-blur-md border border-white/20 text-[6px] font-black text-white transition-all duration-700",
                                            type === 'after' && "scale-0 opacity-0 translate-x-[-20px]"
                                        )}
                                        style={{ transitionDelay: `${i * 100}ms` }}
                                    >
                                        <tag.icon className="w-2 h-2 opacity-50" />
                                        {tag.text}
                                    </div>
                                ))}
                            </div>
                            <div className={cn(
                                "absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center transition-all duration-1000",
                                type === 'after' ? "opacity-100" : "opacity-0"
                            )}>
                                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                                    <Shield className="w-6 h-6 text-emerald-950 fill-emerald-950/20" />
                                </div>
                                <span className="mt-2 text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-zinc-950/80 px-4 py-1 rounded-full">
                                    Identity Cleared
                                </span>
                            </div>
                        </div>
                    );

                case 'merger':
                case 'pdf-split':
                    return (
                        <div className="relative w-full h-full bg-zinc-950 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                            <div className="flex gap-1 relative">
                                {[1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={toolId === 'merger' && type === 'after' ? {
                                            x: isRTL ? (i - 2) * 2 : (2 - i) * 2,
                                            y: (i - 2) * 4,
                                            scale: 1.05
                                        } : {}}
                                        className={cn(
                                            "w-12 h-16 bg-white rounded border border-zinc-200 shadow-lg flex flex-col p-2 gap-1",
                                            i === 2 ? "z-20" : "z-10 opacity-60",
                                            toolId === 'pdf-split' && type === 'after' && i !== 2 && "opacity-0 scale-50 transition-all duration-700"
                                        )}
                                    >
                                        <div className="h-1 w-full bg-zinc-100 rounded" />
                                        <div className="h-4 w-full bg-zinc-50 rounded" />
                                        <div className="mt-auto flex justify-end">
                                            <div className="w-2 h-2 rounded-full bg-purple-500/20 flex items-center justify-center text-[5px] font-bold text-purple-700">{i}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {toolId === 'merger' && type === 'after' && (
                                <div className="absolute inset-0 bg-purple-500/5 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                                    <Shield className="w-8 h-8 text-purple-500/20" />
                                </div>
                            )}
                        </div>
                    );

                case 'media-converter':
                case 'heic':
                case 'svg-to-png':
                    return (
                        <div className="relative w-full h-full bg-zinc-900 rounded-lg flex flex-col items-center justify-center p-4">
                            <div className="relative">
                                <div className={cn(
                                    "w-20 h-20 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center shadow-2xl transition-all duration-700",
                                    type === 'after' && "border-emerald-500/50 bg-emerald-500/5 scale-110"
                                )}>
                                    <div className="text-[14px] font-black italic tracking-tighter text-zinc-500 mb-2">
                                        {toolId === 'heic' ? "HEIC" : toolId === 'svg-to-png' ? "SVG" : "MP4"}
                                    </div>
                                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
                                    {type === 'after' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 text-[14px] font-black text-emerald-500 bg-emerald-500/20 px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                        >
                                            {toolId === 'heic' ? "JPG" : toolId === 'svg-to-png' ? "PNG" : "WEBM"}
                                        </motion.div>
                                    )}
                                </div>
                                <div className={cn(
                                    "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700",
                                    type === 'before' ? "bg-zinc-800 text-zinc-600" : "bg-emerald-500 text-emerald-950 shadow-lg scale-110 rotate-12"
                                )}>
                                    {type === 'before' ? <RefreshCw className="w-4 h-4 animate-spin-slow" /> : <Shield className="w-4 h-4" />}
                                </div>
                            </div>
                        </div>
                    );

                case 'password':
                case 'encrypt':
                    return (
                        <div className="relative w-full h-full bg-zinc-900 rounded-[1.5rem] p-6 flex flex-col justify-center border border-zinc-800 shadow-2xl overflow-hidden group/card">
                            <div className="relative space-y-4">
                                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-inner",
                                            type === 'before' ? "bg-zinc-950 text-zinc-600" : "bg-emerald-500/10 text-emerald-500"
                                        )}>
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                            {toolId === 'password' ? "Vault Key" : "Secure Node"}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                        type === 'before' ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    )}>
                                        {type === 'before' ? "Vulnerable" : "Shielded"}
                                    </div>
                                </div>
                                <div className="py-2">
                                    <div className={cn(
                                        "text-xl md:text-2xl font-mono break-all leading-tight transition-all duration-700 tracking-tighter",
                                        type === 'before' ? "text-zinc-600 italic" : "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                    )}>
                                        {type === 'before'
                                            ? (toolId === 'password' ? "weak_pass_123" : "Private Message")
                                            : (toolId === 'password' ? "Xk29!p_#$L9m" : "A8*kL9#mP0q-Z1x8v3n4m7L9pQ==")}
                                    </div>
                                </div>
                                {type === 'after' && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        className="h-1 bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    />
                                )}
                            </div>
                        </div>
                    );

                default:
                    return (
                        <div className="w-full h-full bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
                            <FileText className="w-8 h-8 text-zinc-700" />
                        </div>
                    );
            }
        };

        return {
            before: render('before'),
            after: render('after')
        };
    }, [toolId, isRTL]);

    return (
        <div className={cn(
            "relative w-full",
            mode === 'card' ? "h-48" : "h-auto",
            className
        )}>
            <div className={cn(
                "grid h-full",
                mode === 'card' ? "grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20"
            )}>
                {/* ⏮️ BEFORE CONTAINER */}
                <div className="relative group/before flex flex-col">
                    {mode === 'full' && (
                        <div className="flex items-center gap-3 px-2 mb-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
                            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-600">BEFORE</h4>
                        </div>
                    )}
                    <div className={cn(
                        "flex-1 aspect-video bg-zinc-950 flex shadow-2xl relative overflow-hidden ring-1 ring-zinc-800 rounded-[2.5rem] transition-all duration-500 group-hover/before:ring-zinc-700",
                    )}>
                        {mode !== 'full' && (
                            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-zinc-950/80 text-[8px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-800">
                                Before
                            </div>
                        )}
                        <div className="h-full w-full p-6">
                            {content.before}
                        </div>
                    </div>
                </div>

                {/* ⏭️ AFTER CONTAINER */}
                <div className="relative group/after flex flex-col">
                    {mode === 'full' && (
                        <div className="flex items-center gap-3 px-2 mb-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-emerald-500">AFTER</h4>
                        </div>
                    )}
                    <div className={cn(
                        "flex-1 aspect-video bg-zinc-950 flex shadow-2xl relative overflow-hidden ring-1 ring-emerald-500/30 rounded-[2.5rem] transition-all duration-500 group-hover/after:ring-emerald-500/50",
                    )}>
                        {mode !== 'full' && (
                            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/30">
                                After
                            </div>
                        )}
                        <div className="h-full w-full p-6">
                            {content.after}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-1/2 w-full animate-scan pointer-events-none" />
                        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Security</span>
                        </div>
                    </div>
                </div>

                {mode === 'card' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                        <div className={cn(
                            "w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)] border-4 border-zinc-950 transition-transform group-hover:scale-110",
                            isRTL && "rotate-180"
                        )}>
                            <ArrowRight className="w-6 h-6 text-emerald-950" />
                        </div>
                    </div>
                )}
            </div>

            {/* 🏷️ FOOTER MARKER */}
            {mode === 'full' && (
                <div className="text-center mt-12 space-y-4">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-emerald-500">Live Magic Demo</span>
                    </div>
                    <p className="text-zinc-500 text-lg font-bold max-w-2xl mx-auto leading-relaxed">
                        Real-world transformation visualization. All processing remains on your device.
                    </p>
                </div>
            )}
        </div>
    );
});

VisualProof.displayName = 'VisualProof';
