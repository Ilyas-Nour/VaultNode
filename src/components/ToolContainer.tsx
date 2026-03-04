"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import {
    ShieldCheck,
    ArrowLeft,
    Settings,
    Lock,
    Zap,
    HardDrive,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { VisualProof } from '@/components/VisualProof';
import AdUnit from '@/components/AdUnit';

interface ToolContainerProps {
    title: string;
    description: string;
    icon: React.ElementType;
    category: 'vault' | 'media' | 'docs';
    children: React.ReactNode;
    settingsContent?: React.ReactNode;
    howItWorks?: {
        title: string;
        description: string;
    }[];
    toolId?: string;
}

export function ToolContainer({
    title,
    description,
    icon: Icon,
    category,
    children,
    settingsContent,
    howItWorks,
    toolId
}: ToolContainerProps) {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const categoryColors = {
        vault: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
        media: 'text-sky-500 bg-sky-500/10 border-sky-500/20 shadow-sky-500/10',
        docs: 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10'
    };

    const accentColor = {
        vault: 'emerald',
        media: 'sky',
        docs: 'purple'
    }[category];

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-zinc-950 bg-grid-vault relative overflow-x-hidden pt-18">

            {/* System Status HUD - Hidden on small mobile */}
            <div className="fixed bottom-6 start-6 z-50 pointer-events-none hidden lg:block group/hud">
                <div className="px-4 py-3 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/5 shadow-2xl flex items-center gap-4 transition-all hover:border-emerald-500/30">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Working Privately</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 font-mono">
                            <span className="text-[9px] text-zinc-600 uppercase">Secure Tool #1</span>
                            <div className="w-px h-2 bg-zinc-800" />
                            <span className="text-[9px] text-emerald-500 uppercase tracking-tighter">
                                Safe Memory: Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tool Header */}
            <header className="px-6 lg:px-8 py-4 lg:py-6 border-b border-zinc-900 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-xl z-30">
                <div className="flex items-center gap-4 lg:gap-6">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all">
                            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className={cn("w-8 h-8 lg:w-10 lg:h-10 rounded-xl border flex items-center justify-center shadow-lg transition-transform hover:scale-105", categoryColors[category])}>
                            <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                        </div>
                        <div>
                            <h1 className="text-base lg:text-xl font-black uppercase italic tracking-tighter leading-none">{title}</h1>
                            <p className="hidden xs:block text-[8px] lg:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5 lg:mt-1">
                                {t(`categories.${category}`)} • {t('localOnly')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-500">Secure</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-12 relative flex flex-col items-center">
                {/* 100% Width Container */}
                <div className="w-full relative flex flex-col gap-12 lg:gap-24 items-center">

                    <div className="flex-1 w-full max-w-[1600px] flex flex-col gap-12 lg:gap-24 relative">

                        {/* Top Banner Ad - Primary Monitization */}
                        <div className="w-full flex justify-center">
                            <AdUnit type="banner-slim" className="max-w-5xl" />
                        </div>

                        {/* Intro & Transformation Hero */}
                        <div className="space-y-6 lg:space-y-12 w-full">
                            <div className="space-y-4 text-center">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none"
                                >
                                    {description}
                                </motion.h2>
                                <p className="text-zinc-500 text-xs lg:text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
                                    {t('subtitle')}
                                </p>
                            </div>

                            {/* BIG VISUAL PROOF - Now at the Top for Instant Understanding */}
                            {toolId && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative group/proof w-full"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 blur-2xl opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-1 rounded-[3rem] bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-2xl overflow-hidden backdrop-blur-3xl">
                                        <div className="bg-zinc-950/80 rounded-[2.8rem] p-6 lg:p-12">
                                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 lg:mb-12 border-b border-zinc-900/50 pb-8 lg:pb-12">
                                                <div className="text-center lg:text-left">
                                                    <h3 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter">
                                                        Seeing is <span className="text-emerald-500">Believing</span>
                                                    </h3>
                                                    <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mt-2">{t('visualProof.desc')}</p>
                                                </div>
                                                <div className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-950 rounded-xl">
                                                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                                        <span className="text-[10px] font-black uppercase text-zinc-500">Before</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-zinc-700" />
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-xl">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-[10px] font-black uppercase text-emerald-500">After</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <VisualProof toolId={toolId} mode="full" />
                                        </div>
                                    </div>
                                </motion.section>
                            )}
                        </div>

                        {/* THE TOOL WORKSPACE - Clean & Massive */}
                        <section className="space-y-12 w-full">
                            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                                <div className="w-16 h-px bg-zinc-800 hidden lg:block" />
                                <h3 className="text-lg font-black uppercase italic tracking-widest text-zinc-500">Launch Tool Interface</h3>
                            </div>
                            <div className="relative group/tool">
                                <div className={cn(
                                    "absolute -inset-10 rounded-[4rem] blur-[120px] opacity-0 group-hover/tool:opacity-30 transition-opacity duration-1000 -z-10",
                                    `bg-${accentColor}-500/20`
                                )} />
                                <Card className="bg-zinc-900 border-zinc-800/80 rounded-[3rem] border shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-3xl transition-all duration-700 group-hover/tool:border-zinc-700/50">
                                    {children}
                                </Card>
                            </div>
                        </section>

                        {/* SUPPORTING INFO - Simplified & Secondary */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-24">
                            <div className="lg:col-span-8 space-y-12 lg:space-y-24">
                                {settingsContent && (
                                    <section className="space-y-8">
                                        <h3 className="text-sm font-black uppercase italic tracking-widest text-zinc-600 flex items-center gap-3">
                                            <Settings className="w-4 h-4 text-zinc-700" /> {t('settings.title')}
                                        </h3>
                                        <div className="p-8 lg:p-16 rounded-[3rem] bg-zinc-900/30 border border-zinc-900/50 backdrop-blur-xl">
                                            {settingsContent}
                                        </div>
                                    </section>
                                )}

                                {howItWorks && (
                                    <section className="space-y-10">
                                        <h3 className="text-sm font-black uppercase italic tracking-widest text-zinc-600 flex items-center gap-3">
                                            <Sparkles className="w-4 h-4 text-zinc-700" /> {t('howItWorks.title')}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {howItWorks.map((step, i) => (
                                                <div key={i} className="group p-8 bg-zinc-900/20 border border-zinc-900/80 rounded-[2rem] hover:border-emerald-500/30 transition-all flex flex-col gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-[12px] font-black text-emerald-500/50">0{i + 1}</div>
                                                    <div>
                                                        <h4 className="text-sm font-black uppercase tracking-wider text-zinc-300 mb-2">{step.title}</h4>
                                                        <p className="text-[11px] text-zinc-500 leading-relaxed font-bold">{step.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
                                <section className="space-y-8 p-10 lg:p-12 rounded-[3rem] bg-emerald-500/[0.02] border border-emerald-500/10 backdrop-blur-md">
                                    <h3 className="text-sm font-black uppercase italic tracking-widest text-emerald-500/60 flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4" /> Safety Protocol
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { label: 'Network', value: 'Local-Only', icon: Zap },
                                                { label: 'Storage', value: 'In-RAM Only', icon: HardDrive },
                                                { label: 'Privacy', value: 'Zero Uploads', icon: Lock }
                                            ].map((spec, i) => (
                                                <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-950 border border-zinc-900/50 transition-colors hover:border-emerald-500/10">
                                                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
                                                        <spec.icon className="w-6 h-6 text-zinc-700" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest font-mono">{spec.label}</span>
                                                        <span className="text-[11px] font-black text-emerald-500 uppercase">{spec.value}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-zinc-500 font-bold leading-relaxed text-center italic">
                                            "Everything you do stays inside your own screen."
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
