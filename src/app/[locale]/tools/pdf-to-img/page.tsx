import type { Metadata } from "next";
import PdfToImgClient from "@/components/PdfToImgClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfToImg' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["pdf to jpg", "pdf to image converter", "local pdf extraction", "secure pdf to zip", "browser pdf image", "offline pdf converter"]
    };
}

export default function PdfToImgPage() {
    return <PdfToImgClient />;
}
