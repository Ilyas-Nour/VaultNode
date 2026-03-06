/**
 * 🎬 PRIVAFLOW | Client-Side Media Transcoder
 * ---------------------------------------------------------
 * A high-performance, browser-native media engine powered by
 * FFmpeg.wasm. Performs bitstream manipulation and format
 * conversion without server-side processing.
 * 
 * Logic: WASM-Accelerated Binary Transcoding
 * Performance: Optimized (Memoized Callbacks & State)
 * Aesthetics: Media-Industrial / Emerald-Dark
 */

"use client";

import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
    Video, Music, Scissors, Download, Loader2,
    Play, Pause, Volume2, RefreshCw, Zap, HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';
import { ToolContainer } from '@/components/ToolContainer';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

/**
 * 🎬 MediaConverterTool Component
 * The primary utility for local media format conversion and trimming.
 */
const MediaConverterTool = memo(() => {
    const t = useTranslations('Tools.mediaConverter');
    const { ffmpeg, loaded, progress, load } = useFFmpeg();

    // 📂 STATE
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(10);
    const [duration, setDuration] = useState(0);
    const [mode, setMode] = useState<'mp3' | 'wav' | 'trim'>('mp3');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        load();
    }, [load]);

    /**
     * 📂 Drop Handler
     * Initializes the media stream and extracts metadata for UI synchronization.
     */
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));

            const video = document.createElement('video');
            video.src = URL.createObjectURL(selectedFile);
            video.onloadedmetadata = () => {
                setDuration(video.duration);
                setEndTime(Math.min(video.duration, 10));
            };
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
            'audio/mpeg': ['.mp3'],
            'video/webm': ['.webm']
        },
        multiple: false
    });

    /**
     * ⚡ WASM Transcoding Core
     * Executes FFmpeg commands in the browser's shared memory space.
     */
    const processMedia = useCallback(async () => {
        if (!file || !loaded) return;
        setIsProcessing(true);

        try {
            const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
            const outputName = mode === 'trim' ? 'output.mp4' : `output.${mode}`;

            await ffmpeg.writeFile(inputName, await fetchFile(file));

            let command: string[] = [];
            if (mode === 'mp3' || mode === 'wav') {
                command = ['-i', inputName, '-vn', '-acodec', mode === 'mp3' ? 'libmp3lame' : 'pcm_s16le', '-ar', '44100', '-ac', '2', outputName];
            } else if (mode === 'trim') {
                command = ['-i', inputName, '-ss', startTime.toString(), '-to', endTime.toString(), '-c', 'copy', outputName];
            }

            await ffmpeg.exec(command);

            const data = await ffmpeg.readFile(outputName) as Uint8Array;
            const blob = new Blob([new Uint8Array(data)], { type: mode === 'trim' ? 'video/mp4' : `audio/${mode}` });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vaultnode_${file.name.split('.')[0]}.${mode === 'trim' ? 'mp4' : mode}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Transcoding Error:", error);
        } finally {
            setIsProcessing(false);
        }
    }, [file, loaded, mode, ffmpeg, startTime, endTime]);

    const resetTool = useCallback(() => {
        setFile(null);
        setPreviewUrl(null);
        setDuration(0);
        setStartTime(0);
        setEndTime(10);
    }, []);

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, []);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = [
        {
            title: t('howItWorks.step1.title'),
            description: t('howItWorks.step1.desc')
        },
        {
            title: t('howItWorks.step2.title'),
            description: t('howItWorks.step2.desc')
        },
        {
            title: t('howItWorks.step3.title'),
            description: t('howItWorks.step3.desc')
        }
    ];

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={Video}
            category="media"
            toolId="media-converter"
            settingsContent={
                <div className="space-y-6">
                    {/* 🔘 OPERATION MODE SELECTOR */}
                    <div className="space-y-3.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">{t('operationMode')}</span>
                        <div className="grid grid-cols-3 gap-2 p-1.5 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-inner">
                            {[
                                { id: 'mp3', icon: Music, label: 'MP3' },
                                { id: 'wav', icon: Volume2, label: 'WAV' },
                                { id: 'trim', icon: Scissors, label: 'Trim' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setMode(item.id as any)}
                                    className={cn(
                                        "py-3.5 rounded-xl flex flex-col items-center gap-1.5 transition-all",
                                        mode === item.id
                                            ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/10"
                                            : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase italic tracking-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 🎚️ TRIM RANGE SELECTOR */}
                    {mode === 'trim' && duration > 0 && (
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">
                                <span>{t('rangeSelection')}</span>
                                <span className="text-emerald-500 tabular-nums">{startTime.toFixed(1)}s - {endTime.toFixed(1)}s</span>
                            </div>
                            <Slider
                                value={[startTime, endTime]}
                                min={0}
                                max={duration}
                                step={0.1}
                                onValueChange={(val) => {
                                    setStartTime(val[0]);
                                    setEndTime(val[1]);
                                }}
                                className="py-6"
                            />
                        </div>
                    )}

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3.5 pt-4">
                        <Button
                            onClick={processMedia}
                            disabled={isProcessing || !loaded || !file}
                            className="w-full h-14 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : t('downloadBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[11px] font-black uppercase tracking-widest italic rounded-xl"
                        >
                            <RefreshCw className="w-4 h-4 me-2" />
                            {t('resetBtn')}
                        </Button>
                    </div>

                    {/* 📊 WASM STATUS REPORT */}
                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-4 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Zap className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{t('status.active')}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                <span>{t('status.label')}</span>
                                <span className={loaded ? "text-emerald-500" : "text-amber-500"}>{loaded ? t('status.ready') : t('status.loading')}</span>
                            </div>
                            <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                                <motion.div
                                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: loaded ? "100%" : "20%" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="relative min-h-[420px] flex flex-col items-center justify-center p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-2xl"
                        >
                            {/* 🛸 DROPZONE ARCHITECTURE */}
                            <div className="relative group/dropzone w-full">
                                <AnimatePresence>
                                    {isDragActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -inset-1 conic-gradient-vault animate-pulse-conic rounded-[2.7rem] blur-md -z-10"
                                        />
                                    )}
                                </AnimatePresence>
                                <div
                                    {...getRootProps()}
                                    className={cn(
                                        "w-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 py-10 gap-4",
                                        isDragActive
                                            ? "border-white/40 bg-white/[0.03]"
                                            : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <Video className={cn("w-8 h-8", isDragActive ? "text-white" : "text-zinc-600")} />
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white uppercase tracking-widest">
                                            {isDragActive ? t('dropActive') : t('dropTitle')}
                                        </p>
                                        <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">MP4 · MOV · MP3 · WEBM</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full h-full flex flex-col items-center space-y-10"
                        >
                            {/* 🎥 PREVIEW VIEWPORT */}
                            <div className="relative group w-full max-w-3xl aspect-video bg-zinc-950 rounded-[2.5rem] border border-zinc-800/80 overflow-hidden shadow-2xl backdrop-blur-xl">
                                {previewUrl && file.type.startsWith('video/') ? (
                                    <video
                                        ref={videoRef}
                                        src={previewUrl}
                                        className="w-full h-full object-contain mix-blend-lighten p-2"
                                        onTimeUpdate={(e) => {
                                            const curr = (e.target as HTMLVideoElement).currentTime;
                                            if (mode === 'trim' && curr >= endTime) {
                                                (e.target as HTMLVideoElement).currentTime = startTime;
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-zinc-800">
                                        <div className="relative">
                                            <div className="absolute -inset-8 bg-zinc-900 blur-3xl rounded-full" />
                                            <Music className="w-20 h-20 animate-pulse relative" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 relative">{file.name}</span>
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto backdrop-blur-[2px]">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={togglePlay}
                                        className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-[0_0_50px_rgba(16,185,129,0.4)] transition-all hover:scale-110 active:scale-95"
                                    >
                                        {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1.5" />}
                                    </Button>
                                </div>
                            </div>

                            {/* 📟 PROGRESS MONITOR */}
                            <AnimatePresence>
                                {isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full max-w-2xl space-y-5 px-4"
                                    >
                                        <div className="flex justify-between items-center px-4 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Loader2 className="w-4 h-4 text-emerald-500 animate-spin relative" />
                                                    <div className="absolute -inset-1 bg-emerald-500/20 blur-sm rounded-full animate-pulse" />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 animate-pulse italic">{t('engaging')}</span>
                                            </div>
                                            <span className="text-[11px] font-black text-emerald-500 tabular-nums">{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
                                            <motion.div
                                                className="h-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 📟 HARDWARE FLOW HUB */}
                            <div className="flex items-center gap-12 px-12 py-6 bg-zinc-900/90 border border-zinc-800 rounded-full shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:bg-zinc-900">
                                <div className="flex flex-col items-center gap-2 transition-all hover:scale-105">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">{t('hardwareNode')}</span>
                                    <HardDrive className="w-6 h-6 text-zinc-500" />
                                </div>
                                <div className="relative">
                                    <RefreshCw className={cn("w-6 h-6 text-emerald-500 transition-all", isProcessing ? "animate-spin" : "opacity-30")} />
                                    {isProcessing && <div className="absolute -inset-3 bg-emerald-500/10 blur-xl rounded-full animate-pulse" />}
                                </div>
                                <div className="flex flex-col items-center gap-2 transition-all hover:scale-105">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">{t('secureOut')}</span>
                                    <Zap className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToolContainer>
    );
});

MediaConverterTool.displayName = 'MediaConverterTool';

export default MediaConverterTool;
