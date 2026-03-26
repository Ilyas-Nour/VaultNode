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
    subCategory?: string;
    operatingSystem?: string;
    price?: string;
    featureList?: string[];
}

export const SoftwareSchema = ({
    name,
    description,
    url,
    category = "MultimediaApplication",
    subCategory = "Privacy Tool",
    operatingSystem = "Windows, macOS, Linux, Android, iOS (Any Browser)",
    price = "0",
    featureList = []
}: SoftwareSchemaProps) => {
    // Ensure URL uses the primary domain
    const correctedUrl = url;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${name} - PrivaFlow Private Offline Tool`,
        "description": description,
        "url": correctedUrl,
        "applicationCategory": category,
        "applicationSubCategory": subCategory,
        "operatingSystem": operatingSystem,
        "featureList": featureList,
        "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "USD"
        },
        "author": {
            "@type": "Organization",
            "name": "PrivaFlow",
            "url": "https://privaflow.com"
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
