import type { Metadata } from "next";
import PasswordClient from "@/components/PasswordClient";
import { getTranslations } from "next-intl/server";
import { SoftwareSchema } from "@/components/SoftwareSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.password' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', ')
    };
}

export default async function PasswordPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.password' });
    
    const breadcrumbItems = [
        { name: 'Vault', item: `https://vaultnode.com/${locale}` },
        { name: 'Privacy Tools', item: `https://vaultnode.com/${locale}/tools?category=vault` },
        { name: t('title'), item: `https://vaultnode.com/${locale}/tools/password` }
    ];

    const visualBreadcrumbs = [
        { label: 'Privacy Tools', href: '/tools?category=vault' },
        { label: t('title'), href: `/tools/password`, active: true }
    ];

    return (
        <div className="w-full">
            <SoftwareSchema 
                name={t('title')} 
                description={t('description')} 
                url={`https://vaultnode.com/${locale}/tools/password`} 
                category="SecurityApplication"
                subCategory="Password Generator"
                featureList={['Local Entropy Generation', 'Zero-Upload Privacy', 'Cryptographically Secure']}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

            <div className="w-full px-5 sm:px-6 lg:px-12 pt-8">
                <Breadcrumbs items={visualBreadcrumbs} />
            </div>

            <PasswordClient />
        </div>
    );
}
