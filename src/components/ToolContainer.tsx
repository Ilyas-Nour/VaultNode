/**
 * ToolContainer — Canvas Design System
 * Layout: Small Left Ad | Full-width content | Small Right Ad
 */

"use client";

import React, { memo } from 'react';
import { Lock, Zap, HardDrive, ArrowLeft } from 'lucide-react';
import { VisualProof } from '@/components/VisualProof';
import AdUnit from '@/components/AdUnit';
import { Link } from '@/i18n/routing';

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
    icon: Icon,
    category,
    children,
    settingsContent,
    howItWorks,
    toolId,
    hideAds = false
}: ToolContainerProps) => {
    return (
        <div className="w-full flex flex-col bg-black">
            <div className="w-full flex items-start">

                {/* Left ad — small, sticky */}
                {!hideAds && (
                    <aside className="hidden xl:flex w-[160px] shrink-0 sticky top-20 self-start pt-12 flex-col items-center">
                        <AdUnit type="skyscraper" className="w-[140px] h-[500px]" />
                    </aside>
                )}

                {/* Main content */}
                <main className="flex-1 min-w-0 flex flex-col">
                    <div className="w-full px-4 sm:px-6 lg:px-12 pt-8 pb-5 border-b border-white/[0.06]">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors mb-5"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            All Tools
                        </Link>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-7 h-7 border border-white/10 flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5 text-white/50" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">{category}</span>
                        </div>

                        <h1 className="text-xl sm:text-2xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-zinc-500 leading-relaxed max-w-xl">
                            {description}
                        </p>
                    </div>

                    {/* ── TOP ACTION ROW: Dropzone left | Settings + How It Works right ── */}
                    <div className="w-full px-4 sm:px-6 lg:px-12 py-6 lg:py-8 border-b border-white/[0.06]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                            {/* LEFT: dropzone */}
                            <div className="w-full">
                                {children}
                            </div>

                            {/* RIGHT: Settings first, How It Works below */}
                            <div className="space-y-8">

                                {/* Settings */}
                                {settingsContent && (
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                            Settings
                                        </h3>
                                        {settingsContent}
                                    </div>
                                )}

                                {/* How It Works */}
                                {howItWorks && (
                                    <div className="space-y-5 pt-2 border-t border-white/[0.06]">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                            How It Works
                                        </h3>
                                        <div className="space-y-5">
                                            {howItWorks.map((step, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <span className="text-2xl font-black text-white/10 tabular-nums leading-none shrink-0 w-8 pt-0.5">
                                                        {String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    <div className="space-y-0.5">
                                                        <h4 className="text-sm font-black uppercase tracking-wide text-white">{step.title}</h4>
                                                        <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Privacy specs */}
                                <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-4 sm:gap-6">
                                    {[
                                        { label: 'Network', value: 'Local-Only', icon: Zap },
                                        { label: 'Storage', value: 'In-RAM', icon: HardDrive },
                                        { label: 'Privacy', value: 'Zero Uploads', icon: Lock }
                                    ].map((spec) => (
                                        <div key={spec.label} className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-bold uppercase text-zinc-700 tracking-widest">{spec.label}</span>
                                            <span className="text-xs font-black text-white uppercase tracking-tight">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile ad — visible below xl where side ads are hidden */}
                    {!hideAds && (
                        <div className="xl:hidden w-full px-4 sm:px-6 py-4 border-b border-white/[0.06] flex justify-center">
                            <AdUnit type="banner-slim" className="w-full max-w-[468px]" />
                        </div>
                    )}

                    {/* Visual Proof — full width below the fold */}
                    {toolId && (
                        <div className="w-full px-4 sm:px-6 lg:px-12 py-10 lg:py-14 border-b border-white/[0.06]">
                            <VisualProof toolId={toolId} mode="full" />
                        </div>
                    )}

                </main>

                {/* Right ad — small, sticky */}
                {!hideAds && (
                    <aside className="hidden xl:flex w-[160px] shrink-0 sticky top-20 self-start pt-12 flex-col items-center">
                        <AdUnit type="skyscraper" className="w-[140px] h-[500px]" />
                    </aside>
                )}

            </div>
        </div>
    );
});

ToolContainer.displayName = 'ToolContainer';
