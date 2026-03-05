"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const Hero = memo(() => {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center border-b border-white/[0.06] overflow-hidden w-full">
            {/* Fine grid pattern */}
            <div className="absolute inset-0 bg-grid-canvas opacity-100 pointer-events-none" />

            {/* Subtle glow center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/3 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative w-full px-6 lg:px-12 py-32 flex flex-col items-center text-center gap-12">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 border border-white/10 rounded-full text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400"
                >
                    <Lock className="w-3 h-3" />
                    100% Browser-Native · Zero Uploads · Free Forever
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-[112px] font-black leading-[0.88] tracking-tighter uppercase"
                >
                    <span className="text-white block">Your Files.</span>
                    <span className="text-white/30 block">Your Rules.</span>
                    <span className="text-white block">Your Device.</span>
                </motion.h1>

                {/* Subline */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="max-w-xl text-zinc-400 text-base md:text-lg leading-relaxed font-normal"
                >
                    PrivaFlow processes everything inside your own browser tab.
                    No servers. No uploads. No surveillance.
                </motion.p>

                {/* CTA row */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link
                        href="#tools"
                        className="group h-14 px-10 bg-white hover:bg-zinc-100 text-black font-bold text-sm uppercase tracking-widest rounded-none flex items-center gap-3 transition-all active:scale-95"
                    >
                        Explore All Tools
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#magic"
                        className="h-14 px-10 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-bold text-sm uppercase tracking-widest rounded-none flex items-center gap-3 transition-all"
                    >
                        See Visual Proof
                    </Link>
                </motion.div>

                {/* Stat strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 pt-8 border-t border-white/[0.06] w-full max-w-3xl"
                >
                    {[
                        { n: "13", label: "Privacy Tools" },
                        { n: "0 bytes", label: "Data Uploaded" },
                        { n: "4", label: "Languages" },
                        { n: "100%", label: "Client Side" },
                    ].map(s => (
                        <div key={s.label} className="flex flex-col items-center gap-1">
                            <span className="text-xl font-black text-white tracking-tight">{s.n}</span>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">{s.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';
