import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import dynamic from "next/dynamic";

const RedactClient = dynamic(() => import("@/components/RedactClient"), {
    loading: () => <div className="w-full h-[400px] flex items-center justify-center bg-zinc-900/50 rounded-2xl animate-pulse" />
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.redact' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function RedactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.redact' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://vaultnode.com/${locale}` },
        { name: 'Documents', item: `https://vaultnode.com/${locale}/tools?category=documents` },
        { name: t('title'), item: `https://vaultnode.com/${locale}/tools/redact` }
    ];

    const visualBreadcrumbs = [
        { label: 'Documents', href: '/tools?category=documents' },
        { label: t('title'), href: `/tools/redact`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://vaultnode.com/${locale}/tools/redact`} 
                category="OfficeApplication"
                subCategory="Privacy Tool"
                featureList={['Local PDF Redaction', 'Zero-Upload Privacy', 'Permanent Data Removal']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <RedactClient />
        </div>
    );
}
