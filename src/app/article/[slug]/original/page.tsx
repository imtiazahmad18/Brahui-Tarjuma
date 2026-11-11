import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/data";
import { ArrowLeft, BookOpen, Quote, ExternalLink } from "lucide-react";
import { cookies } from "next/headers";
import { normalizeLocale, translate } from "@/lib/i18n";

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

  if (article.content_type === "original") return { title: "Original Text Not Found", robots: { index: false, follow: false } };
  return {
    title: `Original Text: ${article.original_title || article.title}`,
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
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const article = await getArticleBySlug(params.slug);

  if (!article || article.content_type === "original" || !article.original_text) {
    notFound();
  }

  const isRtl = article.original_dir === "rtl";
  const lang = article.original_lang || (isRtl ? "ur" : "en");
  const writerName = article.writer ? article.writer.name : t("article.unknown");
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
          <span>{t("original.back")}</span>
        </Link>
      </div>

      {/* Header Container */}
      <header className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold dark:text-amber-400 mb-2">
          <Quote className="w-4 h-4" />
          <span>{t("original.heading")}</span>
        </div>

        {/* Original Title */}
        <h1
          dir={isRtl ? "rtl" : "ltr"}
          lang={lang}
          className={`text-xl sm:text-2xl md:text-3xl break-words [overflow-wrap:anywhere] font-bold text-gray-900 dark:text-gray-100 mb-4 ${
            isRtl ? "font-nastaliq leading-[1.9]" : "font-serif"
          }`}
        >
          {article.original_title || article.title}
        </h1>

        {/* Writer and Citation metadata */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span>{t("original.author")}: </span>
            <strong className="text-gray-900 dark:text-gray-200">{writerName}</strong>
          </div>

          {article.source_credit && (
            <div className="italic text-xs sm:text-sm">
              {t("original.source")}: {article.source_credit}
            </div>
          )}

          <div className="text-xs bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded font-mono">
            {t("original.language")}: {lang.toUpperCase()} • {t("original.direction")}: {isRtl ? "RTL" : "LTR"}
          </div>
        </div>
      </header>

      {/* Original Body text Container */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-10 shadow-sm mb-8">
        <div
          dir={isRtl ? "rtl" : "ltr"}
          lang={lang}
          className={`space-y-4 sm:space-y-6 text-gray-900 dark:text-gray-100 text-base sm:text-lg ${
            isRtl ? "font-nastaliq leading-[2] text-lg sm:text-xl text-right" : "font-serif leading-relaxed text-justify"
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
          <span>{t("original.back")}</span>
        </Link>
      </div>
    </div>
  );
}
