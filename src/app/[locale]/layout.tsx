import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import { Navbar } from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"], variable: '--font-geist' });
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ["arabic"],
    variable: '--font-ibm-plex'
});

export const metadata: Metadata = {
    title: {
        template: "%s | PrivaFlow",
        default: "PrivaFlow | Your Files Stay With You",
    },
    description: "Everything you do stays inside your own screen. Safe, private, and 100% free tools for your photos and files.",
    keywords: ["private pdf redactor", "unlock pdf offline", "heic to jpg local", "pdf to word converter", "ffmpeg wasm converter", "svg to png local", "zero upload privacy"],
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
        title: "PrivaFlow | Private Media Tools",
        description: "Everything you do stays inside your own screen.",
        url: 'https://privaflow.com',
        siteName: "PrivaFlow",
        images: [{ url: '/og-image.png' }],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "PrivaFlow | Private Media Tools",
        description: "Pure client-side processing. No servers. No uploads. Just privacy.",
    }
};

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
        <html lang={locale} dir={direction} className="dark">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                suppressHydrationWarning
                data-debug-locale={locale}
                data-debug-keys={Object.keys(messages).join(',')}
                className={`${isArabic ? ibmPlexArabic.className : geist.className} bg-background text-foreground antialiased min-h-screen selection:bg-emerald-500/30 font-medium dark:font-semibold`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <div className="relative min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 flex flex-col pt-18">
                            {children}
                        </main>
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
