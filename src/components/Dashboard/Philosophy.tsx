"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Wifi } from 'lucide-react';
import { Link } from '@/i18n/routing';

const pillars = [
    {
        icon: ShieldCheck,
        title: "Zero Data Transfer",
        desc: "Every byte of your files is processed inside your own device RAM. We never see it. No logs, no tracking, no server hits."
    },
    {
        icon: Cpu,
        title: "Browser-Native Engines",
        desc: "We use Web APIs, Canvas, WebAssembly, and PDF.js to run complex operations entirely in your tab — no plugins needed."
    },
    {
        icon: Wifi,
        title: "Works Without Internet",
        desc: "Once loaded, most tools function completely offline. Your data stays inside your device even when the network is gone."
    }
];

export const Philosophy = memo(() => {
    return (
        <section id="philosophy" className="border-t border-white/[0.06] w-full">
            <div className="w-full px-6 lg:px-12 py-24 lg:py-40">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Our Philosophy</span>
                        <h2 className="mt-4 text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9]">
                            Privacy Is Not a<br />Feature. It's a<br />Requirement.
                        </h2>
                    </div>
                    <div className="flex flex-col justify-end gap-6 text-zinc-400 leading-relaxed">
                        <p>
                            Most online tools work by uploading your files to a server, processing them, and returning the result. That model is inherently broken from a privacy standpoint.
                        </p>
                        <p>
                            PrivaFlow was built from the ground up to eliminate this completely. Your files never leave your device — not even for a millisecond.
                        </p>
                        <Link
                            href="#tools"
                            className="self-start h-12 px-8 bg-white text-black text-xs font-bold uppercase tracking-widest flex items-center hover:bg-zinc-200 transition-colors mt-4"
                        >
                            Start Using Free Tools
                        </Link>
                    </div>
                </div>

                {/* Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-black p-10 space-y-5"
                        >
                            <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                                <p.icon className="w-4.5 h-4.5 text-white/60" />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight">{p.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-normal">{p.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Philosophy.displayName = 'Philosophy';
