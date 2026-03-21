import type { Metadata } from "next";
import HtmlToPdfClient from "@/components/HtmlToPdfClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.htmlToPdf' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["html to pdf", "convert html to pdf document", "local html converter", "zero upload html to pdf", "privacy converter", "web to pdf"]
    };
}

export default function HtmlToPdfPage() {
    return <HtmlToPdfClient />;
}
