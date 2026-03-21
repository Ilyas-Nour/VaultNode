import type { Metadata } from "next";
import RepairTool from "@/components/RepairTool";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.repair' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function RepairPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.repair' });
    
    return (
        <>
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/repair`} 
            />
            <RepairTool />
        </>
    );
}

