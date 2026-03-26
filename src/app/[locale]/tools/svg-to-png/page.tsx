import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SvgToPngClient from '@/components/SvgToPngClient';
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://vaultnode.com/${locale}` },
        { name: 'Media', item: `https://vaultnode.com/${locale}/tools?category=media` },
        { name: t('title'), item: `https://vaultnode.com/${locale}/tools/svg-to-png` }
    ];

    const visualBreadcrumbs = [
        { label: 'Media', href: '/tools?category=media' },
        { label: t('title'), href: `/tools/svg-to-png`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://vaultnode.com/${locale}/tools/svg-to-png`} 
                category="MultimediaApplication"
                subCategory="Vector Converter"
                featureList={['Local SVG to PNG conversion', 'Zero-Upload Privacy', 'High Resolution Export']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <div className="py-20">
                <SvgToPngClient />
            </div>
        </div>
    );
}
