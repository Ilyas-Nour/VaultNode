import type { Metadata } from "next";
import PdfToDocxClient from "@/components/PdfToDocxClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfToDocx' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["pdf to word", "pdf to docx", "extract text from pdf", "local pdf converter", "zero upload pdf to word", "privacy converter"]
    };
}

export default function PdfToDocxPage() {
    return <PdfToDocxClient />;
}
