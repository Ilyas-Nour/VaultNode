"use client";

import React, { memo, useState } from 'react';
import { Lock, Shield, EyeOff, Github, ArrowRight, Activity, Terminal, Check, Globe, Cpu, Database } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityProofProps {
    className?: string;
    compact?: boolean;
}

export const SecurityProof = memo(({ className, compact = false }: SecurityProofProps) => {
    const t = useTranslations('SecurityProof');
    const [showAudit, setShowAudit] = useState(false);

    const badges = [
        { icon: Lock, label: t('ssl') },
        { icon: Shield, label: t('local') },
        { icon: EyeOff, label: t('noTracking') },
        { icon: Github, label: t('openSource') },
    ];

    if (compact) {
        return (
            <div className={cn("grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-4", className)}>
                {badges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-zinc-600 hover:text-emerald-500/60 transition-colors group">
                        <badge.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{badge.label}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <section className={cn("w-full py-12 sm:py-24 px-5 sm:px-6 lg:px-12 bg-black relative overflow-hidden", className)}>
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
            </div>

            <div className="max-w-6xl mx-auto border border-white/[0.04] bg-zinc-950/20 relative group/box transition-all duration-700">
                {/* Emerald corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-emerald-500/20 group-hover/box:border-emerald-500/40 transition-colors" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-emerald-500/20 group-hover/box:border-emerald-500/40 transition-colors" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-emerald-500/20 group-hover/box:border-emerald-500/40 transition-colors" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-emerald-500/20 group-hover/box:border-emerald-500/40 transition-colors" />

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left Panel: Dynamic Interaction */}
                    <div className="relative min-h-[400px] border-b lg:border-b-0 lg:border-r border-white/[0.04] bg-zinc-950/40 p-8 lg:p-12 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {!showAudit ? (
                                <motion.div
                                    key="main"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full flex flex-col justify-center gap-12"
                                >
                                    <div className="grid grid-cols-2 gap-8">
                                        {badges.map((badge, i) => (
                                            <div key={i} className="flex flex-col gap-4 group/badge">
                                                <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center group-hover/badge:border-emerald-500/30 group-hover/badge:bg-emerald-500/5 transition-all duration-500">
                                                    <badge.icon className="w-5 h-5 text-zinc-600 group-hover/badge:text-emerald-400 transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover/badge:text-zinc-300 transition-colors">
                                                    {badge.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Small Technical Stat Overlay */}
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Security Stack active</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <Cpu className="w-3 h-3 text-white" />
                                                <span className="text-[9px] font-bold text-white">WASM</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <Globe className="w-3 h-3 text-white" />
                                                <span className="text-[9px] font-bold text-white">WEB_CRYPTO</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <Database className="w-3 h-3 text-white" />
                                                <span className="text-[9px] font-bold text-white">LOC_SYNC</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="audit"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <Terminal className="w-5 h-5 text-emerald-500" />
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                                            Network Integrity Audit
                                        </h3>
                                    </div>

                                    {/* Mock Network Log */}
                                    <div className="flex-1 bg-black/40 border border-white/[0.04] p-4 font-mono text-[10px] space-y-3 overflow-hidden">
                                        <div className="flex justify-between items-center text-zinc-600 border-b border-white/[0.04] pb-2 mb-2">
                                            <span>METHOD / TARGET</span>
                                            <span>STATUS</span>
                                        </div>
                                        <div className="flex justify-between opacity-40">
                                            <span className="text-emerald-500">GET /_next/static/wasm/...</span>
                                            <span className="text-zinc-500 italic">local_buffer</span>
                                        </div>
                                        <div className="flex justify-between opacity-40">
                                            <span className="text-emerald-500">GET /_next/chunks/ffmpeg...</span>
                                            <span className="text-zinc-500 italic">local_buffer</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                            <span className="text-zinc-400">POST /api/files/upload</span>
                                            <span className="text-red-900 bg-red-900/10 px-1 italic line-through decoration-emerald-500">BLOCKED_BY_ARCH</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/[0.04] text-emerald-500/60 leading-relaxed">
                                            {"> [SUCCESS] 0 Bytes sent to cloud"}<br />
                                            {"> [SUCCESS] Internal Processing Loop Active"}<br />
                                            {"> [SUCCESS] Device Isolation: 100%"}
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-zinc-900/50 rounded-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-emerald-500" />
                                            </div>
                                            <p className="text-[11px] text-zinc-400 leading-normal font-medium italic">
                                                All tools are technically incapable of sending data. The code runs entirely inside your RAM.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Panel: Content */}
                    <div className="p-8 lg:p-16 flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600/60">
                                {t('systemTag')}
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-[0.9]">
                                {showAudit ? t('auditTitle') : t('trustStatement')}
                            </h2>
                        </div>

                        <p className="text-lg text-zinc-500 leading-relaxed font-medium">
                            {showAudit ? t('auditDesc') : t('trustExplanation')}
                        </p>

                        {!showAudit ? (
                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-center justify-center lg:justify-start pt-8 border-t border-white/[0.04]">
                                <button
                                    onClick={() => setShowAudit(true)}
                                    className="group/btn relative px-6 py-3 bg-white text-black text-[12px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors"
                                >
                                    Technical Verification
                                </button>
                                <Link
                                    href="/privacy-report"
                                    className="inline-flex items-center gap-2.5 group/link text-[11px] font-black uppercase tracking-[0.25em] text-white hover:text-emerald-400 transition-colors"
                                >
                                    {t('viewReport')}
                                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6 pt-8 border-t border-white/[0.04]">
                                {[t('stepNetwork'), t('stepProcess'), t('stepResult')].map((step, i) => (
                                    <div key={i} className="flex gap-4 items-center group/step">
                                        <span className="text-[10px] font-black tabular-nums text-zinc-800 group-hover/step:text-emerald-500 transition-colors">
                                            0{i + 1}
                                        </span>
                                        <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-tight leading-tight">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setShowAudit(false)}
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors pt-4 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
                                >
                                    <ArrowRight className="w-3 h-3 rotate-180" />
                                    {t('backToOverview')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
});

SecurityProof.displayName = 'SecurityProof';
