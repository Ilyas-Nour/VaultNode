import type { Metadata } from "next";
import CompressClient from "@/components/CompressClient";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Metadata.compress' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["image compressor", "private image shrinker", "client-side photo compression", "secure image optimization", "vaultnode compress"]
    };
}

export default function CompressPage() {
    return <CompressClient />;
}
