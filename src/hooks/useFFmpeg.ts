import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Use standard unpkg URLs for FFmpeg core
const CORE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js';
const WASM_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm';

export const useFFmpeg = () => {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const ffmpegRef = useRef(new FFmpeg());

    const load = useCallback(async () => {
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('progress', ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        await ffmpeg.load({
            coreURL: await toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js', 'text/javascript'),
            wasmURL: await toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm', 'application/wasm'),
        });

        setLoaded(true);
    }, []);

    return {
        ffmpeg: ffmpegRef.current,
        loaded,
        progress,
        load,
    };
};
