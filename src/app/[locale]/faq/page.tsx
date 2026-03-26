import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Shield, Cpu, Zap, CreditCard } from 'lucide-react';
import { FAQClient } from '@/components/FAQClient';
import { FAQSchema } from '@/components/FAQSchema';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'FAQPage' });
    return {
        title: `${t('title')} | PrivaFlow`,
        description: t('subtitle')
    };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'FAQPage' });

    const faqs = [
        { q: t('questions.q1'), a: t('questions.a1'), icon: Shield },
        { q: t('questions.q2'), a: t('questions.a2'), icon: Cpu },
        { q: t('questions.q3'), a: t('questions.a3'), icon: Zap },
        { q: t('questions.q4'), a: t('questions.a4'), icon: CreditCard }
    ];

    const faqSchemaData = faqs.map(f => ({ question: f.q, answer: f.a }));

    const breadcrumbItems = [
        { name: 'Vault', item: `https://privaflow.com/${locale}` },
        { name: 'FAQ', item: `https://privaflow.com/${locale}/faq` }
    ];

    return (
        <>
            <FAQSchema questions={faqSchemaData} />
            <BreadcrumbSchema items={breadcrumbItems} />
            <FAQClient 
                title={t('title')} 
                subtitle={t('subtitle')} 
                questions={faqs} 
            />
        </>
    );
}
