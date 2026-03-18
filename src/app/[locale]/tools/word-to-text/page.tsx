import type { Metadata } from "next";
import DocxToTextClient from "@/components/DocxToTextClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.docxToText' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["word to text", "docx to txt", "extract text from docx", "local word converter", "zero upload word to text", "privacy converter"]
    };
}

export default function DocxToTextPage() {
    return <DocxToTextClient />;
}
