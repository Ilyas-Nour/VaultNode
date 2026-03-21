import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import MediaConverterClient from '@/components/MediaConverterClient';
import { SoftwareSchema } from "@/components/SoftwareSchema";

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
