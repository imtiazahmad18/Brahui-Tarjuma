"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article, CATEGORIES } from "@/types";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import ReaderToolbar from "./ReaderToolbar";
import ArticleRenderer from "./ArticleRenderer";
import ChapterNav from "./ChapterNav";
import ArticleCard from "./ArticleCard";
import { FileText, ArrowRight, User } from "lucide-react";

interface ArticleDetailViewProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleDetailView({
  article,
  relatedArticles,
}: ArticleDetailViewProps) {
  // Desktop font default 21px, mobile 19px
  const [fontSize, setFontSize] = useState(21);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const categoryInfo = CATEGORIES[article.category] || {
    englishName: article.category,
    urduName: article.category,
  };

  const readingTime = estimateReadingTime(article.body);
  const chapters = article.chapters || [];
  const hasChapters = chapters.length > 0;
  const currentChapter = hasChapters ? chapters[currentChapterIndex] : null;

  // Active body to render: if novel with chapters, render current chapter body; else article body
  const bodyToRender = currentChapter ? currentChapter.body : article.body;

  // Check if original text exists
  const hasOriginalText = Boolean(article.original_text && article.original_text.trim().length > 0);

  // Formatting the strict English meta line:
  // "Original writer: [name] | Original title: [title] | Translator: [name] | Translator's title [title] | Published: [date] | Category: [Category]"
  const writerName = article.writer ? article.writer.name.split("(")[0].trim() : "Unknown";
  const origTitle = article.original_title || "N/A";
  const translatorName = article.translator_name || "Brahui Tarjuma";
  const translatorTitle = article.title;
  const publishedDate = formatDate(article.published_at);
  const categoryLabel = `${categoryInfo.englishName} (${categoryInfo.urduName})`;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Cover Image (Required) */}
      <div className="relative w-full h-72 sm:h-96 md:h-[460px] rounded-2xl overflow-hidden border border-[#E8E2D9] dark:border-[#243245] shadow-sm mb-8 bg-slate-100 dark:bg-slate-800">
        <Image
          src={article.cover_image_url || "/brahui-tarjuma.jpeg"}
          alt={article.cover_alt || article.title}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <Link
            href={`/category/${article.category}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal text-white shadow-md hover:bg-brand-teal-light transition-colors"
          >
            <span>{categoryInfo.englishName}</span>
            <span className="font-nastaliq" dir="rtl">({categoryInfo.urduName})</span>
          </Link>
        </div>
      </div>

      {/* 2. Title (large, Nastaliq) */}
      <h1
        dir="rtl"
        lang="brh"
        className="font-nastaliq text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-nastaliq font-bold text-gray-900 dark:text-gray-100 text-center sm:text-right mb-4"
      >
        {article.title}
      </h1>

      {/* 3. Subtitle (optional, Nastaliq) */}
      {article.subtitle && (
        <h2
          dir="rtl"
          lang="brh"
          className="font-nastaliq text-xl sm:text-2xl md:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400/90 text-center sm:text-right mb-6"
        >
          {article.subtitle}
        </h2>
      )}

      {/* 4. Meta line (English strictly formatted) */}
      <div className="my-6 p-4 rounded-xl bg-white dark:bg-[#17212F] border border-[#E8E2D9] dark:border-[#243245] text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans shadow-xs">
        <p className="flex flex-wrap items-center gap-y-1 gap-x-2">
          <span>
            <strong>Original writer:</strong>{" "}
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
            <strong>Original title:</strong> {origTitle}
          </span>
          <span className="text-gray-400">|</span>
          <span>
            <strong>Translator:</strong> {translatorName}
          </span>
          <span className="text-gray-400">|</span>
          <span>
            <strong>Translator&apos;s title:</strong>{" "}
            <span className="font-nastaliq" dir="rtl">{translatorTitle}</span>
          </span>
          <span className="text-gray-400">|</span>
          <span>
            <strong>Published:</strong> {publishedDate}
          </span>
          <span className="text-gray-400">|</span>
          <span>
            <strong>Category:</strong> {categoryLabel}
          </span>
        </p>
      </div>

      {/* Reader Toolbar (Estimated reading time, share buttons, font-size increase/decrease, PDF download) */}
      <ReaderToolbar
        readingTime={readingTime}
        fontSize={fontSize}
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
            className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq font-bold text-gray-900 dark:text-gray-100 mt-1"
          >
            {currentChapter.title}
          </h3>
        </div>
      )}

      {/* 5. Main Body in Brahui (Nastaliq, RTL, generous line-height) */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-10 shadow-sm">
        <ArticleRenderer
          body={bodyToRender}
          category={article.category}
          fontSize={fontSize}
        />
      </div>

      {/* 6. Bottom Action: View Original Text Button */}
      {hasOriginalText && (
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-teal/5 via-brand-gold/10 to-brand-teal/5 dark:from-brand-teal/15 dark:via-brand-gold/15 dark:to-brand-teal/15 border border-brand-teal/20 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 max-w-lg mx-auto">
            Read the original source text written by <strong>{writerName}</strong> in its native language.
          </p>
          <Link
            href={`/article/${article.slug}/original`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-brand-teal text-white hover:bg-brand-teal-light shadow-md hover:shadow-lg transition-all"
          >
            <FileText className="w-5 h-5 text-brand-gold" />
            <span>View Original Text</span>
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
              Related Translations
            </h3>
            <span className="font-nastaliq text-xl text-brand-gold dark:text-amber-400" dir="rtl">
              متعلقہ مٹ و بدل
            </span>
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
