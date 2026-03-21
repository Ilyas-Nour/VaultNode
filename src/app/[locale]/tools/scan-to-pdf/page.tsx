import type { Metadata } from "next";
import ScanToPdfClient from "@/components/ScanToPdfClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.scanToPdf' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["scan to pdf", "camera to pdf", "webcam scan", "local document scanner", "zero upload scan to pdf", "privacy scanner"]
    };
}

export default function ScanToPdfPage() {
    return <ScanToPdfClient />;
}
