import { getTranslations } from 'next-intl/server';
import MediaConverterClient from '@/components/MediaConverterClient';

export async function generateMetadata() {
    const t = await getTranslations('Metadata.mediaConverter');
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
