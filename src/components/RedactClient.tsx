"use client";

import dynamic from "next/dynamic";
import AdUnit from "@/components/AdUnit";
import { useTranslations } from "next-intl";

const LoadingState = () => {
    const t = useTranslations("Tools.redact");
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4 w-full">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-zinc-500 font-medium animate-pulse uppercase tracking-widest text-[10px]">
                {t('initializing')}
            </p>
        </div>
    );
};

const RedactorTool = dynamic(() => import("@/components/RedactorTool"), {
    ssr: false,
    loading: () => <LoadingState />
});

export default function RedactClient() {
    return (
        <main className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row p-4 sm:p-8 gap-8 items-start justify-center">
            {/* Main Application Logic */}
            <section className="flex-1 w-full max-w-6xl">
                <RedactorTool />
            </section>

            {/* Strategic Monetization Placement */}
            <aside className="hidden lg:block sticky top-8 shrink-0">
                <AdUnit type="sidebar" />
            </aside>
        </main>
    );
}
