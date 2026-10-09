import React from "react";
import { Article, Writer } from "@/types";

interface ArticleJsonLdProps {
  article: Article;
  siteUrl: string;
}

export function ArticleJsonLd({ article, siteUrl }: ArticleJsonLdProps) {
  const url = `${siteUrl}/article/${article.slug}`;
  const imageUrl = article.cover_image_url.startsWith("http")
    ? article.cover_image_url
    : `${siteUrl}${article.cover_image_url}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
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
    "translator": {
      "@type": "Person",
      "name": article.translator_name || "Brahui Tarjuma",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Brahui Tarjuma",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.jpeg`,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.category.toUpperCase(),
        "item": `${siteUrl}/category/${article.category}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": url,
      },
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

export function WebSiteJsonLd({ siteUrl }: { siteUrl: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Brahui Tarjuma",
    "alternateName": "براہوئی ترجمہ",
    "url": siteUrl,
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
