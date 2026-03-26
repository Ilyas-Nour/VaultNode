import type { Metadata } from "next";
import DocxToTextClient from "@/components/DocxToTextClient";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.docxToText' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function WordToTextPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.docxToText' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://vaultnode.com/${locale}` },
        { name: 'Documents', item: `https://vaultnode.com/${locale}/tools?category=documents` },
        { name: t('title'), item: `https://vaultnode.com/${locale}/tools/word-to-text` }
    ];

    const visualBreadcrumbs = [
        { label: 'Documents', href: '/tools?category=documents' },
        { label: t('title'), href: `/tools/word-to-text`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://vaultnode.com/${locale}/tools/word-to-text`} 
                category="OfficeApplication"
                subCategory="Text Extractor"
                featureList={['Local Word to Text extraction', 'Zero-Upload Privacy', 'Clean Markdown/Text Output']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <DocxToTextClient />
        </div>
    );
}
