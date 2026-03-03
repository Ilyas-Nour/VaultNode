import { getTranslations } from 'next-intl/server';
import SvgToPngClient from '@/components/SvgToPngClient';

export async function generateMetadata() {
    const t = await getTranslations('Metadata.svgToPng');
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
