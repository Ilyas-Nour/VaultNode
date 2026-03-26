import type { Metadata } from "next";
import PdfMergeTool from "@/components/PdfMergeTool";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfMerge' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function PdfMergePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.pdfMerge' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://privaflow.com/${locale}` },
        { name: 'Documents', item: `https://privaflow.com/${locale}/tools?category=documents` },
        { name: t('title'), item: `https://privaflow.com/${locale}/tools/pdf-merge` }
    ];

    const visualBreadcrumbs = [
        { label: 'Documents', href: '/tools?category=documents' },
        { label: t('title'), href: `/tools/pdf-merge`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/pdf-merge`} 
                category="OfficeApplication"
                subCategory="PDF Joiner"
                featureList={['Local PDF Merging', 'Zero-Upload Privacy', 'Fast Client-side Combining']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <PdfMergeTool />
        </div>
    );
}
