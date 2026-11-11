import React from "react";
import { Article, Writer, categoryPath } from "@/types";
import { SITE_NAME, getSiteName } from "@/lib/brand";
import type { Locale } from "@/lib/i18n";

interface ArticleJsonLdProps {
  article: Article;
  siteUrl: string;
  locale?: Locale;
}

export function ArticleJsonLd({ article, siteUrl, locale = "en" }: ArticleJsonLdProps) {
  const siteName = getSiteName(locale);
  const url = `${siteUrl}/article/${article.slug}`;
  const imageUrl = article.cover_image_url.startsWith("http")
    ? article.cover_image_url
    : `${siteUrl}${article.cover_image_url}`;

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": article.category === "research" ? "ScholarlyArticle" : (article.content_type === "original" ? "CreativeWork" : "Article"),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "headline": article.title,
    "description": article.meta_description || article.subtitle || article.title,
    "image": [imageUrl],
    "inLanguage": "brh",
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at || article.published_at || article.created_at,
    "author": {
      "@type": "Person",
      "name": article.writer ? article.writer.name : "Original Author",
    },
    ...(article.content_type === "original" ? {} : { translator: { "@type": "Person", "name": article.translator_name || "Unknown Translator" } }),
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/brand/logo.png`,
      },
    },
  };

  const crumbs = categoryPath(article.category);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      ...crumbs.map((node, index) => ({ "@type": "ListItem", "position": index + 2, "name": node.englishName, "item": `${siteUrl}${node.href}` })),
      { "@type": "ListItem", "position": crumbs.length + 2, "name": article.title, "item": url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

export function WebSiteJsonLd({ siteUrl, locale = "en" }: { siteUrl: string; locale?: Locale }) {
  const siteName = getSiteName(locale);
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "alternateName": locale === "brh" ? SITE_NAME : "لوزانک",
    "url": siteUrl,
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/brand/logo.png`, "width": 1444, "height": 1134 },
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
