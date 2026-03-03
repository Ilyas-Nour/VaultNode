"use client";

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
    LayoutGrid,
    Settings,
    Search,
    ChevronRight,
    ShieldCheck,
    Menu,
    X,
    Sparkles,
    Eraser,
    Lock,
    Images,
    FileUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsModal } from './SettingsModal';

export function DashboardSidebar() {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const pathname = usePathname();
    const isRTL = locale === 'ar';
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const menuItems = [
        {
            label: t('categories.vault'),
            icon: Eraser,
            href: '/#vault',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            label: t('categories.media'),
            icon: Images,
            href: '/#media',
            color: 'text-sky-500',
            bg: 'bg-sky-500/10'
        },
        {
            label: t('categories.docs'),
            icon: FileUp,
            href: '/#docs',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        }
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-emerald-950">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase italic">PrivaFlow</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-xl hover:bg-zinc-900"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </header>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 start-0 z-50 w-72 bg-zinc-950 border-e border-zinc-900 flex flex-col transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-8 flex flex-col h-full">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3 mb-12 group" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">PrivaFlow</span>
                    </Link>

                    {/* Search Header (Sidebar Desktop) */}
                    <div className="relative mb-8 group">
                        <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                            placeholder={t('searchPlaceholder')}
                            className="w-full h-12 ps-11 bg-zinc-900/50 border-zinc-800 rounded-2xl text-xs font-bold focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/50 transition-all"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-4 mb-4">Dashboard</p>
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold italic text-sm group",
                                    pathname === '/' ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                                )}
                            >
                                <LayoutGrid className={cn("w-5 h-5", pathname === '/' ? "text-emerald-500" : "text-zinc-600 group-hover:text-emerald-500")} />
                                <span>Overview</span>
                            </Link>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-4 mb-4">Categories</p>
                            {menuItems.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900/50 transition-all font-bold italic text-sm group"
                                >
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", item.bg)}>
                                        <item.icon className={cn("w-4 h-4", item.color)} />
                                    </div>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Bottom Settings */}
                    <div className="pt-6 border-t border-zinc-900">
                        <Button
                            variant="ghost"
                            onClick={() => setIsSettingsOpen(true)}
                            className="w-full justify-start gap-3 h-14 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900/50 font-bold italic"
                        >
                            <Settings className="w-5 h-5 text-zinc-600" />
                            <span>{t('settings.title')}</span>
                        </Button>
                    </div>
                </div>
            </aside>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
