"use client";

import React, { memo } from 'react';
import { Link } from '@/i18n/routing';
import { Heart } from 'lucide-react';

const columns = [
    {
        heading: "Tools",
        links: [
            { label: "Redact PDF", href: '/tools/redact' },
            { label: "Clean Metadata", href: '/tools/clean-exif' },
            { label: "Media Converter", href: '/tools/media-converter' },
            { label: "PDF to Word", href: '/tools/pdf-to-docx' },
            { label: "Compress Image", href: '/tools/compress' },
            { label: "Merge PDF", href: '/tools/pdf-merge' },
        ]
    },
    {
        heading: "Documents",
        links: [
            { label: "Blur Image", href: '/tools/blur' },
            { label: "HEIC to JPG", href: '/tools/heic-to-jpg' },
            { label: "SVG to PNG", href: '/tools/svg-to-png' },
            { label: "Unlock PDF", href: '/tools/unlock-pdf' },
            { label: "PDF to Image", href: '/tools/pdf-to-img' },
            { label: "Split PDF", href: '/tools/pdf-split' },
        ]
    },
    {
        heading: "Privacy",
        links: [
            { label: "Zero Upload Policy", href: '#philosophy' },
            { label: "Local Protocol", href: '#philosophy' },
            { label: "Encryption Standards", href: '#philosophy' },
            { label: "Open Architecture", href: '#philosophy' },
        ]
    },
    {
        heading: "Info",
        links: [
            { label: "How It Works", href: '/#tools' },
            { label: "Philosophy", href: '/#philosophy' },
            { label: "All Tools", href: '/#magic' },
            { label: "Contact Us", href: '/contact' },
        ]
    }
];

export const Footer = memo(() => {
    return (
        <footer className="border-t border-white/[0.06] bg-black w-full">
            <div className="w-full px-6 lg:px-12 pt-20 pb-12">

                {/* Big brand statement */}
                <div className="mb-16 border-b border-white/[0.06] pb-16">
                    <p className="text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] text-white/10 max-w-3xl">
                        Privacy Is Not an Option.
                        <span className="text-white"> It's the Architecture.</span>
                    </p>
                </div>

                {/* Sitemap */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    {columns.map(col => (
                        <div key={col.heading} className="space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                {col.heading}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-black uppercase tracking-[0.15em] text-white">PrivaFlow</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-700">v2.0</span>
                    </div>
                    <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-widest">
                        © 2026 · Zero tracking · Zero uploads · Built for the open web
                    </p>
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';
