"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const SvgToPngTool = dynamic(() => import('@/components/SvgToPngTool'), {
    ssr: false,
    loading: () => (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-zinc-500 font-bold animate-pulse uppercase tracking-widest text-xs">
                Preparing Rasterizer...
            </p>
        </div>
    )
});

export default function SvgToPngClient() {
    return (
        <Suspense fallback={null}>
            <SvgToPngTool />
        </Suspense>
    );
}
