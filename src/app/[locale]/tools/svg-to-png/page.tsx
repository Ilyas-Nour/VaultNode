import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SvgToPngClient from '@/components/SvgToPngClient';
import { SoftwareSchema } from "@/components/SoftwareSchema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.svgToPng' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function SvgToPngPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.svgToPng' });
    
    return (
        <div className="py-20">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/svg-to-png`} 
            />
            <SvgToPngClient />
        </div>
    );
}
