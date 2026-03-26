import type { Metadata } from "next";
import WordToPdfClient from "@/components/WordToPdfClient";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.wordToPdf' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function WordToPdfPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.wordToPdf' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://vaultnode.com/${locale}` },
        { name: 'Documents', item: `https://vaultnode.com/${locale}/tools?category=documents` },
        { name: t('title'), item: `https://vaultnode.com/${locale}/tools/word-to-pdf` }
    ];

    const visualBreadcrumbs = [
        { label: 'Documents', href: '/tools?category=documents' },
        { label: t('title'), href: `/tools/word-to-pdf`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://vaultnode.com/${locale}/tools/word-to-pdf`} 
                category="OfficeApplication"
                subCategory="PDF Converter"
                featureList={['Local Word to PDF conversion', 'Zero-Upload Privacy', 'Clean Professional Output']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <WordToPdfClient />
        </div>
    );
}
