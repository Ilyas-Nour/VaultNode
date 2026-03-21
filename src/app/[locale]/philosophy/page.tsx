"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { EyeOff, Fingerprint, Box } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';

export default function Philosophy() {
    const t = useTranslations('PhilosophyPage');

    const pillars = [
        {
            icon: EyeOff,
            title: t('vision.title'),
            text: t('vision.text')
        },
        {
            icon: Fingerprint,
            title: t('sovereignty.title'),
            text: t('sovereignty.text')
        },
        {
            icon: Box,
            title: t('design.title'),
            text: t('design.text')
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Hero */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white mb-6">
                        <div className="w-1.5 h-1.5 bg-white/40" />
                        MANIFESTO
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-medium italic">
                        "{t('subtitle')}"
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid gap-1px bg-white/10 border border-white/10 mb-24 overflow-hidden">
                    {pillars.map((pillar, idx) => (
                        <div 
                            key={idx}
                            className="bg-black p-12 group hover:bg-zinc-950 transition-colors duration-500"
                        >
                            <div className="mb-8">
                                <ToolIcon icon={pillar.icon} size="lg" className="border-none bg-zinc-900" color='' />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-6 tracking-tight uppercase">
                                {pillar.title}
                            </h2>
                            <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl group-hover:text-zinc-300 transition-colors duration-500">
                                {pillar.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Final Quote */}
                <div className="text-center py-20 border-t border-white/10">
                    <p className="text-zinc-600 text-[10px] font-bold tracking-[0.5em] uppercase mb-8">
                        The Privaflow Commitment
                    </p>
                    <p className="text-3xl md:text-4xl text-white font-light tracking-tight italic max-w-2xl mx-auto leading-tight">
                        "Software that doesn't just promise privacy, but is architecturally incapable of violating it."
                    </p>
                </div>
            </div>
        </div>
    );
}
