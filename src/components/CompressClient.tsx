"use client";

import dynamic from "next/dynamic";
import AdUnit from "@/components/AdUnit";
import { useTranslations } from "next-intl";

const LoadingState = () => {
    const t = useTranslations("Tools.compress");
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4 w-full">
            <div className="relative border-4 border-emerald-500/20 border-t-emerald-500 rounded-full w-12 h-12 animate-spin" />
            <div className="flex items-center space-x-3 text-zinc-500 font-bold tracking-widest uppercase text-[10px]">
                <div className="w-3 h-3 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <span>{t('initializing')}</span>
            </div>
        </div>
    );
};

const ImageCompressor = dynamic(() => import("@/components/ImageCompressor"), {
    ssr: false,
    loading: () => <LoadingState />
});

export default function CompressClient() {
    return (
        <main className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row p-4 sm:p-8 gap-8 items-start justify-center">
            {/* High-Performance Compressor Tool */}
            <section className="flex-1 w-full max-w-7xl">
                <ImageCompressor />
            </section>

            {/* Strategic Sidebar Ad Slot */}
            <aside className="hidden lg:block sticky top-8 shrink-0">
                <AdUnit type="sidebar" />
            </aside>
        </main>
    );
}
