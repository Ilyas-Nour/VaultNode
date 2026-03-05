"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick, Cpu, Download } from 'lucide-react';

const steps = [
    {
        n: "01",
        icon: MousePointerClick,
        title: "Drop Your File",
        desc: "Drag and drop, or click to select. Your file loads directly into browser memory — nothing is sent anywhere."
    },
    {
        n: "02",
        icon: Cpu,
        title: "Process Locally",
        desc: "Our WASM and Canvas engines run the operation natively in your tab. Zero server involvement, ever."
    },
    {
        n: "03",
        icon: Download,
        title: "Download Result",
        desc: "Get your output instantly. It's created directly in your browser and downloaded straight to your device."
    }
];

export const Steps = memo(() => {
    return (
        <section className="border-t border-white/[0.06] w-full">
            <div className="w-full px-6 lg:px-12 py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">How It Works</span>
                        <h2 className="mt-4 text-4xl lg:text-5xl font-black uppercase tracking-tight">
                            Three Steps.<br />Total Privacy.
                        </h2>
                    </div>
                    <p className="text-zinc-400 text-base leading-relaxed">
                        Every tool on PrivaFlow follows the same architecture: load into RAM, process locally, output to device. The cycle is self-contained — completely invisible to any external system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="bg-black p-10 space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-5xl font-black text-white/10 tabular-nums leading-none">{s.n}</span>
                                <div className="w-9 h-9 border border-white/10 flex items-center justify-center">
                                    <s.icon className="w-4 h-4 text-white/50" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">{s.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-normal">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Steps.displayName = 'Steps';
