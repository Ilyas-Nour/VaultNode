"use client";

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import {
    ChevronDown, Menu, X, Shield, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
    {
        title: "Vault",
        tools: [
            { title: "Redact PDF", href: '/tools/redact', desc: "Pixel-burn sensitive data" },
            { title: "Clean Metadata", href: '/tools/clean-exif', desc: "Strip EXIF & hidden tags" },
            { title: "Password Generator", href: '/tools/password', desc: "Entropy-based passwords" },
            { title: "Text Encryptor", href: '/tools/encrypt', desc: "AES client-side encryption" },
        ]
    },
    {
        title: "Media",
        tools: [
            { title: "Compress Image", href: '/tools/compress', desc: "Reduce file size locally" },
            { title: "HEIC to JPG", href: '/tools/heic-to-jpg', desc: "Convert Apple photos" },
            { title: "Media Converter", href: '/tools/media-converter', desc: "FFmpeg.wasm in browser" },
            { title: "SVG to PNG", href: '/tools/svg-to-png', desc: "Vector rasterization" },
            { title: "Blur Image", href: '/tools/blur', desc: "Gaussian blur locally" },
        ]
    },
    {
        title: "Documents",
        tools: [
            { title: "Merge PDF", href: '/tools/pdf-merge', desc: "Combine PDF files" },
            { title: "PDF to Word", href: '/tools/pdf-to-docx', desc: "Local reconstruction" },
            { title: "Unlock PDF", href: '/tools/unlock-pdf', desc: "Remove restrictions" },
            { title: "PDF to Image", href: '/tools/pdf-to-img', desc: "Page-by-page PNG export" },
            { title: "Split PDF", href: '/tools/pdf-split', desc: "Extract page ranges" },
        ]
    }
];

export const Navbar = memo(() => {
    const locale = useLocale();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/[0.06]">
            <div className="w-full px-6 lg:px-12 h-16 flex items-center justify-between gap-8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-black uppercase tracking-[0.15em] text-white">
                        PrivaFlow
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden lg:flex items-center gap-8 flex-1">
                    {categories.map((cat) => (
                        <div key={cat.title} className="relative group/cat">
                            <button className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-white py-5 flex items-center gap-1.5 transition-colors">
                                {cat.title}
                                <ChevronDown className="w-3 h-3 opacity-50" />
                            </button>

                            {/* Dropdown */}
                            <div className="absolute top-[100%] left-0 w-60 bg-black border border-white/[0.08] p-4 shadow-2xl shadow-black/50 opacity-0 translate-y-2 pointer-events-none group-hover/cat:opacity-100 group-hover/cat:translate-y-0 group-hover/cat:pointer-events-auto transition-all duration-200 space-y-1">
                                {cat.tools.map((tool) => (
                                    <Link
                                        key={tool.title}
                                        href={tool.href}
                                        className="flex flex-col px-3 py-2.5 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-[12px] font-semibold text-white">{tool.title}</span>
                                        <span className="text-[10px] text-zinc-600 mt-0.5">{tool.desc}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Link href="#philosophy" className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                        Philosophy
                    </Link>
                    <Link href="/contact" className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                        Contact
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-5">
                    <div className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Local Shield Active
                    </div>

                    <button
                        className="lg:hidden text-white p-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-black border-t border-white/[0.06] overflow-hidden"
                    >
                        <div className="p-6 space-y-8">
                            {categories.map((cat) => (
                                <div key={cat.title} className="space-y-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{cat.title}</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {cat.tools.map((tool) => (
                                            <Link
                                                key={tool.title}
                                                href={tool.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-[13px] font-semibold text-zinc-300 hover:text-white py-1 transition-colors"
                                            >
                                                {tool.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
});

Navbar.displayName = 'Navbar';
