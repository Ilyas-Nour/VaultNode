import type { Metadata } from "next";
import NumberTool from "@/components/NumberTool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.numberPages' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function NumberPagesPage() {
    return <NumberTool />;
}
