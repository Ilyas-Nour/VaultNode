"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { X, Check } from 'lucide-react';
import { useRouter, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const t = useTranslations('HomePage.settings');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const languages = [
        { code: 'en', label: t('language.en') },
        { code: 'es', label: t('language.es') },
        { code: 'fr', label: t('language.fr') },
        { code: 'ar', label: t('language.ar') }
    ];

    const changeLanguage = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
        onClose();
    };

    const clearSession = () => {
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal — sharp edges, matches site DNA */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-sm bg-black border border-white/[0.08] shadow-2xl shadow-black/80 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                            <div>
                                <h2 className="text-[13px] font-black uppercase tracking-[0.18em] text-white">
                                    {t('title')}
                                </h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 mt-0.5">
                                    {t('subtitle')}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-6 py-6 space-y-7">

                            {/* Language */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-600">
                                    {t('language.label')}
                                </p>
                                <div className="grid grid-cols-2 gap-px bg-white/[0.05]">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3 transition-colors text-start",
                                                locale === lang.code
                                                    ? "bg-white text-black"
                                                    : "bg-black text-zinc-500 hover:bg-zinc-950 hover:text-white"
                                            )}
                                        >
                                            <span className="text-[12px] font-bold">{lang.label}</span>
                                            {locale === lang.code && (
                                                <Check className="w-3 h-3 shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Session clear */}
                            <div className="space-y-3 pt-5 border-t border-white/[0.06]">
                                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-600">
                                    {t('session.label')}
                                </p>
                                <p className="text-[12px] text-zinc-600 leading-relaxed">
                                    {t('session.clearDesc')}
                                </p>
                                <button
                                    onClick={clearSession}
                                    className="w-full h-10 border border-red-500/20 text-red-500/70 hover:border-red-500/50 hover:text-red-400 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                                >
                                    {t('session.clear')}
                                </button>
                            </div>
                        </div>

                        {/* Close footer */}
                        <div className="px-6 pb-6">
                            <button
                                onClick={onClose}
                                className="w-full h-11 bg-white hover:bg-zinc-100 text-black text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                            >
                                {t('close')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
