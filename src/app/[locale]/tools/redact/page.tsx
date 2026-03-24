import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import dynamic from "next/dynamic";

const RedactClient = dynamic(() => import("@/components/RedactClient"), {
    loading: () => <div className="w-full h-[400px] flex items-center justify-center bg-zinc-900/50 rounded-2xl animate-pulse" />
});

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

