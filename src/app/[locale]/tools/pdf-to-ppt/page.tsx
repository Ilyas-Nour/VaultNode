import type { Metadata } from "next";
import PdfToPptClient from "@/components/PdfToPptClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfToPpt' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["pdf to ppt", "pdf to powerpoint", "convert pdf to slides", "local powerpoint converter", "zero upload pdf to ppt", "privacy presentation"]
    };
}

export default function PdfToPptPage() {
    return <PdfToPptClient />;
}
