import type { Metadata } from "next";
import EnhancerTool from "@/components/EnhancerTool";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.enhancer' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function EnhancerPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.enhancer' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://privaflow.com/${locale}` },
        { name: 'Media', item: `https://privaflow.com/${locale}/tools?category=media` },
        { name: t('title'), item: `https://privaflow.com/${locale}/tools/enhancer` }
    ];

    const visualBreadcrumbs = [
        { label: 'Media', href: '/tools?category=media' },
        { label: t('title'), href: `/tools/enhancer`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/enhancer`} 
                category="MultimediaApplication"
                subCategory="Image Enhancement Tool"
                featureList={['AI Sharpening', 'Local Filtering', 'Privacy-Preserved Restoration']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <EnhancerTool />
        </div>
    );
}

