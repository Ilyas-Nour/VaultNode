"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Code, Loader2 } from "lucide-react";

const HtmlToPdfTool = dynamic(() => import("./HtmlToPdfTool"), {
    ssr: false,
    loading: () => <LoadingState />
});

function LoadingState() {
    const t = useTranslations('Tools.common');
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center space-y-8">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl">
                    <Code className="w-8 h-8 text-emerald-500" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                <div className="flex items-center gap-3 text-zinc-500 font-bold tracking-widest uppercase text-[10px]">
                    <span>{t('loading')}</span>
                </div>
            </div>
        </div>
    );
}

export default function HtmlToPdfClient() {
    return <HtmlToPdfTool />;
}
