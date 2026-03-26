import type { Metadata } from "next";
import HeicToJpgClient from "@/components/HeicToJpgClient";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.heicToJpg' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function HeicToJpgPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.heicToJpg' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://vaultnode.com/${locale}` },
        { name: 'Media', item: `https://vaultnode.com/${locale}/tools?category=media` },
        { name: t('title'), item: `https://vaultnode.com/${locale}/tools/heic-to-jpg` }
    ];

    const visualBreadcrumbs = [
        { label: 'Media', href: '/tools?category=media' },
        { label: t('title'), href: `/tools/heic-to-jpg`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://vaultnode.com/${locale}/tools/heic-to-jpg`} 
                category="MultimediaApplication"
                subCategory="Photo Transcoder"
                featureList={['HEIC to JPG transcoding', 'Local Processing', 'Zero-Upload Privacy']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <HeicToJpgClient />
        </div>
    );
}
