import type { Metadata } from "next";
import TextToDocxClient from "@/components/TextToDocxClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.textToDocx' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["text to word", "text to docx", "convert txt to docx", "local text converter", "zero upload text to word", "privacy converter"]
    };
}

export default function TextToDocxPage() {
    return <TextToDocxClient />;
}
