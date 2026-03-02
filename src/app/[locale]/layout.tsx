import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

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
        "softwareVersion": "1.0.4",
        "featureList": [
            "Secure PDF Redaction",
            "Smart Image Compression",
            "Local PDF Merging"
        ]
    };

    return (
        <html lang={locale} className="dark">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={`${inter.className} bg-background text-foreground`}>
                {children}
            </body>
        </html>
    );
}
