"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

/**
 * PRODUCTION-READY WRAPPER
 * Since pdfjs-dist and HTML5 Canvas are strictly client-side, we use Next.js 
 * dynamic imports with { ssr: false } to prevent build-time prerendering errors.
 */
const RedactorTool = dynamic(() => import("@/components/RedactorTool"), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="text-zinc-500 font-medium animate-pulse">Initializing Secure Sandbox...</p>
        </div>
    )
});

export default function RedactPage() {
    return <RedactorTool />;
}
