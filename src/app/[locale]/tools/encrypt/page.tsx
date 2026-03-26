import type { Metadata } from "next";
import TextEncryptorTool from "@/components/TextEncryptorTool";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.encrypt' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function TextEncryptorPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.encrypt' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://privaflow.com/${locale}` },
        { name: 'Privacy Tools', item: `https://privaflow.com/${locale}/tools?category=vault` },
        { name: t('title'), item: `https://privaflow.com/${locale}/tools/encrypt` }
    ];

    const visualBreadcrumbs = [
        { label: 'Privacy Tools', href: '/tools?category=vault' },
        { label: t('title'), href: `/tools/encrypt`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://privaflow.com/${locale}/tools/encrypt`} 
                category="SecurityApplication"
                subCategory="Cryptography Tool"
                featureList={['AES-256-GCM Encryption', 'Zero-Server Interaction', 'Browser-Native WebCrypto API']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <TextEncryptorTool />
        </div>
    );
}

