import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data";
import ArticleDetailView from "@/components/ArticleDetailView";
import { ArticleJsonLd } from "@/components/SEOHead";

interface PageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60; // ISR revalidation

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const title = `${article.title} — براہوئی ترجمہ`;
  const description =
    article.meta_description ||
    article.subtitle ||
    `${article.title} - Brahui translation of ${article.original_title || "world literature"}.`;
  const coverImage = article.cover_image_url.startsWith("http")
    ? article.cover_image_url
    : `${siteUrl}${article.cover_image_url}`;

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
      siteName: "Brahui Tarjuma",
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
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(
    article.slug,
    article.category,
    article.writer_id
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

  return (
    <>
      <ArticleJsonLd article={article} siteUrl={siteUrl} />
      <ArticleDetailView article={article} relatedArticles={relatedArticles} />
    </>
  );
}
