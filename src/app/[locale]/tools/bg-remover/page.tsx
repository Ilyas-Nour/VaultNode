import type { Metadata } from "next";
import BackgroundRemoverTool from "@/components/BackgroundRemoverTool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.bgRemover' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function BackgroundRemoverPage() {
    return <BackgroundRemoverTool />;
}
