"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Shield, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RedactorFooterProps {
    isFullscreen: boolean;
    isProcessing: boolean;
    redactionsCount: number;
    onClear: () => void;
    onExport: () => void;
    onReset: () => void;
    t: (key: string) => string;
    commonT: (key: string) => string;
}

export const RedactorFooter: React.FC<RedactorFooterProps> = ({
    isFullscreen,
    isProcessing,
    redactionsCount,
    onClear,
    onExport,
    onReset,
    t,
    commonT
}) => {
    return (
        <div className={cn(
            "flex items-center w-full transition-all",
            isFullscreen 
                ? "absolute bottom-0 left-0 right-0 h-24 border-t border-zinc-900 bg-black/80 backdrop-blur-xl z-20 justify-center px-8" 
                : "absolute bottom-0 h-20 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md justify-between px-6 z-20"
        )}>
            <div className={cn("flex gap-4 w-full", isFullscreen ? "max-w-md" : "")}>
                
                {!isFullscreen && (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onReset}
                            className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors flex items-center gap-2 px-3 py-1.5 hover:bg-rose-500/10 rounded-sm"
                        >
                            <AlertTriangle className="w-3 h-3" />
                            {commonT('cancel')}
                        </button>
                    </div>
                )}

                <div className={cn("flex gap-4", isFullscreen ? "flex-1" : "flex-1 justify-end")}>
                    <Button
                        variant="outline"
                        onClick={onClear}
                        disabled={isProcessing || redactionsCount === 0}
                        className={cn(
                            "h-12 border-zinc-800 text-zinc-500 hover:text-white hover:border-white font-black uppercase tracking-widest text-[10px] transition-all bg-transparent flex items-center gap-2",
                            isFullscreen ? "flex-1" : "min-w-[150px]"
                        )}
                    >
                        <Trash2 className="w-3 h-3" />
                        {t('clearBtn')}
                    </Button>

                    <Button
                        onClick={onExport}
                        disabled={isProcessing || redactionsCount === 0}
                        className={cn(
                            "h-12 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2",
                            isFullscreen ? "flex-[2]" : "min-w-[200px]"
                        )}
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                <Shield className="w-4 h-4" />
                                {t('burnBtn')}
                            </>
                        )}
                    </Button>
                </div>
                
            </div>
        </div>
    );
};
