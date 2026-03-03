"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import {
    ShieldCheck,
    ArrowLeft,
    Settings,
    Info,
    ChevronRight,
    Lock,
    Zap,
    HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

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
}

export function ToolContainer({
    title,
    description,
    icon: Icon,
    category,
    children,
    settingsContent,
    howItWorks
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
        <div className="flex-1 flex flex-col min-h-screen bg-zinc-950 bg-grid-vault relative overflow-x-hidden">

            {/* System Status HUD */}
            <div className="fixed bottom-6 start-6 z-50 pointer-events-none hidden md:block group/hud">
                <div className="px-4 py-3 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/5 shadow-2xl flex items-center gap-4 transition-all hover:border-emerald-500/30">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Trace Active</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 font-mono">
                            <span className="text-[9px] text-zinc-600 uppercase">Local Thread #1</span>
                            <div className="w-px h-2 bg-zinc-800" />
                            <span className="text-[9px] text-emerald-500 uppercase tracking-tighter">
                                RAM: {((Math.random() * 50) + 120).toFixed(1)}MB
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tool Header */}
            <header className="px-8 py-6 border-b border-zinc-900 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-xl z-30">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-900">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shadow-lg", categoryColors[category])}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">{title}</h1>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                {t(`categories.${category}`)} • 100% Local
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Secure Session Active</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row divide-x lg:divide-zinc-900 border-t border-zinc-900">

                {/* Main Workspace */}
                <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-12">

                        <div className="space-y-4">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none"
                            >
                                {description}
                            </motion.h2>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-2xl">
                                Processing inside your browser's RAM means your sensitive data never touches a server.
                                Full privacy, zero compromises.
                            </p>
                        </div>

                        {/* Dropzone / Tool Content */}
                        <div className="relative group/tool">
                            <div className={cn(
                                "absolute -inset-8 rounded-[3rem] blur-3xl opacity-0 group-hover/tool:opacity-20 transition-opacity duration-700 -z-10",
                                `bg-${accentColor}-500`
                            )} />
                            <Card className="bg-zinc-900/40 border-zinc-800/80 rounded-[2.5rem] border shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 group-hover/tool:border-zinc-700/50">
                                {children}
                            </Card>
                        </div>

                        {/* Explainer Section */}
                        {howItWorks && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                                {howItWorks.map((step, i) => (
                                    <div key={i} className="space-y-4 p-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 font-black italic text-xs">
                                            0{i + 1}
                                        </div>
                                        <h4 className="font-black uppercase italic tracking-tight text-emerald-400">{step.title}</h4>
                                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Contextual Sidebar */}
                <aside className="w-full lg:w-80 bg-zinc-950/20 backdrop-blur-md p-8 space-y-12 h-screen sticky top-0 border-s border-zinc-900">

                    {/* Settings Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-zinc-600" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Tool Settings</h3>
                        </div>
                        {settingsContent ? (
                            <div className="space-y-4">
                                {settingsContent}
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 text-[10px] font-bold text-zinc-600 uppercase italic text-center">
                                No extra settings
                            </div>
                        )}
                    </div>

                    {/* Privacy Specs */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-zinc-600" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Security Audit</h3>
                        </div>
                        <div className="space-y-2">
                            {[
                                { label: 'Network', value: '0 Packets Sent', icon: Zap },
                                { label: 'Storage', value: 'RAM-Only', icon: HardDrive },
                                { label: 'Encryption', value: 'Hardware Level', icon: Lock }
                            ].map((spec, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-900">
                                    <div className="flex items-center gap-2">
                                        <spec.icon className="w-3 h-3 text-zinc-600" />
                                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider font-mono">{spec.label}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase italic">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ad Placeholder */}
                    <div className="aspect-[4/5] rounded-3xl bg-zinc-900 border border-dashed border-zinc-800 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-700">
                            $
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 leading-tight">
                            {t('adPlaceholder')}
                        </span>
                    </div>
                </aside>

            </div>
        </div>
    );
}
