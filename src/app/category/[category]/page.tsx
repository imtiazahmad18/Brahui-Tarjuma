import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesByCategory } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORIES, CategorySlug } from "@/types";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { cookies } from "next/headers";
import { normalizeLocale, translate } from "@/lib/i18n";
import { getCategoryBrahuiNames } from "@/lib/data";

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams?: {
    page?: string;
    type?: "all" | "original" | "translation";
  };
}

export const revalidate = 0;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  let catSlug = params.category.toLowerCase();
  if (catSlug === "critique") catSlug = "criticism";

  const category = CATEGORIES[catSlug as CategorySlug];
  if (!category) {
    return { title: "Category Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

  return {
      title: `${category.englishName} (${category.urduName})`,
    description: category.description,
    alternates: {
      canonical: `${siteUrl}/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.englishName} (${category.urduName})`,
      description: category.description,
      url: `${siteUrl}/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  let catSlug = params.category.toLowerCase();
  // Support critique as alias for criticism
  if (catSlug === "critique") catSlug = "criticism";

  const categoryInfo = CATEGORIES[catSlug as CategorySlug];
  if (!categoryInfo) {
    notFound();
  }

  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const isBrh = locale === "brh";
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const categoryNames = isBrh ? await getCategoryBrahuiNames() : {};
  const categoryName = isBrh
    ? categoryNames[catSlug] || categoryInfo.name_brh || categoryInfo.urduName || categoryInfo.englishName
    : categoryInfo.englishName;

  const currentPage = Number(searchParams?.page || 1);
  const pageSize = 12;
  const contentType = searchParams?.type === "original" || searchParams?.type === "translation" ? searchParams.type : undefined;
  const { articles, total } = await getArticlesByCategory(
    catSlug as CategorySlug,
    currentPage,
    pageSize,
    contentType
  );

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Category Header */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-8 sm:p-12 mb-12 shadow-sm text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-300 uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t("label.category")}</span>
        </div>

        <h1 dir={isBrh ? "rtl" : "ltr"} lang={isBrh ? "brh" : "en"} className={`text-3xl sm:text-4xl md:text-5xl font-bold ${isBrh ? "font-nastaliq" : "font-serif"} text-gray-900 dark:text-gray-100 mb-2`}>
          {categoryName}
        </h1>

        {!isBrh && <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-base sm:text-lg mt-2">
          {categoryInfo.description}
        </p>}

        {!isBrh && <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Showing {articles.length} of {total} works
        </div>}
      </div>

      <nav className="flex gap-2 mb-6">{[{v:"all",label:t("filter.all")},{v:"original",label:t("filter.original")},{v:"translation",label:t("filter.translation")}].map(x=><Link key={x.v} href={`/category/${catSlug}?type=${x.v}`} className={`px-4 py-2 rounded-lg border ${((contentType||"all")===x.v)?"bg-brand-teal text-white":"bg-white dark:bg-[#17212F]"}`}>{x.label}</Link>)}</nav>
      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-8">
          <p dir={isBrh ? "rtl" : "ltr"} lang={isBrh ? "brh" : "en"} className={`${isBrh ? "font-nastaliq" : ""} text-lg text-gray-600 dark:text-gray-300 mb-4`}>
            {isBrh ? t("empty.results") : "No works published in this category yet."}
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-teal text-white hover:bg-brand-teal-light"
            >
              {t("error.backHome")}
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          {currentPage > 1 && (
            <Link
              href={`/category/${catSlug}?page=${currentPage - 1}&type=${contentType || "all"}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-white dark:bg-[#17212F] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-teal transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t("pagination.previous")}</span>
            </Link>
          )}

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("pagination.page")} {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages && (
            <Link
              href={`/category/${catSlug}?page=${currentPage + 1}&type=${contentType || "all"}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-white dark:bg-[#17212F] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-teal transition-colors"
            >
              <span>{t("pagination.next")}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
