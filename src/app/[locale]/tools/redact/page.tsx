import type { Metadata } from "next";
import RedactClient from "@/components/RedactClient";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Metadata.redact' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["pdf redaction tool", "secure blackout pdf", "private pdf editor", "offline redaction", "vaultnode redact"]
    };
}

export default function RedactPage() {
    return <RedactClient />;
}
