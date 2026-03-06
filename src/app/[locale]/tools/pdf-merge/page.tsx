import type { Metadata } from "next";
import PdfMergeTool from "@/components/PdfMergeTool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfMerge' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function PdfMergePage() {
    return <PdfMergeTool />;
}
