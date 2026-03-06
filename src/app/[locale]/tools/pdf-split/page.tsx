import type { Metadata } from "next";
import PdfSplitTool from "@/components/PdfSplitTool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfSplit' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function PdfSplitPage() {
    return <PdfSplitTool />;
}
