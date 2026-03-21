"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { ArrowRight, ShieldAlert, Terminal } from 'lucide-react';

export default function NotFound() {
    const t = useTranslations('NotFoundPage');

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            <div className="relative z-10 max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-[10px] font-black tracking-[0.3em] uppercase text-red-500 mb-8">
                        <ShieldAlert className="w-3 h-3" />
                        Access Denied / Fragment Lost
                    </div>

                    <h1 className="text-[120px] md:text-[180px] font-black text-white leading-none tracking-tighter mb-4 opacity-10 select-none">
                        404
                    </h1>

                    <div className="relative -mt-20 md:-mt-32 mb-12">
                        <motion.h2 
                            animate={{ 
                                x: [0, -2, 2, -1, 0],
                                filter: ["none", "blur(1px)", "none"]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 0.2,
                                repeatDelay: 3 
                            }}
                            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight"
                        >
                            {t('title')}
                        </motion.h2>
                    </div>

                    <p className="text-zinc-500 text-lg md:text-xl max-w-md mx-auto mb-12 leading-relaxed font-medium">
                        {t('description')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            href="/"
                            className="group flex items-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-95"
                        >
                            {t('btn')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Corner Markers */}
            <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/5" />
            <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-white/5" />
            <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-white/5" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/5" />
        </div>
    );
}
