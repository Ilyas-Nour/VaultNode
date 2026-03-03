import type { Metadata } from "next";
import PasswordClient from "@/components/PasswordClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.password' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["secure password generator", "local password creator", "cryptographically secure keys", "offline password generator", "vaultnode password"]
    };
}

export default function PasswordPage() {
    return <PasswordClient />;
}
