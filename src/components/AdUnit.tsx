"use client";

import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
    type: "sidebar" | "banner-wide" | "banner-slim" | "skyscraper";
    className?: string;
}

export default function AdUnit({ type, className }: AdUnitProps) {
    const isSidebar = type === "sidebar";
    const isSkyscraper = type === "skyscraper";
    const isBannerWide = type === "banner-wide";
    const isBannerSlim = type === "banner-slim";

    return (
        <div
            className={cn(
                "relative group overflow-hidden transition-all duration-500",
                "bg-zinc-950/20 border border-zinc-900 rounded-[2rem] flex flex-col items-center justify-center text-center p-6",
                "hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]",
                isSidebar && "w-[300px] h-[600px]",
                isSkyscraper && "w-[160px] h-[600px] lg:h-[900px]",
                isBannerWide && "w-full h-[180px] lg:h-[250px]",
                isBannerSlim && "w-full h-[90px]",
                className
            )}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            {/* Ambient Glow on Hover */}
            <div className="absolute -inset-24 bg-emerald-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative space-y-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-zinc-950 transition-all duration-500 shadow-2xl">
                    <Info className="w-6 h-6 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-emerald-500/80 transition-colors">
                        Sponsor
                    </p>
                    <div className="h-px w-8 bg-zinc-900 group-hover:w-full group-hover:bg-emerald-500/20 transition-all duration-700 mx-auto" />
                    <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest group-hover:text-zinc-600 transition-colors">
                        {type.replace('-', ' ')}
                    </p>
                </div>
            </div>

            {(isSidebar || isSkyscraper) && (
                <div className="mt-auto pt-8 border-t border-zinc-900/50 w-full px-4 relative z-10">
                    <p className="text-[10px] text-zinc-700 leading-relaxed italic font-black uppercase tracking-tighter opacity-40">
                        Secure Advertising
                    </p>
                </div>
            )}
        </div>
    );
}
