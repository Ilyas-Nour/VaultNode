import type { Metadata } from "next";
import RepairTool from "@/components/RepairTool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.repair' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function RepairPage() {
    return <RepairTool />;
}
