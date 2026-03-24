import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SoftwareSchema } from "@/components/SoftwareSchema";
import dynamic from "next/dynamic";

const MediaConverterClient = dynamic(() => import('@/components/MediaConverterClient'), {
    loading: () => <div className="w-full h-[400px] flex items-center justify-center bg-zinc-900/50 rounded-2xl animate-pulse" />
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.mediaConverter' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function MediaConverterPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.mediaConverter' });
    
    return (
        <>
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/media-converter`} 
            />
            <div className="py-20">
                <MediaConverterClient />
            </div>
        </>
    );
}
