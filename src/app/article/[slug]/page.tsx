import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data";
import ArticleDetailView from "@/components/ArticleDetailView";
import { getSiteName } from "@/lib/brand";
import { ArticleJsonLd } from "@/components/SEOHead";
import { cookies } from "next/headers";
import { normalizeLocale } from "@/lib/i18n";

interface PageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0; // ISR revalidation

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const siteName = getSiteName(locale);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const title = article.title;
  const description = article.meta_description || article.subtitle || (article.content_type === "original" ? `${article.title} — original Brahui writing by ${article.writer?.name || "a Brahui writer"}.` : `${article.title} — translated into Brahui from ${article.original_title || "world literature"}.`);
  const coverImage = article.cover_image_url
    ? (article.cover_image_url.startsWith("http") ? article.cover_image_url : `${siteUrl}${article.cover_image_url}`)
    : `${siteUrl}/brand/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/article/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/article/${article.slug}`,
      siteName,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: article.cover_alt || article.title,
        },
      ],
      type: "article",
      publishedTime: article.published_at || article.created_at,
      authors: [article.writer ? article.writer.name : "Original Author"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(
    article.slug, article.category, article.writer_id, 3, article.content_type || "translation"
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

  return (
    <>
      <ArticleJsonLd article={article} siteUrl={siteUrl} locale={locale} />
      <ArticleDetailView article={article} relatedArticles={relatedArticles} />
    </>
  );
}
