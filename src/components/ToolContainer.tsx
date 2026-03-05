/**
 * ToolContainer — Canvas Design System: Tool Page Layout
 * Structure: Left Ad | Tool Content | Right Ad
 * Navbar and Footer are injected by the root layout.
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
}

export const ToolContainer = memo(({
    title,
    description,
    icon: Icon,
    category,
    children,
    settingsContent,
    howItWorks,
    toolId
}: ToolContainerProps) => {
    return (
        <div className="flex-1 flex flex-col min-h-screen bg-black pt-16">

            {/* ── 3-column layout: Ad | Content | Ad ── */}
            <div className="flex-1 w-full flex items-start gap-0">

                {/* LEFT AD COLUMN — hidden on mobile, sticky on desktop */}
                <aside className="hidden xl:flex w-[200px] shrink-0 sticky top-20 self-start pt-12 px-4 flex-col items-center gap-6">
                    <AdUnit type="skyscraper" className="w-[160px] h-[600px]" />
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 min-w-0 flex flex-col">

                    {/* Tool header */}
                    <div className="px-6 lg:px-12 pt-12 pb-8 border-b border-white/[0.06]">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            All Tools
                        </Link>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 border border-white/10 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-white/60" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">{category}</span>
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                            {title}
                        </h1>
                        <p className="mt-3 text-sm text-zinc-500 font-normal leading-relaxed max-w-lg">
                            {description}
                        </p>
                    </div>

                    {/* Tool workspace */}
                    <div className="px-6 lg:px-12 py-10 border-b border-white/[0.06]">
                        {children}
                    </div>

                    {/* Visual Proof — full width of content area */}
                    {toolId && (
                        <div className="px-6 lg:px-12 py-16 border-b border-white/[0.06]">
                            <VisualProof toolId={toolId} mode="full" />
                        </div>
                    )}

                    {/* Settings + How It Works */}
                    {(settingsContent || howItWorks) && (
                        <div className="px-6 lg:px-12 py-14 border-b border-white/[0.06] grid grid-cols-1 lg:grid-cols-2 gap-14">
                            {settingsContent && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Settings</h3>
                                    {settingsContent}
                                </div>
                            )}
                            {howItWorks && (
                                <div className="space-y-8">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">How It Works</h3>
                                    <div className="space-y-8">
                                        {howItWorks.map((step, i) => (
                                            <div key={i} className="flex gap-5">
                                                <span className="text-3xl font-black text-white/10 tabular-nums leading-none shrink-0 w-10">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <div className="space-y-1 pt-1">
                                                    <h4 className="text-sm font-black uppercase tracking-wide text-white">{step.title}</h4>
                                                    <p className="text-sm text-zinc-500 leading-relaxed font-normal">{step.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Inline ad for mobile — between settings and footer spec */}
                    <div className="xl:hidden px-6 lg:px-12 py-8 border-b border-white/[0.06]">
                        <AdUnit type="banner-slim" />
                    </div>

                    {/* Safety specs */}
                    <div className="px-6 lg:px-12 py-10">
                        <div className="grid grid-cols-3 gap-8">
                            {[
                                { label: 'Network', value: 'Local-Only', icon: Zap },
                                { label: 'Storage', value: 'In-RAM Only', icon: HardDrive },
                                { label: 'Privacy', value: 'Zero Uploads', icon: Lock }
                            ].map((spec) => (
                                <div key={spec.label} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-widest">{spec.label}</span>
                                    <span className="text-base lg:text-xl font-black text-white uppercase tracking-tight">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* RIGHT AD COLUMN — hidden on mobile, sticky on desktop */}
                <aside className="hidden xl:flex w-[200px] shrink-0 sticky top-20 self-start pt-12 px-4 flex-col items-center gap-6">
                    <AdUnit type="skyscraper" className="w-[160px] h-[600px]" />
                    {/* Second ad unit lower down */}
                    <AdUnit type="sidebar" className="w-[160px] h-[300px] mt-4" />
                </aside>
            </div>
        </div>
    );
});

ToolContainer.displayName = 'ToolContainer';
