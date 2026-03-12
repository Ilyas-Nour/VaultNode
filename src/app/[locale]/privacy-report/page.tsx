"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Lock, EyeOff, Github, ArrowLeft, CheckCircle2, Activity, Cpu, ShieldCheck, Terminal, Globe, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function PrivacyReportPage() {
    const t = useTranslations('PrivacyReport');
    const ts = useTranslations('SecurityProof');
    const tc = useTranslations('Tools.common');

    const steps = [
        { title: t('steps.step1Title'), desc: t('steps.step1Desc'), icon: Shield },
        { title: t('steps.step2Title'), desc: t('steps.step2Desc'), icon: Lock },
        { title: t('steps.step3Title'), desc: t('steps.step3Desc'), icon: Github },
        { title: t('steps.step4Title'), desc: t('steps.step4Desc'), icon: EyeOff },
    ];

    const auditSteps = [
        { title: ts('stepNetwork'), icon: Globe },
        { title: ts('stepProcess'), icon: Activity },
        { title: ts('stepResult'), icon: Search },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* Header / Nav */}
            <div className="w-full border-b border-white/[0.06] bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-5 lg:px-12 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {tc('backToHome')}
                    </Link>
                    <div className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('label')}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-5 lg:px-12 py-16 lg:py-24">
                {/* Hero Section */}
                <div className="space-y-6 mb-20 lg:mb-32">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Verified Protocol</span>
                    </div>
                    <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9]">
                        {t('title')}
                    </h1>
                    <p className="text-xl lg:text-2xl text-zinc-500 max-w-2xl font-medium">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Steps / Pillars */}
                <div className="space-y-px bg-emerald-500/5 border border-emerald-500/10 mb-32">
                    {steps.map((step, i) => (
                        <div key={i} className="bg-black p-8 lg:p-12 group hover:bg-zinc-950/50 transition-colors border-b border-emerald-500/5 last:border-0">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                                {/* Icon & Index */}
                                <div className="lg:col-span-1 flex lg:flex-col items-center justify-between lg:justify-start gap-4 h-full">
                                    <span className="text-[12px] font-black text-zinc-800 tabular-nums">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <step.icon className="w-6 h-6 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="lg:col-span-11 space-y-4">
                                    <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                        {step.title}
                                    </h2>
                                    <p className="text-base lg:text-lg text-zinc-500 leading-relaxed max-w-3xl font-medium">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Technical Audit Section */}
                <div className="space-y-12 mb-32">
                    <div className="space-y-4">
                        <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tight">{ts('auditTitle')}</h2>
                        <p className="text-xl text-zinc-500 font-medium max-w-3xl">{ts('auditDesc')}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {auditSteps.map((step, i) => (
                            <div key={i} className="bg-zinc-950 border border-white/[0.04] p-8 space-y-4 group hover:border-emerald-500/30 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                                    <step.icon className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-tight text-zinc-400 leading-relaxed">
                                    {step.title}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 lg:p-12 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="space-y-4 flex-1">
                            <h3 className="text-xl font-black uppercase tracking-tight text-emerald-400">{ts('engineTitle')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Cpu className="w-5 h-5 text-zinc-600" />
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-300">{ts('engineWasm')}</p>
                                </div>
                                <div className="space-y-2">
                                    <Terminal className="w-5 h-5 text-zinc-600" />
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-300">{ts('engineCrypto')}</p>
                                </div>
                                <div className="space-y-2">
                                    <Activity className="w-5 h-5 text-zinc-600" />
                                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-300">{ts('engineCanvas')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/3 text-center lg:text-left p-8 bg-black/40 border border-emerald-500/20">
                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">{ts('guaranteeTitle')}</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed italic">{ts('guaranteeDesc')}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="pt-12 border-t border-white/[0.06] text-center max-w-2xl mx-auto">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">
                        PrivaFlow Security Protocol
                    </p>
                    <p className="text-2xl font-black uppercase tracking-tight text-white/40 italic">
                        "If we don't see it, we can't leak it."
                    </p>
                </div>
            </main>
        </div>
    );
}
