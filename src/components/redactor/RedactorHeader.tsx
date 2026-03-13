"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eraser, AlertTriangle } from "lucide-react";

interface RedactorHeaderProps {
    fileName: string;
    redactionsCount: number;
    onReset: () => void;
    t: (key: string) => string;
    commonT: (key: string) => string;
}

export const RedactorHeader: React.FC<RedactorHeaderProps> = ({
    fileName,
    redactionsCount,
    onReset,
    t,
    commonT
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-xl z-20 flex items-center justify-between px-8"
        >
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
                    <Eraser className="w-4 h-4 text-black" />
                </div>
                <div>
                    <h2 className="text-xs font-black text-white uppercase tracking-widest">{t('title')}</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter font-bold">{fileName}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pr-6 border-r border-zinc-800">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('activeLayers')}</span>
                    <span className="px-2 py-0.5 bg-zinc-900 text-white text-xs font-black rounded-sm border border-zinc-800">{redactionsCount}</span>
                </div>
                <button 
                    onClick={onReset}
                    className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors flex items-center gap-2 px-3 py-1.5 hover:bg-rose-500/10 rounded-sm"
                >
                    <AlertTriangle className="w-3 h-3" />
                    {commonT('cancel')}
                </button>
            </div>
        </motion.div>
    );
};
