import type { Metadata } from "next";
import CleanExifClient from "@/components/CleanExifClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.cleanExif' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: ["remove exif data", "clean metadata", "remove gps from photo", "local exif scrubber", "privacy photo cleaner", "vaultnode clean"]
    };
}

export default function CleanExifPage() {
    return <CleanExifClient />;
}
