"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { X, Globe, ShieldAlert, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    };

    const clearSession = () => {
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                        <div className="relative p-8 md:p-12 space-y-10">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                                        {t('title')}
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                        {t('subtitle')}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="rounded-full hover:bg-zinc-900 border border-zinc-800"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Section: Language */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-zinc-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        {t('language.label')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all text-start group relative overflow-hidden",
                                                locale === lang.code
                                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                    : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                                            )}
                                        >
                                            <span className="text-xs font-bold">{lang.label}</span>
                                            {locale === lang.code && (
                                                <Check className="w-3 h-3 absolute top-3 end-3" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Session Security */}
                            <div className="space-y-6 pt-6 border-t border-zinc-900">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-4 h-4 text-zinc-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        {t('session.label')}
                                    </span>
                                </div>
                                <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 space-y-4">
                                    <p className="text-[11px] text-zinc-500 font-bold leading-relaxed">
                                        {t('session.clearDesc')}
                                    </p>
                                    <Button
                                        onClick={clearSession}
                                        className="w-full h-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all border border-red-500/20 shadow-lg shadow-red-500/5"
                                    >
                                        {t('session.clear')}
                                    </Button>
                                </div>
                            </div>

                            {/* Footer */}
                            <Button
                                onClick={onClose}
                                className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest italic transition-all border border-zinc-800"
                            >
                                {t('close')}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
