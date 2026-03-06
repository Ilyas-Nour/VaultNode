"use client";

import dynamic from "next/dynamic";
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
    return <ImageCompressor />;
}
