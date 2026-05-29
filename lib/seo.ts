import type { ConfusingWordEntry } from "@/types/content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function createBreadcrumbJsonLd(entry: ConfusingWordEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Confusing Words",
        item: absoluteUrl("/confusing-words"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.title,
        item: absoluteUrl(entry.seo.canonicalPath),
      },
    ],
  };
}

export function createArticleJsonLd(entry: ConfusingWordEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.seo.title,
    description: entry.seo.description,
    url: absoluteUrl(entry.seo.canonicalPath),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: absoluteUrl(entry.seo.canonicalPath),
  };
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
