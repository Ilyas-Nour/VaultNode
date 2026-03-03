"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MediaConverterTool = dynamic(() => import('./MediaConverterTool'), {
    ssr: false,
    loading: () => (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-zinc-500 font-bold animate-pulse uppercase tracking-widest text-xs">
                Initializing FFmpeg Engine...
            </p>
        </div>
    )
});

export default function MediaConverterClient() {
    return (
        <Suspense fallback={null}>
            <MediaConverterTool />
        </Suspense>
    );
}
