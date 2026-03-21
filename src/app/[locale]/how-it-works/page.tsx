"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';

export default function HowItWorks() {
    const t = useTranslations('HowItWorksPage');

    const steps = [
        {
            icon: Shield,
            title: t('sections.step1'),
            desc: t('sections.step1Desc')
        },
        {
            icon: Cpu,
            title: t('sections.step2'),
            desc: t('sections.step2Desc')
        },
        {
            icon: Lock,
            title: t('sections.step3'),
            desc: t('sections.step3Desc')
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Hero */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white mb-6">
                        <div className="w-1.5 h-1.5 bg-white/40" />
                        {t('protocol')}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid gap-12 mb-24">
                    <p className="text-lg text-zinc-500 italic border-l-2 border-white/20 pl-6 max-w-2xl font-medium">
                        "{t('intro')}"
                    </p>

                    <div className="grid md:grid-cols-1 gap-8">
                        {steps.map((step, idx) => (
                            <div 
                                key={idx}
                                className="group relative flex flex-col md:flex-row gap-8 p-8 border border-white/5 bg-zinc-900/20 hover:border-white/20 transition-all duration-500"
                            >
                                {/* Technical Corner Markers */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

                                <div className="shrink-0">
                                    <ToolIcon icon={step.icon} size="lg" className="border-none bg-zinc-900" color='' />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-lg">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Verification Section */}
                <div className="relative p-12 bg-white/5 border border-white/10 overflow-hidden group">
                    <div className="absolute top-0 right-0 text-[120px] font-black text-white/[0.02] translate-x-1/4 -translate-y-1/4 select-none">
                        INFO
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-3 mb-6 text-white font-bold tracking-tight text-xl uppercase italic">
                            <CheckCircle2 className="w-6 h-6" />
                            {t('sections.verification')}
                        </div>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                            {t('sections.verificationDesc')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
