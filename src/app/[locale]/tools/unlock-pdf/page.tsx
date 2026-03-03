import type { Metadata } from "next";
import UnlockPdfClient from "@/components/UnlockPdfClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.unlockPdf' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["unlock pdf", "remove pdf password", "decrypt pdf local", "pdf password remover", "vaultnode unlock"]
    };
}

export default function UnlockPdfPage() {
    return <UnlockPdfClient />;
}
