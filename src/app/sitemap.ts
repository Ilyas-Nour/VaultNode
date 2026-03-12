import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = 'https://vaultnode.com';

function generateAlternates(path: string) {
    const alternates: Record<string, string> = {
        'x-default': `${baseUrl}/en${path}`
    };

    routing.locales.forEach((locale) => {
        alternates[locale] = `${baseUrl}/${locale}${path}`;
    });

    return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/privacy-report',
        '/contact',
        '/tools/blur',
        '/tools/clean-exif',
        '/tools/compress',
        '/tools/encrypt',
        '/tools/heic-to-jpg',
        '/tools/media-converter',
        '/tools/number-pages',
        '/tools/organize-pages',
        '/tools/password',
        '/tools/pdf-merge',
        '/tools/pdf-split',
        '/tools/pdf-to-docx',
        '/tools/pdf-to-img',
        '/tools/redact',
        '/tools/repair',
        '/tools/sign',
        '/tools/stamp',
        '/tools/svg-to-png',
        '/tools/unlock-pdf'
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Add root path specific (no locale prefix)
    sitemapEntries.push({
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
        alternates: {
            languages: generateAlternates(''),
        },
    });

    routing.locales.forEach((locale) => {
        routes.forEach((route) => {
            const url = `${baseUrl}/${locale}${route}`;
            const isHome = route === '';

            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: isHome ? 'weekly' : 'monthly',
                priority: isHome ? 1 : 0.8,
                alternates: {
                    languages: generateAlternates(route),
                },
            });
        });
    });

    return sitemapEntries;
}
