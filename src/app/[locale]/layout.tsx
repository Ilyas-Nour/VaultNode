import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

const geist = Geist({ subsets: ["latin"], variable: '--font-geist' });
const ibmPlexArabic = IBM_Plex_Sans_Arabic({ weight: ['300', '400', '500', '600', '700'], subsets: ["arabic"], variable: '--font-ibm-plex' });

export const metadata: Metadata = {
    title: {
        template: "%s | VaultNode",
        default: "VaultNode | 100% Private Local Media Tools",
    },
    description: "Secure, 100% private, and local browser processing for your media. Zero uploads. VaultNode handles PDFs and images directly in your RAM using WebAssembly.",
    keywords: ["private pdf redactor", "local image compressor", "secure media tools", "browser-side pdf editing", "zero upload privacy", "offline media tools"],
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
        title: "VaultNode | Private Local Media Tools",
        description: "Zero-upload PDF editing and media compression. Your privacy is our architecture.",
        type: "website",
        url: "https://vaultnode.com",
        siteName: "VaultNode",
    },
    twitter: {
        card: "summary_large_image",
        title: "VaultNode | 100% Private Media Tools",
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
        "name": "VaultNode",
        "operatingSystem": "Any browser (Chrome, Firefox, Safari)",
        "applicationCategory": "MultimediaApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Pure client-side media suite. 100% private PDF and image tools running in RAM.",
        "softwareVersion": "1.0.5",
        "featureList": [
            "Secure PDF Redaction",
            "Smart Image Compression",
            "Local PDF Merging"
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
                className={`${isArabic ? ibmPlexArabic.className : geist.className} bg-background text-foreground antialiased`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
