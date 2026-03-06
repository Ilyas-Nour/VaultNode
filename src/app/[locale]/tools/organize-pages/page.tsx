import type { Metadata } from "next";
import OrganizeTool from "@/components/OrganizeTool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.organizePages' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function OrganizePagesPage() {
    return <OrganizeTool />;
}
