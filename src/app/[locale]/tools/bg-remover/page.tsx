import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import dynamic from "next/dynamic";

const BackgroundRemoverTool = dynamic(() => import("@/components/BackgroundRemoverTool"), {
    loading: () => <div className="w-full h-[400px] flex items-center justify-center bg-zinc-900/50 rounded-2xl animate-pulse" />
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.bgRemover' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function BackgroundRemoverPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.bgRemover' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://vaultnode.com/${locale}` },
        { name: 'Media', item: `https://vaultnode.com/${locale}/tools?category=media` },
        { name: t('title'), item: `https://vaultnode.com/${locale}/tools/bg-remover` }
    ];

    const visualBreadcrumbs = [
        { label: 'Media', href: '/tools?category=media' },
        { label: t('title'), href: `/tools/bg-remover`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://vaultnode.com/${locale}/tools/bg-remover`} 
                category="MultimediaApplication"
                subCategory="Background Removal Tool"
                featureList={['Local AI Isolation', 'Zero-Upload Privacy', 'WASM-Powered Engine']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />
            
            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <BackgroundRemoverTool />
        </div>
    );
}

