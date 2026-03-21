import type { Metadata } from "next";
import RedactClient from "@/components/RedactClient";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.redact' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function RedactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.redact' });
    
    return (
        <>
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/redact`} 
            />
            <RedactClient />
        </>
    );
}

