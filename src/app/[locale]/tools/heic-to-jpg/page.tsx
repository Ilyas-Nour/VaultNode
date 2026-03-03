import type { Metadata } from "next";
import HeicToJpgClient from "@/components/HeicToJpgClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.heicToJpg' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["heic to jpg", "convert heic local", "iphone photo converter", "heic to webp browser", "vaultnode heic"]
    };
}

export default function HeicToJpgPage() {
    return <HeicToJpgClient />;
}
