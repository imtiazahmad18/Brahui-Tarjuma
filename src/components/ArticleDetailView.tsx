"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article, CATEGORIES, categoryHref, categoryPath } from "@/types";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import ReaderToolbar from "./ReaderToolbar";
import ArticleRenderer from "./ArticleRenderer";
import ChapterNav from "./ChapterNav";
import ArticleCard from "./ArticleCard";
import { FileText, ArrowRight, User } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

interface ArticleDetailViewProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleDetailView({
  article,
  relatedArticles,
}: ArticleDetailViewProps) {
  const { locale, t, categoryName } = useLocale();
  const isBrh = locale === "brh";
  // Nastaliq needs a larger default size to read comfortably on screen.
  const [fontSize, setFontSize] = useState(isBrh ? 24 : 20);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  useEffect(() => setFontSize(isBrh ? 24 : 20), [isBrh]);

  const categoryInfo = CATEGORIES[article.category] || {
    englishName: article.category,
    urduName: article.category,
  };

  const readingTime = estimateReadingTime(article.body);
  const chapters = article.chapters || [];
  const hasChapters = ["novel", "novelette"].includes(article.category) && chapters.length > 0;
  const currentChapter = hasChapters ? chapters[currentChapterIndex] : null;

  // Active body to render: if novel with chapters, render current chapter body; else article body
  const bodyToRender = currentChapter ? currentChapter.body : article.body;

  // Check if original text exists
  const hasOriginalText = Boolean(article.original_text && article.original_text.trim().length > 0);

  // Formatting the strict English meta line:
  // "Original writer: [name] | Original title: [title] | Translator: [name] | Translator's title [title] | Published: [date] | Category: [Category]"
  const writerName = article.writer ? article.writer.name.split("(")[0].trim() : "Unknown";
  const origTitle = article.original_title || "N/A";
  const translatorName = article.translator_name || "Unknown Translator";
  const translatorTitle = article.title;
  const publishedDate = formatDate(article.published_at);
  const categoryLabel = categoryName(article.category, categoryInfo.englishName, article.category_info?.name_brh || categoryInfo.urduName);

  return (
    <article data-scroll-reveal className="mx-auto min-w-0 max-w-[720px] px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      <nav aria-label={t("label.breadcrumb")} className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-5"><Link href="/" className="hover:text-brand-teal">{t("label.home")}</Link>{categoryPath(article.category).map((node)=><span key={node.slug} className="flex gap-2"><span aria-hidden="true">›</span><Link href={node.href} className="hover:text-brand-teal">{isBrh ? node.urduName : node.englishName}</Link></span>)}<span className="flex gap-2"><span aria-hidden="true">›</span><span aria-current="page">{article.title}</span></span></nav>
      {/* 1. Cover Image (Required) */}
      <div className="relative w-full h-56 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden border border-[#E8E2D9] dark:border-[#243245] shadow-sm mb-6 sm:mb-8 bg-slate-100 dark:bg-slate-800">
        <Image
          src={article.cover_image_url || "/brand/logo.png"}
          alt={article.cover_alt || article.title}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          unoptimized={article.cover_image_url?.includes("/brand/logo.png") || !article.cover_image_url}
          className={article.cover_image_url?.includes("/brand/logo.png") || !article.cover_image_url ? "object-contain p-6" : "object-cover"}
        />
        <div className="absolute top-4 left-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold text-white shadow-md">{article.content_type === "original" ? t("badge.original") : t("badge.translation")}</span>
            <Link href={categoryHref(article.category)} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal text-white shadow-md hover:bg-brand-teal-light transition-colors">
              <span>{categoryLabel}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Title (large, Nastaliq) */}
      <h1
        dir="rtl"
        lang="brh"
        className="min-w-0 break-words [overflow-wrap:anywhere] px-1 font-nastaliq text-[1.5rem] sm:text-[1.875rem] md:text-[2.25rem] lg:text-[2.75rem] leading-[1.9] font-bold text-gray-900 dark:text-gray-100 text-center sm:text-right mb-3 sm:mb-4"
      >
        {article.title}
      </h1>

      {/* 3. Subtitle (optional, Nastaliq) */}
      {article.subtitle && (
        <h2
          dir="rtl"
          lang="brh"
          className="min-w-0 break-words [overflow-wrap:anywhere] px-1 font-nastaliq text-base sm:text-lg md:text-xl leading-[2] text-brand-gold dark:text-amber-400/90 text-center sm:text-right mb-5 sm:mb-6"
        >
          {article.subtitle}
        </h2>
      )}

      {/* 4. Meta line */}
      <div className="my-6 p-4 rounded-xl bg-white dark:bg-[#17212F] border border-[#E8E2D9] dark:border-[#243245] text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans shadow-xs">
        <p className="flex flex-wrap items-center gap-y-1 gap-x-2">
          {article.content_type === "original" ? <><span><strong>{t("label.author")}:</strong> {article.writer ? <Link href={`/writer/${article.writer.slug}`} className="text-brand-teal dark:text-teal-400 hover:underline">{writerName}</Link> : writerName}</span><span className="text-gray-400">|</span><span><strong>{t("label.published")}:</strong> {publishedDate}</span><span className="text-gray-400">|</span><span><strong>{t("label.category")}:</strong> {categoryLabel}</span></> : <><span>
            <strong>{t("label.originalWriter")}:</strong>{" "}
            {article.writer ? (
              <Link
                href={`/writer/${article.writer.slug}`}
                className="text-brand-teal dark:text-teal-400 hover:underline"
              >
                {writerName}
              </Link>
            ) : (
              writerName
            )}
          </span>
          <span className="text-gray-400">|</span>
          <span>
            <strong>{t("label.originalTitle")}:</strong> {origTitle}
          </span>
          <span className="text-gray-400">|</span>
          <span>
            <strong>{t("label.translator")}:</strong> {translatorName}
          </span>
          <span className="text-gray-400">|</span>
          <span>
            <strong>{t("label.translatorTitle")}:</strong>{" "}
            <span className="font-nastaliq" dir="rtl">{translatorTitle}</span>
          </span>
          <span className="text-gray-400">|</span>
          <span>
              <strong>{t("label.published")}:</strong> {publishedDate}
          </span>
          <span className="text-gray-400">|</span>
          <span>
              <strong>{t("label.category")}:</strong> {categoryLabel}
          </span></>}
        </p>
      </div>

      {/* Reader Toolbar (Estimated reading time, share buttons, font-size increase/decrease, PDF download) */}
      <ReaderToolbar
        readingTime={readingTime}
        fontSize={fontSize}
        minFontSize={isBrh ? 22 : 16}
        setFontSize={setFontSize}
        title={article.title}
        pdfUrl={article.pdf_url}
        slug={article.slug}
      />

      {/* Novel Chapters Navigation (if applicable) */}
      {hasChapters && (
        <ChapterNav
          chapters={chapters}
          currentChapterIndex={currentChapterIndex}
          onSelectChapter={setCurrentChapterIndex}
        />
      )}

      {/* Novel Chapter Title Header (if reading specific chapter) */}
      {currentChapter && (
        <div className="my-6 text-center border-b border-gray-200 dark:border-gray-800 pb-4">
          <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
            Chapter {currentChapter.chapter_number}
          </span>
          <h3
            dir="rtl"
            lang="brh"
            className="min-w-0 break-words [overflow-wrap:anywhere] font-nastaliq text-xl sm:text-2xl leading-[1.9] font-bold text-gray-900 dark:text-gray-100 mt-1"
          >
            {currentChapter.title}
          </h3>
        </div>
      )}

      {/* 5. Main Body in Brahui (Nastaliq, RTL, generous line-height) */}
      <div className="min-w-0 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-4 sm:p-6 md:p-10 shadow-sm">
        <ArticleRenderer
          body={bodyToRender}
          category={article.category}
          fontSize={fontSize}
          brahuiMode={isBrh}
        />
      </div>

      {article.references_text && <section className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 p-5"><h2 className="font-semibold mb-2">{t("label.references")}</h2><p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{article.references_text}</p></section>}

      {/* 6. Bottom Action: View Original Text Button */}
      {article.content_type !== "original" && hasOriginalText && (
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-teal/5 via-brand-gold/10 to-brand-teal/5 dark:from-brand-teal/15 dark:via-brand-gold/15 dark:to-brand-teal/15 border border-brand-teal/20 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 max-w-lg mx-auto">
            {t("writer.readSource")} <strong>{writerName}</strong>{isBrh ? "۔" : " in its native language."}
          </p>
          <Link
            href={`/article/${article.slug}/original`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-brand-teal text-white hover:bg-brand-teal-light shadow-md hover:shadow-lg transition-all"
          >
            <FileText className="w-5 h-5 text-brand-gold" />
            <span>{t("action.viewOriginal")}</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      )}

      {/* Novel Chapters Bottom Navigation */}
      {hasChapters && (
        <div className="mt-8">
          <ChapterNav
            chapters={chapters}
            currentChapterIndex={currentChapterIndex}
            onSelectChapter={setCurrentChapterIndex}
          />
        </div>
      )}

      {/* 7. Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#E8E2D9] dark:border-[#243245]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100">
              {t("label.related")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
