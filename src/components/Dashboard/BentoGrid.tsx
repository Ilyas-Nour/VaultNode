"use client";

import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eraser, ImageMinus, KeyRound, Lock, Zap, ImagePlus,
    Video, FileUp, FileStack, Unlock, Wand2, Images, Scissors, Eye, ArrowRight
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface ToolItem {
    id: string;
    category: 'vault' | 'media' | 'docs';
    title: string;
    desc: string;
    icon: React.ElementType;
    href: string;
}

const tools: ToolItem[] = [
    // VAULT
    { id: 'redactor', category: 'vault', title: 'Redact PDF', desc: 'Permanently destroy sensitive data by pixel-burning regions directly on the document.', icon: Eraser, href: '/tools/redact' },
    { id: 'clean-exif', category: 'vault', title: 'Clean Metadata', desc: 'Strip GPS data, camera info, and hidden EXIF tags from your images locally.', icon: ImageMinus, href: '/tools/clean-exif' },
    { id: 'password', category: 'vault', title: 'Password Generator', desc: 'Generate cryptographically secure passwords with custom rules and entropy.', icon: KeyRound, href: '/tools/password' },
    { id: 'encrypt', category: 'vault', title: 'Text Encryptor', desc: 'Client-side AES encryption for messages, notes, and sensitive text.', icon: Lock, href: '/tools/encrypt' },

    // MEDIA
    { id: 'compress', category: 'media', title: 'Compress Image', desc: 'Reduce file size without visible quality loss using local canvas processing.', icon: Zap, href: '/tools/compress' },
    { id: 'heic', category: 'media', title: 'HEIC to JPG', desc: 'Convert Apple HEIC photos to universal JPEG format, entirely offline.', icon: ImagePlus, href: '/tools/heic-to-jpg' },
    { id: 'media-converter', category: 'media', title: 'Media Converter', desc: 'Extract audio and trim video clips using FFmpeg.wasm in your browser.', icon: Video, href: '/tools/media-converter' },
    { id: 'svg-to-png', category: 'media', title: 'SVG to PNG', desc: 'Rasterize scalable vector files to high-resolution PNGs locally.', icon: Wand2, href: '/tools/svg-to-png' },
    { id: 'blur', category: 'media', title: 'Blur Image', desc: 'Apply Gaussian blur to faces, plates, or sensitive areas in photos.', icon: Eye, href: '/tools/blur' },

    // DOCS
    { id: 'merger', category: 'docs', title: 'Merge PDFs', desc: 'Combine multiple PDFs into one document without uploading anything.', icon: FileStack, href: '/tools/pdf-merge' },
    { id: 'pdf-to-word', category: 'docs', title: 'PDF to Word', desc: 'Reconstruct PDF text content into an editable DOCX file from your browser.', icon: FileUp, href: '/tools/pdf-to-docx' },
    { id: 'unlock', category: 'docs', title: 'Unlock PDF', desc: 'Remove user-level password restrictions from PDFs locally.', icon: Unlock, href: '/tools/unlock-pdf' },
    { id: 'pdf-to-img', category: 'docs', title: 'PDF to Image', desc: 'Convert PDF pages to high-resolution PNG images, page by page.', icon: Images, href: '/tools/pdf-to-img' },
    { id: 'split', category: 'docs', title: 'Split PDF', desc: 'Extract page ranges or individual pages from any PDF document.', icon: Scissors, href: '/tools/pdf-split' },
];

const categories = [
    { id: 'all', label: 'All Tools', count: tools.length },
    { id: 'vault', label: 'Vault', count: tools.filter(t => t.category === 'vault').length },
    { id: 'media', label: 'Media', count: tools.filter(t => t.category === 'media').length },
    { id: 'docs', label: 'Documents', count: tools.filter(t => t.category === 'docs').length },
];

export const BentoGrid = memo(() => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [active, setActive] = useState('all');

    const filtered = useMemo(() => {
        if (active === 'all') return tools;
        return tools.filter(t => t.category === active);
    }, [active]);

    return (
        <section id="tools" className="space-y-12">
            {/* Category filter tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActive(cat.id)}
                        className={cn(
                            "h-10 px-5 text-[11px] font-bold uppercase tracking-widest border transition-all",
                            active === cat.id
                                ? "bg-white text-black border-white"
                                : "bg-transparent text-zinc-500 border-white/10 hover:border-white/30 hover:text-white"
                        )}
                    >
                        {cat.label}
                        <span className={cn("ms-2 tabular-nums", active === cat.id ? "text-black/50" : "text-zinc-700")}>
                            {cat.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tool grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
                <AnimatePresence mode="popLayout">
                    {filtered.map((tool, i) => (
                        <motion.div
                            key={tool.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.04 }}
                        >
                            <Link href={tool.href} className="group block bg-black hover:bg-zinc-950 transition-colors p-8 lg:p-10 h-full">
                                <div className="flex flex-col h-full gap-6">
                                    {/* Icon + Category badge */}
                                    <div className="flex items-start justify-between">
                                        <div className="w-12 h-12 border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors">
                                            <tool.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 border border-zinc-900 px-2.5 py-1">
                                            {tool.category}
                                        </span>
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
                                            {tool.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                                            {tool.desc}
                                        </p>
                                    </div>

                                    {/* Arrow CTA */}
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">
                                        Open Tool
                                        <ArrowRight className={cn("w-3.5 h-3.5 group-hover:translate-x-1 transition-transform", isRTL && "rotate-180")} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
});

BentoGrid.displayName = 'BentoGrid';
