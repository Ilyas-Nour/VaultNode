"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { NormalizedBox } from "@/hooks/use-redactor";
import { cn } from "@/lib/utils";

interface RedactorWorkspaceProps {
    file: File;
    redactions: NormalizedBox[];
    onAddRedaction: (box: NormalizedBox) => void;
    renderPage: (file: File, canvas: HTMLCanvasElement, width: number, height: number) => Promise<{ scale: number; viewport: any } | null | undefined>;
    isFullscreen: boolean;
}

export const RedactorWorkspace: React.FC<RedactorWorkspaceProps> = ({
    file,
    redactions,
    onAddRedaction,
    renderPage,
    isFullscreen
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentBox, setCurrentBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
    const [renderInfo, setRenderInfo] = useState<{ scale: number; viewport: any } | null>(null);

    const redrawOverlay = useCallback(() => {
        const canvas = drawCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 0, 0.98)";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;

        redactions.forEach(box => {
            ctx.fillRect(
                box.x * canvas.width,
                box.y * canvas.height,
                box.width * canvas.width,
                box.height * canvas.height
            );
            ctx.strokeRect(
                box.x * canvas.width,
                box.y * canvas.height,
                box.width * canvas.width,
                box.height * canvas.height
            );
        });

        if (currentBox) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.strokeRect(currentBox.x, currentBox.y, currentBox.w, currentBox.h);
        }
    }, [redactions, currentBox]);

    const handleResize = useCallback(async () => {
        if (!containerRef.current || !pdfCanvasRef.current) return;
        
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        
        const rawW = isFullscreen ? winW : Math.min(winW, 1280);
        const rawH = isFullscreen ? winH : Math.max(500, winH * 0.7);
        
        const hPad = isFullscreen ? 64 : 48;
        const vPad = isFullscreen ? 160 : 120;

        const info = await renderPage(file, pdfCanvasRef.current, rawW - hPad, rawH - vPad);
        if (info) {
            setRenderInfo(info);
            if (drawCanvasRef.current) {
                drawCanvasRef.current.width = pdfCanvasRef.current.width;
                drawCanvasRef.current.height = pdfCanvasRef.current.height;
                drawCanvasRef.current.style.width = pdfCanvasRef.current.style.width;
                drawCanvasRef.current.style.height = pdfCanvasRef.current.style.height;
            }
        }
    }, [file, isFullscreen, renderPage]);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    useEffect(() => {
        redrawOverlay();
    }, [redrawOverlay, redactions, currentBox]);

    const getMousePos = (e: React.MouseEvent) => {
        const rect = drawCanvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        setIsDrawing(true);
        setCurrentBox({ x: pos.x, y: pos.y, w: 0, h: 0 });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !currentBox) return;
        const pos = getMousePos(e);
        setCurrentBox({ ...currentBox, w: pos.x - currentBox.x, h: pos.y - currentBox.y });
    };

    const onMouseUp = () => {
        if (isDrawing && currentBox && drawCanvasRef.current) {
            const canvas = drawCanvasRef.current;
            const logicalWidth = parseFloat(canvas.style.width);
            const logicalHeight = parseFloat(canvas.style.height);

            const x = currentBox.w > 0 ? currentBox.x : currentBox.x + currentBox.w;
            const y = currentBox.h > 0 ? currentBox.y : currentBox.y + currentBox.h;
            const w = Math.abs(currentBox.w);
            const h = Math.abs(currentBox.h);

            onAddRedaction({
                x: x / logicalWidth,
                y: y / logicalHeight,
                width: w / logicalWidth,
                height: h / logicalHeight
            });
        }
        setIsDrawing(false);
        setCurrentBox(null);
    };

    return (
        <div 
            ref={containerRef}
            className={cn(
                "w-full overflow-auto scrollbar-hide flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black",
                isFullscreen ? "h-full pt-16 pb-24" : "h-[calc(100%-80px)] p-4"
            )}
        >
            <div dir="ltr" className="relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-zinc-800 bg-white shrink-0 mx-auto">
                <canvas ref={pdfCanvasRef} className="block" />
                <canvas
                    ref={drawCanvasRef}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    className="absolute top-0 left-0 touch-none cursor-crosshair"
                />
            </div>
        </div>
    );
};
