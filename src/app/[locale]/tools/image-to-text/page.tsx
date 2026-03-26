import type { Metadata } from "next";
import ImageToTextTool from "@/components/ImageToTextTool";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.imageToText' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function ImageToTextPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.imageToText' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://privaflow.com/${locale}` },
        { name: 'Media', item: `https://privaflow.com/${locale}/tools?category=media` },
        { name: t('title'), item: `https://privaflow.com/${locale}/tools/image-to-text` }
    ];

    const visualBreadcrumbs = [
        { label: 'Media', href: '/tools?category=media' },
        { label: t('title'), href: `/tools/image-to-text`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/image-to-text`} 
                category="MultimediaApplication"
                subCategory="OCR Tool"
                featureList={['Local OCR Engine', 'Zero-Upload Privacy', 'Fast Text Extraction']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <ImageToTextTool />
        </div>
    );
}
