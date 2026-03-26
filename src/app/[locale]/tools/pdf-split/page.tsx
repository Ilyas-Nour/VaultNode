import type { Metadata } from "next";
import PdfSplitTool from "@/components/PdfSplitTool";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfSplit' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function PdfSplitPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfSplit' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://vaultnode.com/${locale}` },
        { name: 'Documents', item: `https://vaultnode.com/${locale}/tools?category=documents` },
        { name: t('title'), item: `https://vaultnode.com/${locale}/tools/pdf-split` }
    ];

    const visualBreadcrumbs = [
        { label: 'Documents', href: '/tools?category=documents' },
        { label: t('title'), href: `/tools/pdf-split`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://vaultnode.com/${locale}/tools/pdf-split`} 
                category="OfficeApplication"
                subCategory="PDF Splitter"
                featureList={['Local PDF Splitting', 'Zero-Upload Privacy', 'Precise Page Extraction']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <PdfSplitTool />
        </div>
    );
}
