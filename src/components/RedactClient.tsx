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
        <main className="min-h-screen bg-zinc-950 flex flex-col items-center pt-18 pb-24">
            {/* 100% Width Container */}
            <div className="w-full max-w-[1600px] relative flex flex-col gap-12 lg:gap-24 items-center p-4 sm:p-8 lg:p-12">

                <div className="flex-1 w-full flex flex-col gap-12 relative text-center">
                    {/* Top Banner Ad - Primary Monitization */}
                    <div className="w-full flex justify-center mb-8">
                        <AdUnit type="banner-slim" className="max-w-5xl" />
                    </div>

                    {/* Main Application Logic */}
                    <section className="w-full">
                        <RedactorTool />
                    </section>
                </div>
            </div>
        </main>
    );
}
