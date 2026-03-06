import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import MediaConverterClient from '@/components/MediaConverterClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.mediaConverter' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function MediaConverterPage() {
    return (
        <div className="py-20">
            <MediaConverterClient />
        </div>
    );
}
