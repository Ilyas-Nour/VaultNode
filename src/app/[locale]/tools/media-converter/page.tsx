import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://privaflow.com/${locale}` },
        { name: 'Media', item: `https://privaflow.com/${locale}/tools?category=media` },
        { name: t('title'), item: `https://privaflow.com/${locale}/tools/media-converter` }
    ];

    const visualBreadcrumbs = [
        { label: 'Media', href: '/tools?category=media' },
        { label: t('title'), href: `/tools/media-converter`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/media-converter`} 
                category="MultimediaApplication"
                subCategory="Video & Audio Transcoder"
                featureList={['FFmpeg.wasm Engine', 'Local Transcoding', 'Zero-Upload Privacy']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <div className="py-20">
                <MediaConverterClient />
            </div>
        </div>
    );
}
