import type { Metadata } from "next";
import StampTool from "@/components/StampTool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.stamp' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function StampPage() {
    return <StampTool />;
}
