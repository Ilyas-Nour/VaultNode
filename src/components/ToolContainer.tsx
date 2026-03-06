/**
 * ToolContainer — PrivaFlow Design System
 * Single layout shell for all 19 tool pages.
 *
 * Brand DNA:
 *  • Black background, white typography
 *  • Section labels: 10px bold uppercase tracking-[0.25em] zinc-600
 *  • Titles: font-black uppercase tracking-tight
 *  • Borders: border-white/[0.06] — consistent hairline throughout
 *  • No decorative badges, pulse dots, or spec grids
 */

"use client";

import React, { memo } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { VisualProof } from '@/components/VisualProof';
import AdUnit from '@/components/AdUnit';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

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
    hideAds?: boolean;
}

export const ToolContainer = memo(({
    title,
    description,
    icon: _Icon,
    category,
    children,
    settingsContent,
    howItWorks,
    toolId,
    hideAds = false
}: ToolContainerProps) => {
    const t = useTranslations('Tools.common');
    const tc = useTranslations('HomePage.categories');

    return (
        <div className="w-full flex flex-col bg-black">
            <div className="w-full flex items-start">

                {/* Left ad */}
                {!hideAds && (
                    <aside className="hidden xl:flex w-[160px] shrink-0 sticky top-20 self-start pt-14 flex-col items-center">
                        <AdUnit type="skyscraper" className="w-[140px] h-[500px]" />
                    </aside>
                )}

                {/* Main content */}
                <main className="flex-1 min-w-0 flex flex-col">

                    {/* ── PAGE HEADER ── */}
                    <div className="w-full px-5 sm:px-6 lg:px-12 pt-6 pb-8 border-b border-white/[0.06]">

                        {/* Back link */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            {t('backToHome')}
                        </Link>

                        {/* Category label */}
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-600 mb-3">
                            {tc(category)}
                        </p>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[0.9] mb-4">
                            {title}
                        </h1>

                        {/* Description */}
                        <p className="text-[15px] text-zinc-500 leading-relaxed max-w-lg">
                            {description}
                        </p>
                    </div>

                    {/* ── WORK AREA ── */}
                    <div className="w-full px-5 sm:px-6 lg:px-12 py-8 border-b border-white/[0.06]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                            {/* LEFT: drop zone / canvas */}
                            <div className="w-full">
                                {children}
                            </div>

                            {/* RIGHT: settings + how it works */}
                            <div className="space-y-8">

                                {/* Settings panel */}
                                {settingsContent && (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-600">
                                            {t('settings')}
                                        </p>
                                        {settingsContent}
                                    </div>
                                )}

                                {/* How It Works */}
                                {howItWorks && (
                                    <div className="pt-6 border-t border-white/[0.06] space-y-6">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-600">
                                            {t('howItWorks')}
                                        </p>
                                        <div className="space-y-6">
                                            {howItWorks.map((step, i) => (
                                                <div key={i} className="flex gap-5">
                                                    {/* Step number */}
                                                    <span className="text-[11px] font-black text-white/20 tabular-nums leading-none shrink-0 w-5 pt-0.5">
                                                        {String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    <div>
                                                        <h4 className="text-[13px] font-black uppercase tracking-[0.12em] text-white mb-1">
                                                            {step.title}
                                                        </h4>
                                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Single-line privacy note — replaces the old busy spec grid */}
                                <div className="pt-6 border-t border-white/[0.06]">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-700">
                                        100% Local · Zero Upload · Private by Design
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile ad */}
                    {!hideAds && (
                        <div className="xl:hidden w-full px-5 sm:px-6 py-4 border-b border-white/[0.06] flex justify-center">
                            <AdUnit type="banner-slim" className="w-full max-w-[468px]" />
                        </div>
                    )}

                    {/* Visual Proof */}
                    {toolId && (
                        <div className="w-full px-5 sm:px-6 lg:px-12 py-12 lg:py-16 border-b border-white/[0.06]">
                            <VisualProof toolId={toolId} mode="full" />
                        </div>
                    )}

                </main>

                {/* Right ad */}
                {!hideAds && (
                    <aside className="hidden xl:flex w-[160px] shrink-0 sticky top-20 self-start pt-14 flex-col items-center">
                        <AdUnit type="skyscraper" className="w-[140px] h-[500px]" />
                    </aside>
                )}

            </div>
        </div>
    );
});

ToolContainer.displayName = 'ToolContainer';
