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
import { useTranslations } from 'next-intl';
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

/**
 * 🎬 MediaConverterTool Component
 * The primary utility for local media format conversion and trimming.
 */
const MediaConverterTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations('Tools.mediaConverter');
    const { ffmpeg, loaded, progress, load } = useFFmpeg();

    // 📂 STATE ORCHESTRATION
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
    const howItWorks = useMemo(() => [
        { title: "Binary Transcoding", description: "V8-powered FFmpeg binaries running directly in your CPU cycles." },
        { title: "SharedArrayBuffer", description: "Multithreaded acceleration for desktop-class performance." },
        { title: "Privacy First", description: "Zero-server footprint. Your videos are processed safely on your device." }
    ], []);

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
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Operation Mode</span>
                        <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
                            {[
                                { id: 'mp3', icon: Music, label: 'MP3' },
                                { id: 'wav', icon: Volume2, label: 'WAV' },
                                { id: 'trim', icon: Scissors, label: 'Trim' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setMode(item.id as any)}
                                    className={cn(
                                        "py-3 rounded-xl flex flex-col items-center gap-1 transition-all",
                                        mode === item.id
                                            ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/10"
                                            : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                                    )}
                                >
                                    <item.icon className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase italic">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 🎚️ TRIM RANGE SELECTOR */}
                    {mode === 'trim' && duration > 0 && (
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                <span>Range Selection</span>
                                <span className="text-emerald-500">{startTime.toFixed(1)}s - {endTime.toFixed(1)}s</span>
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
                                className="py-4"
                            />
                        </div>
                    )}

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={processMedia}
                            disabled={isProcessing || !loaded || !file}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 me-2" />}
                            {isProcessing ? t('processing') : t('convertBtn')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetTool}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <RefreshCw className="w-4 h-4 me-2" />
                            Reset Node
                        </Button>
                    </div>

                    {/* 📊 WASM STATUS REPORT */}
                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">FFmpeg.wasm Active</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-black uppercase text-zinc-600">
                                <span>WASM Status</span>
                                <span className={loaded ? "text-emerald-500" : "text-amber-500"}>{loaded ? "Ready" : "Loading..."}</span>
                            </div>
                            <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-500"
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
            <div className="relative min-h-[450px] flex flex-col items-center justify-center p-6 md:p-8">
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
                                        "w-full aspect-video border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative",
                                        isDragActive ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                                        <Video className={cn("w-8 h-8", isDragActive ? "text-emerald-500" : "text-zinc-500")} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">{t('dropTitle')}</h3>
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">{t('dropDesc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full h-full flex flex-col items-center space-y-8"
                        >
                            {/* 🎥 PREVIEW VIEWPORT */}
                            <div className="relative group w-full max-w-3xl aspect-video bg-zinc-900 rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl">
                                {previewUrl && file.type.startsWith('video/') ? (
                                    <video
                                        ref={videoRef}
                                        src={previewUrl}
                                        className="w-full h-full object-contain"
                                        onTimeUpdate={(e) => {
                                            const curr = (e.target as HTMLVideoElement).currentTime;
                                            if (mode === 'trim' && curr >= endTime) {
                                                (e.target as HTMLVideoElement).currentTime = startTime;
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-zinc-700">
                                        <Music className="w-16 h-16 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{file.name}</span>
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={togglePlay}
                                        className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-2xl shadow-emerald-500/20"
                                    >
                                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
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
                                        className="w-full max-w-2xl space-y-4"
                                    >
                                        <div className="flex justify-between items-center px-4">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse italic">Engaging Transcoder</span>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-500">{progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                                            <motion.div
                                                className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 📟 HARDWARE FLOW HUB */}
                            <div className="flex items-center gap-8 px-10 py-5 bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-xl">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Hardware Node</span>
                                    <HardDrive className="w-5 h-5 text-zinc-500" />
                                </div>
                                <RefreshCw className={cn("w-5 h-5 text-emerald-500", isProcessing && "animate-spin")} />
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Vault Secure Out</span>
                                    <Zap className="w-5 h-5 text-emerald-500" />
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
