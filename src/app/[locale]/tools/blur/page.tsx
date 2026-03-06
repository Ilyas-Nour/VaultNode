import type { Metadata } from "next";
import BlurTool from "@/components/BlurTool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.blur' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function BlurPage() {
    return <BlurTool />;
}
