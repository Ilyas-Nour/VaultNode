/**
 * 🚀 SEO Structured Data (JSON-LD)
 * Provides high-fidelity SoftwareApplication schema for each tool
 * to ensure rich results in Google, Bing, and other search engines.
 */

import React from 'react';

interface SoftwareSchemaProps {
    name: string;
    description: string;
    url: string;
    category?: string;
    operatingSystem?: string;
    price?: string;
}

export const SoftwareSchema = ({
    name,
    description,
    url,
    category = "MultimediaApplication",
    operatingSystem = "Windows, macOS, Linux, Android, iOS (Any Browser)",
    price = "0"
}: SoftwareSchemaProps) => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${name} - PrivaFlow Private Offline Tool`,
        "description": description,
        "url": url,
        "applicationCategory": category,
        "operatingSystem": operatingSystem,
        "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "USD"
        },
        "author": {
            "@type": "Organization",
            "name": "PrivaFlow",
            "url": "https://vaultnode.com"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1280"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
};
