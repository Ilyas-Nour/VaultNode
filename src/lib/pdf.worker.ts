/**
 * VaultNode PDF Worker
 * High-performance PDF merging logic using pdf-lib.
 * Runs in a separate thread to keep the UI snappy.
 */

import { PDFDocument } from 'pdf-lib';

self.onmessage = async (event: MessageEvent) => {
    const { type, payload } = event.data;

    if (type === 'MERGE_PDFS') {
        try {
            const { fileBuffers } = payload;

            // Create a brand new PDF document
            const mergedPdf = await PDFDocument.create();

            for (const buffer of fileBuffers) {
                // Load the individual PDF
                const donorPdf = await PDFDocument.load(buffer);

                // Copy all pages from donor to the merged document
                const pages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());

                pages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            // Serialize the PDFDocument to bytes (a Uint8Array)
            const mergedPdfBytes = await mergedPdf.save();

            // Send the result back as a transferable object if possible, 
            // but for simplicity here we just post it back.
            self.postMessage({
                type: 'MERGE_SUCCESS',
                payload: { mergedPdfBytes }
            });

        } catch (error) {
            self.postMessage({
                type: 'MERGE_ERROR',
                payload: { message: error instanceof Error ? error.message : 'Failed to merge PDFs' }
            });
        }
    }
};
