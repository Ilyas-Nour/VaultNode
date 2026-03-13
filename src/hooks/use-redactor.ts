"use client";

import { useState, useCallback, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

export interface NormalizedBox {
    x: number; // 0.0 to 1.0 (Percentage of page width)
    y: number; // 0.0 to 1.0 (Percentage of page height)
    width: number;
    height: number;
}

export const useRedactor = () => {
    const [file, setFile] = useState<File | null>(null);
    const [redactions, setRedactions] = useState<NormalizedBox[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const renderTaskRef = useRef<any>(null);

    const loadFile = useCallback((newFile: File) => {
        setFile(newFile);
        setRedactions([]);
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

    const reset = useCallback(() => {
        setFile(null);
        setRedactions([]);
        setIsProcessing(false);
        if (renderTaskRef.current) renderTaskRef.current.cancel();
    }, []);

    const addRedaction = useCallback((box: NormalizedBox) => {
        if (Math.abs(box.width) < 0.001 || Math.abs(box.height) < 0.001) return;
        setRedactions(prev => [...prev, box]);
    }, []);

    const clearRedactions = useCallback(() => setRedactions([]), []);

    const renderPage = useCallback(async (
        pdfFile: File,
        canvas: HTMLCanvasElement,
        targetWidth: number,
        targetHeight: number
    ) => {
        try {
            if (renderTaskRef.current) renderTaskRef.current.cancel();

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1 });

            const scaleX = targetWidth / viewport.width;
            const scaleY = targetHeight / viewport.height;
            const scale = Math.min(scaleX, scaleY);

            const dpr = window.devicePixelRatio || 1;
            const renderViewport = page.getViewport({ scale: scale * dpr });
            
            canvas.width = renderViewport.width;
            canvas.height = renderViewport.height;
            canvas.style.width = `${viewport.width * scale}px`;
            canvas.style.height = `${viewport.height * scale}px`;

            const ctx = canvas.getContext("2d");
            if (!ctx) return { scale: 0, viewport };

            renderTaskRef.current = page.render({ 
                canvasContext: ctx, 
                canvas,
                viewport: renderViewport 
            });
            await renderTaskRef.current.promise;
            renderTaskRef.current = null;

            return { scale, viewport };
        } catch (err: any) {
            if (err.name === 'RenderingCancelledException') return null;
            throw err;
        }
    }, []);

    const burnAndExport = useCallback(async (exportScale: number, quality: number) => {
        if (!file || redactions.length === 0) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: exportScale });

            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context failure");

            await page.render({ canvasContext: ctx, canvas, viewport }).promise;

            // Apply redactions using relative math
            ctx.fillStyle = "black";
            redactions.forEach(box => {
                ctx.fillRect(
                    box.x * viewport.width,
                    box.y * viewport.height,
                    box.width * viewport.width,
                    box.height * viewport.height
                );
            });

            const imgData = canvas.toDataURL("image/jpeg", quality);
            const pdfDoc = await PDFDocument.create();
            const originalPdf = await PDFDocument.load(arrayBuffer);
            const originalPage = originalPdf.getPages()[0];
            const { width, height } = originalPage.getSize();

            const newPage = pdfDoc.addPage([width, height]);
            const redactedImg = await pdfDoc.embedJpg(imgData);
            newPage.drawImage(redactedImg, { x: 0, y: 0, width, height });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `redacted-${file.name}`;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup with a small delay to ensure browser initiates the download
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (err) {
            console.error("Export failure:", err);
            throw err;
        } finally {
            setIsProcessing(false);
        }
    }, [file, redactions]);

    return {
        file,
        redactions,
        isProcessing,
        loadFile,
        reset,
        addRedaction,
        clearRedactions,
        renderPage,
        burnAndExport
    };
};
