/**
 * 🖋️ PRIVAFLOW | Secure PDF Redactor
 * ---------------------------------------------------------
 * A surgical privacy tool designed to physically destroy 
 * sensitive data in PDF documents via raster-flattening.
 * 
 * Re-engineered with Coordinate Neutrality & Modular Engine.
 */

"use client";

import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { FileUp, Eraser, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { cn } from "@/lib/utils";

// Modules
import { useRedactor } from "@/hooks/use-redactor";
import { RedactorWorkspace } from "./redactor/RedactorWorkspace";
import { RedactorHeader } from "./redactor/RedactorHeader";
import { RedactorFooter } from "./redactor/RedactorFooter";

const UI_RENDER_SCALE = 1.6;
const SECURE_EXPORT_SCALE = 3.2; 
const JPEG_QUALITY = 0.96;

const RedactorTool = memo(() => {
    const t = useTranslations('Tools.redact');
    const commonT = useTranslations('Tools.common');
    
    // 🧠 Core Engine
    const {
        file,
        redactions,
        isProcessing,
        loadFile,
        reset,
        addRedaction,
        clearRedactions,
        renderPage,
        burnAndExport
    } = useRedactor();

    const [isFullscreen, setIsFullscreen] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles[0]) loadFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    return (
        <AnimatePresence mode="wait">
            {!file ? (
                <motion.div
                    key="landing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <ToolContainer
                        title={t('title')}
                        description={t('description')}
                        icon={Eraser}
                        category="vault"
                        toolId="redactor"
                        settingsContent={
                            <div className="space-y-10">
                                <div className="space-y-4 text-center py-10 opacity-40">
                                    <div className="w-12 h-12 border-2 border-dashed border-zinc-800 rounded-full mx-auto flex items-center justify-center">
                                        <FileUp className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                                        {t('howItWorks.step1.description')}
                                    </p>
                                </div>
                            </div>
                        }
                        howItWorks={[
                            { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.description') },
                            { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.description') },
                            { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.description') }
                        ]}
                    >
                        <div 
                            {...getRootProps()} 
                            className={cn(
                                "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-24 gap-4",
                                isDragActive ? "border-white/40 bg-white/[0.03]" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                            )}
                        >
                            <input {...getInputProps()} />
                            <FileUp className={cn("w-12 h-12 mb-2", isDragActive ? "text-white" : "text-zinc-600")} />
                            <div className="text-center">
                                <p className="text-xl font-black text-white uppercase tracking-widest">
                                    {isDragActive ? commonT('dropAnywhere') : t('dropTitle')}
                                </p>
                                <p className="text-xs text-zinc-600 mt-2 uppercase tracking-widest font-bold">{t('dropDesc')}</p>
                            </div>
                        </div>
                    </ToolContainer>
                </motion.div>
            ) : (
                <motion.div 
                    key="editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <ToolContainer
                        title={t('title')}
                        description={t('description')}
                        icon={Eraser}
                        category="vault"
                        toolId="redactor"
                        settingsContent={null}
                    >
                        <div className={cn(
                            "flex flex-col transition-all duration-300",
                            isFullscreen 
                                ? "fixed inset-0 z-[9999] bg-black items-center justify-center" 
                                : "w-full h-[70vh] min-h-[500px] border border-zinc-800 rounded-lg overflow-hidden relative bg-black mt-8"
                        )}>
                            
                            <AnimatePresence>
                                {isFullscreen && (
                                    <RedactorHeader 
                                        fileName={file.name}
                                        redactionsCount={redactions.length}
                                        onReset={reset}
                                        t={t}
                                        commonT={commonT}
                                    />
                                )}
                            </AnimatePresence>

                            <Button 
                                variant="outline"
                                size="icon"
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className={cn(
                                    "absolute z-[50] bg-black/50 backdrop-blur-md border border-zinc-700 hover:bg-zinc-800 text-white transition-all",
                                    isFullscreen ? "top-20 right-8" : "top-4 right-4"
                                )}
                            >
                                {isFullscreen ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4" />}
                            </Button>

                            <RedactorWorkspace 
                                file={file}
                                redactions={redactions}
                                onAddRedaction={addRedaction}
                                renderPage={renderPage}
                                isFullscreen={isFullscreen}
                            />

                            <RedactorFooter 
                                isFullscreen={isFullscreen}
                                isProcessing={isProcessing}
                                redactionsCount={redactions.length}
                                onClear={clearRedactions}
                                onExport={() => burnAndExport(SECURE_EXPORT_SCALE, JPEG_QUALITY)}
                                onReset={reset}
                                t={t}
                                commonT={commonT}
                            />
                        </div>
                    </ToolContainer>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

RedactorTool.displayName = 'RedactorTool';

export default RedactorTool;
