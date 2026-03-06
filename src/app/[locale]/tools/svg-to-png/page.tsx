import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SvgToPngClient from '@/components/SvgToPngClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.svgToPng' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function SvgToPngPage() {
    return (
        <div className="py-20">
            <SvgToPngClient />
        </div>
    );
}
