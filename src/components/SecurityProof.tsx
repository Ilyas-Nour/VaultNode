"use client";

import React, { memo } from 'react';
import { Lock, Shield, EyeOff, Github, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface SecurityProofProps {
    className?: string;
    compact?: boolean;
}

export const SecurityProof = memo(({ className, compact = false }: SecurityProofProps) => {
    const t = useTranslations('SecurityProof');

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
        <section className={cn("w-full py-16 px-5 sm:px-6 lg:px-12 bg-black", className)}>
            <div className="max-w-6xl mx-auto border border-white/[0.04] hover:border-emerald-500/10 bg-zinc-950/20 p-8 lg:p-14 relative group/box transition-colors">
                {/* Emerald corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/20 group-hover/box:border-emerald-500/40 transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/20 group-hover/box:border-emerald-500/40 transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500/20 group-hover/box:border-emerald-500/40 transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/20 group-hover/box:border-emerald-500/40 transition-colors" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left: Icons row/grid */}
                    <div className="grid grid-cols-2 gap-px bg-white/[0.04] border border-white/[0.04] self-stretch">
                        {badges.map((badge, i) => (
                            <div key={i} className="bg-black p-8 lg:p-10 flex flex-col items-center text-center gap-4 group/badge">
                                <badge.icon className="w-7 h-7 text-zinc-700 group-hover/badge:text-emerald-500/60 group-hover/badge:scale-110 transition-all duration-300" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 group-hover/badge:text-emerald-400/80 transition-colors leading-relaxed px-2">
                                    {badge.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Right: Messaging */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 group-hover/box:text-emerald-600/40 transition-colors">
                                {t('systemTag')}
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-none">
                                {t('trustStatement')}
                            </h2>
                        </div>

                        <p className="text-lg text-zinc-500 leading-relaxed font-medium">
                            {t('trustExplanation')}
                        </p>

                        <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                            <Link
                                href="/privacy-report"
                                className="inline-flex items-center gap-2.5 group/link text-[11px] font-black uppercase tracking-[0.25em] text-white hover:text-emerald-400 transition-colors"
                            >
                                {t('viewReport')}
                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform" />
                            </Link>

                            <a
                                href="https://github.com/Ilyas-Nour/PrivaFlow"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-700 hover:text-white transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

SecurityProof.displayName = 'SecurityProof';
