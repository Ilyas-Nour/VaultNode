import type { Metadata } from "next";
import { Outfit, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const outfit = Outfit({
    subsets: ["latin"],
    variable: '--font-outfit',
    display: 'swap'
});
const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap'
});
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ["arabic"],
    variable: '--font-ibm-plex',
    display: 'swap'
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.default' });

    return {
        metadataBase: new URL('https://vaultnode.com'),
        title: {
            template: "%s | PrivaFlow",
            default: t('title'),
        },
        description: t('description'),
        keywords: t('keywords').split(', '),
        alternates: {
            canonical: "https://vaultnode.com",
            languages: {
                "en": "https://vaultnode.com/en",
                "es": "https://vaultnode.com/es",
                "fr": "https://vaultnode.com/fr",
                "ar": "https://vaultnode.com/ar",
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: 'https://vaultnode.com',
            siteName: "PrivaFlow",
            images: [{ url: '/og-image.png' }],
            locale: locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        }
    };
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    const messages = await getMessages();
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const isArabic = locale === 'ar';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PrivaFlow",
        "operatingSystem": "Any browser (Chrome, Firefox, Safari)",
        "applicationCategory": "MultimediaApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Pure client-side media suite. 100% private PDF unlocking, HEIC conversion, FFmpeg media processing, and text extraction running purely in RAM.",
        "softwareVersion": "1.2.0",
        "featureList": [
            "Secure PDF Redaction",
            "Smart Image Compression",
            "Local PDF Merging",
            "Offline PDF Unlocking",
            "Browser-Native HEIC Parsing",
            "Local PDF to Word Reconstruction",
            "FFmpeg Video to Audio Extraction",
            "Client-Side SVG Rasterization"
        ],
        "availableLanguage": ["en", "es", "fr", "ar"]
    };

    return (
        <html lang={locale} dir={direction} className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                suppressHydrationWarning
                className={`${outfit.variable} ${inter.variable} ${isArabic ? ibmPlexArabic.className : inter.className} bg-background text-foreground antialiased min-h-screen selection:bg-white/20`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <div className="w-full min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 w-full pt-16">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
