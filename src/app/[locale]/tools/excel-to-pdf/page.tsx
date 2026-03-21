import type { Metadata } from "next";
import ExcelToPdfClient from "@/components/ExcelToPdfClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.excelToPdf' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["excel to pdf", "xlsx to pdf", "convert excel to pdf", "local spreadsheet converter", "zero upload excel to pdf", "privacy converter"]
    };
}

export default function ExcelToPdfPage() {
    return <ExcelToPdfClient />;
}
