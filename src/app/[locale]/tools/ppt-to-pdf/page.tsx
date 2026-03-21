import type { Metadata } from "next";
import PptToPdfClient from "@/components/PptToPdfClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pptToPdf' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["ppt to pdf", "powerpoint to pdf", "convert ppt to pdf", "local presentation converter", "zero upload powerpoint to pdf", "privacy converter"]
    };
}

export default function PptToPdfPage() {
    return <PptToPdfClient />;
}
