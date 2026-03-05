"use client";

import dynamic from "next/dynamic";

const LoadingState = () => (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        <p className="text-zinc-600 font-semibold uppercase tracking-widest text-[10px]">
            Initializing Redactor…
        </p>
    </div>
);

const RedactorTool = dynamic(() => import("@/components/RedactorTool"), {
    ssr: false,
    loading: () => <LoadingState />,
});

export default function RedactClient() {
    return <RedactorTool />;
}
