/**
 * VaultNode Web Worker
 * This worker handles heavy PDF and image processing off the main thread
 * to ensure a smooth UI experience.
 */

import { PDFDocument } from 'pdf-lib';

// Placeholder for custom worker logic
self.onmessage = async (event: MessageEvent) => {
    const { type, payload } = event.data;

    try {
        switch (type) {
            case 'PROCESS_PDF':
                // Example: Get PDF page count without freezing UI
                const pdfDoc = await PDFDocument.load(payload.fileBuffer);
                const pageCount = pdfDoc.getPageCount();

                self.postMessage({
                    type: 'PDF_PROCESSED',
                    payload: { pageCount }
                });
                break;

            case 'COMPRESS_IMAGE':
                // Logic for browser-image-compression would go here
                self.postMessage({ type: 'IMAGE_COMPRESSED', payload: { success: true } });
                break;

            default:
                console.warn(`Unknown message type: ${type}`);
        }
    } catch (error) {
        self.postMessage({
            type: 'ERROR',
            payload: { message: error instanceof Error ? error.message : 'Unknown error' }
        });
    }
};
