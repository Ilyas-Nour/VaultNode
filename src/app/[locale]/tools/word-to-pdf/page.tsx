import type { Metadata } from "next";
import WordToPdfClient from "@/components/WordToPdfClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.wordToPdf' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["word to pdf", "docx to pdf", "convert word to pdf", "local word converter", "zero upload word to pdf", "privacy converter"]
    };
}

export default function WordToPdfPage() {
    return <WordToPdfClient />;
}
