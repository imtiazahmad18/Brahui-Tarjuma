"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article, CATEGORIES, categoryPath } from "@/types";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { BookOpen, User, Feather } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { t, categoryName: localizedCategoryName } = useLocale();
  const typeLabel = article.content_type === "original" ? t("badge.original") : t("badge.translation");
  const categoryInfo = CATEGORIES[article.category] || {
    englishName: article.category,
    urduName: article.category,
  };
  const categoryLabel = localizedCategoryName(article.category, categoryPath(article.category).map((node) => node.englishName).slice(-1)[0] || categoryInfo.englishName, article.category_info?.name_brh || categoryInfo.urduName);
  const readingTime = estimateReadingTime(article.body);
  const coverImage = article.cover_image_url || "/brand/logo.png";
  const isBrandLogo = coverImage.includes("/brand/logo.png");

  if (featured) {
    return (
      <article className="group relative min-w-0 bg-[#FFFFFF] dark:bg-[#17212F] rounded-2xl overflow-hidden border border-[#E8E2D9] dark:border-[#243245] shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="relative min-w-0 lg:col-span-5 h-56 sm:h-64 lg:h-full min-h-[240px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <Image
            src={coverImage}
            alt={article.cover_alt || article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            unoptimized={isBrandLogo}
            className={`${isBrandLogo ? "object-contain p-3" : "object-cover group-hover:scale-105"} transition-transform duration-500`}
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal text-white shadow-sm">
              <span>{typeLabel} · {categoryLabel}</span>
            </span>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Meta Top Line */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>{formatDate(article.published_at)}</span>
              <span>•</span>
              <span>{readingTime} {t("label.readingTime")}</span>
              {article.writer && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                    <User className="w-3.5 h-3.5" />
                    {article.writer.name.split("(")[0].trim()}
                  </span>
                </>
              )}
            </div>

            {/* Title & Subtitle in Nastaliq */}
            <Link href={`/article/${article.slug}`} className="block group-hover:text-brand-teal transition-colors">
              <h2
                dir="rtl"
                lang="brh"
                className="min-w-0 break-words [overflow-wrap:anywhere] font-nastaliq text-xl sm:text-2xl lg:text-3xl leading-[1.9] font-bold text-gray-900 dark:text-gray-100 mb-2"
              >
                {article.title}
              </h2>
              {article.subtitle && (
                <p
                  dir="rtl"
                  lang="brh"
                  className="min-w-0 break-words [overflow-wrap:anywhere] font-nastaliq text-base sm:text-lg leading-[2] text-brand-gold dark:text-amber-400/90 mb-4"
                >
                  {article.subtitle}
                </p>
              )}
            </Link>

            {/* Excerpt */}
            <p
              dir="rtl"
              lang="brh"
              className="font-nastaliq text-sm sm:text-base leading-[2.1] text-gray-600 dark:text-gray-300 line-clamp-3 mb-5 sm:mb-6"
            >
              {article.body.slice(0, 180)}...
            </p>
          </div>

          {/* Bottom Attribution & CTA */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {article.translator_name && (
                <span className="flex items-center gap-1">
                  <Feather className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{t("label.translator")}: <strong className="font-nastaliq font-normal text-sm" dir="rtl">{article.translator_name}</strong></span>
                </span>
              )}
            </div>
            <Link
              href={`/article/${article.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-teal-light group-hover:translate-x-0.5 transition-all"
            >
              <span>{t("action.read")}</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-[#FFFFFF] dark:bg-[#17212F] rounded-xl overflow-hidden border border-[#E8E2D9] dark:border-[#243245] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image */}
        <Link href={`/article/${article.slug}`} className="block relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <Image
            src={coverImage}
            alt={article.cover_alt || article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={isBrandLogo}
              className={`${isBrandLogo ? "object-contain p-3" : "object-cover group-hover:scale-105"} transition-transform duration-500`}
          />
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-teal/90 backdrop-blur-sm text-white shadow-sm">
              <span>{typeLabel} · {categoryLabel}</span>
            </span>
          </div>
        </Link>

        {/* Content Box */}
        <div className="p-5">
          {/* Metadata info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>{formatDate(article.published_at)}</span>
            <span>{readingTime} {t("label.readingTime")}</span>
          </div>

          {/* Title in Nastaliq */}
          <Link href={`/article/${article.slug}`}>
            <h3
              dir="rtl"
              lang="brh"
              className="min-w-0 break-words [overflow-wrap:anywhere] font-nastaliq text-lg sm:text-xl leading-[1.9] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-teal dark:group-hover:text-teal-300 transition-colors mb-1.5 line-clamp-2"
            >
              {article.title}
            </h3>
          </Link>

          {article.subtitle && (
            <p
              dir="rtl"
              lang="brh"
              className="font-nastaliq text-sm sm:text-base leading-[1.9] text-brand-gold dark:text-amber-400/90 mb-3 line-clamp-1"
            >
              {article.subtitle}
            </p>
          )}

          {/* Short Brahui preview */}
          <p
            dir="rtl"
            lang="brh"
            className="font-nastaliq text-sm leading-[2] text-gray-600 dark:text-gray-300 line-clamp-2 mb-4"
          >
            {article.body.slice(0, 120)}...
          </p>
        </div>
      </div>

      {/* Footer info: Original Writer & Translator */}
      <div className="px-5 py-3.5 bg-gray-50/60 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="truncate max-w-[70%]">
          {article.writer && (
            <span className="block truncate">
              {t("label.writer")}: <span className="font-medium text-gray-800 dark:text-gray-200">{article.writer.name.split("(")[0].trim()}</span>
            </span>
          )}
        </div>
        <Link
          href={`/article/${article.slug}`}
          className="font-semibold text-brand-teal dark:text-teal-400 hover:underline shrink-0"
        >
          {t("action.readMore")} &rarr;
        </Link>
      </div>
    </article>
  );
}
