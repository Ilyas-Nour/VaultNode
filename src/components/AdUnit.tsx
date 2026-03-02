"use client";

import React from "react";
import { Info } from "lucide-react";

interface AdUnitProps {
    type: "sidebar" | "banner";
}

/**
 * AdUnit Component
 * Premium placeholder for Google AdSense or partner banners.
 * Designed to fit seamlessly into the Zinc/Emerald aesthetic.
 */
export default function AdUnit({ type }: AdUnitProps) {
    const isSidebar = type === "sidebar";

    return (
        <div
            className={`
        bg-zinc-950/50 border border-dashed border-zinc-800/50 rounded-2xl flex flex-col items-center justify-center text-center p-6 transition-all hover:border-emerald-500/20 group
        ${isSidebar ? "w-[300px] h-[600px]" : "w-full max-w-[728px] h-[90px]"}
      `}
        >
            <div className="space-y-4 flex flex-col items-center">
                <div className={`p-3 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors group-hover:bg-emerald-500/5 group-hover:border-emerald-500/20`}>
                    <Info className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500/50 transition-colors" />
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        Advertisement
                    </p>
                    <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">
                        {isSidebar ? "300 x 600 Sidebar" : "728 x 90 Banner"}
                    </p>
                </div>
            </div>

            {isSidebar && (
                <div className="mt-8 pt-8 border-t border-zinc-900/50 w-full px-4">
                    <p className="text-[10px] text-zinc-700 leading-relaxed italic font-medium">
                        Support VaultNode by viewing high-relevance privacy and developer tools.
                    </p>
                </div>
            )}
        </div>
    );
}
