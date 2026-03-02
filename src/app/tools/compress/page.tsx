"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

/**
 * PRODUCTION-READY WRAPPER
 * Since browser-image-compression and large Image objects are strictly client-side,
 * we use dynamic imports with { ssr: false } to prevent hydration mismatches and
 * node-specific execution errors during build.
 */
const ImageCompressor = dynamic(() => import("@/components/ImageCompressor"), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
            <div className="relative border-4 border-emerald-500/20 border-t-emerald-500 rounded-full w-12 h-12 animate-spin" />
            <div className="flex items-center space-x-3 text-zinc-500 font-bold tracking-widest uppercase text-[10px]">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Initializing Secure Engine...</span>
            </div>
        </div>
    ),
});

export default function CompressPage() {
    return <ImageCompressor />;
}
