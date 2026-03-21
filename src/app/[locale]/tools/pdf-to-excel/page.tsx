import type { Metadata } from "next";
import PdfToExcelClient from "@/components/PdfToExcelClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfToExcel' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["pdf to excel", "pdf to xlsx", "extract tables from pdf", "local spreadsheet converter", "zero upload pdf to excel", "privacy converter"]
    };
}

export default function PdfToExcelPage() {
    return <PdfToExcelClient />;
}
