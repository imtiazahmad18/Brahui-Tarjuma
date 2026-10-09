import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/data";
import { ArrowLeft, BookOpen, Quote, ExternalLink } from "lucide-react";

interface OriginalPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: OriginalPageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

  if (!article) {
    return {
      title: "Original Text Not Found",
    };
  }

  return {
    title: `Original Text: ${article.original_title || article.title} — Brahui Tarjuma`,
    description: `Original source text for ${article.title} translated into Brahui.`,
    robots: {
      index: false, // Ensure Google ranks the Brahui translation page, not the original text copy!
      follow: true,
    },
    alternates: {
      canonical: `${siteUrl}/article/${article.slug}`, // Canonical points to the Brahui translation!
    },
  };
}

export default async function OriginalTextPage({ params }: OriginalPageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article || !article.original_text) {
    notFound();
  }

  const isRtl = article.original_dir === "rtl";
  const lang = article.original_lang || (isRtl ? "ur" : "en");
  const writerName = article.writer ? article.writer.name : "Original Author";
  const paragraphs = article.original_text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Navigation */}
      <div className="mb-8">
        <Link
          href={`/article/${article.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-teal-light group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Brahui Translation (براہوئی مٹ و بدل)</span>
        </Link>
      </div>

      {/* Header Container */}
      <header className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold dark:text-amber-400 mb-2">
          <Quote className="w-4 h-4" />
          <span>Original Source Text</span>
        </div>

        {/* Original Title */}
        <h1
          dir={isRtl ? "rtl" : "ltr"}
          lang={lang}
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${
            isRtl ? "font-nastaliq leading-nastaliq" : "font-serif"
          }`}
        >
          {article.original_title || article.title}
        </h1>

        {/* Writer and Citation metadata */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span>Author: </span>
            <strong className="text-gray-900 dark:text-gray-200">{writerName}</strong>
          </div>

          {article.source_credit && (
            <div className="italic text-xs sm:text-sm">
              Source: {article.source_credit}
            </div>
          )}

          <div className="text-xs bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded font-mono">
            Lang: {lang.toUpperCase()} • Dir: {isRtl ? "RTL" : "LTR"}
          </div>
        </div>
      </header>

      {/* Original Body text Container */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-10 shadow-sm mb-8">
        <div
          dir={isRtl ? "rtl" : "ltr"}
          lang={lang}
          className={`space-y-6 text-gray-900 dark:text-gray-100 text-base sm:text-lg ${
            isRtl ? "font-nastaliq leading-nastaliq text-xl sm:text-2xl text-justify" : "font-serif leading-relaxed text-justify"
          }`}
        >
          {paragraphs.map((p, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="text-center pt-4">
        <Link
          href={`/article/${article.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-brand-teal text-white hover:bg-brand-teal-light shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Brahui Translation (براہوئی مٹ)</span>
        </Link>
      </div>
    </div>
  );
}
