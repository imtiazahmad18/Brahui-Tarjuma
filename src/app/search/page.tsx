"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Article } from "@/types";
import { searchArticles, getPublishedArticles } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import { Search as SearchIcon, X } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

function SearchContent() {
  const searchParams = useSearchParams();
  const { locale, t } = useLocale();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const requestedType = searchParams.get("type");
  const [typeFilter, setTypeFilter] = useState<"all" | "original" | "translation">(requestedType === "original" || requestedType === "translation" ? requestedType : "all");
  const visibleResults = results.filter(a => typeFilter === "all" || (a.content_type || "translation") === typeFilter);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialQuery.trim()) {
      executeSearch(initialQuery);
    } else {
      getPublishedArticles().then((all) => {
        setResults(all.slice(0, 6));
      });
    }
  }, [initialQuery]);

  const executeSearch = (searchTerm: string) => {
    startTransition(async () => {
      if (!searchTerm.trim()) {
        const all = await getPublishedArticles();
        setResults(all.slice(0, 6));
        setHasSearched(false);
        return;
      }

      const found = await searchArticles(searchTerm);
      setResults(found);
      setHasSearched(true);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    executeSearch(val);
  };

  const handleClear = () => {
    setQuery("");
    executeSearch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-300 uppercase tracking-wider mb-4">
          <SearchIcon className="w-3.5 h-3.5" />
          <span>{t("search.library")}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-2">
          {t("search.heading")}
        </h1>

        {locale === "brh" && <div dir="rtl" className="py-2">
          <span className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
مٹ، نوشتکار یا سرحال آتا پٹ پول 
          </span>
        </div>}

        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-2">
          {t("search.description")}
        </p>

        {/* Search Input Box */}
        <div className="mt-8 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={t("search.placeholderExample")}
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-[#17212F] rounded-2xl border-2 border-[#E8E2D9] dark:border-[#243245] text-gray-900 dark:text-gray-100 text-base sm:text-lg focus:outline-none focus:border-brand-teal dark:focus:border-teal-400 shadow-sm transition-all"
            />
            <SearchIcon className="w-6 h-6 text-gray-400 absolute left-4 pointer-events-none" />
            {query && (
              <button
                onClick={handleClear}
                className="p-2 absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick search suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{t("search.suggestions")}:</span>
            <button
              onClick={() => {
                setQuery("story");
                executeSearch("story");
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-teal/10 hover:text-brand-teal transition-colors"
            >
              {t("search.suggestionOne")}
            </button>
            <button
              onClick={() => {
                setQuery("poetry");
                executeSearch("poetry");
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-teal/10 hover:text-brand-teal transition-colors"
            >
              {t("search.suggestionTwo")}
            </button>
            <button
              onClick={() => {
                setQuery("Brahui");
                executeSearch("Brahui");
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-teal/10 hover:text-brand-teal transition-colors"
            >
              {t("search.suggestionThree")}
            </button>
            <button
              onClick={() => {
                setQuery("Hemingway");
                executeSearch("Hemingway");
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-teal/10 hover:text-brand-teal transition-colors"
            >
              Hemingway
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-2">{[{v:"all",label:t("filter.all")},{v:"original",label:t("filter.original")},{v:"translation",label:t("filter.translation")}].map(x=><button key={x.v} onClick={()=>setTypeFilter(x.v as typeof typeFilter)} className={`min-h-11 px-4 py-2 rounded-lg border ${typeFilter===x.v?"bg-brand-teal text-white":"bg-white dark:bg-[#17212F]"}`}>{x.label}</button>)}</div>
      <p className="text-center text-xs text-gray-500 mb-6">{t("filter.originalHelp")} · {t("filter.translationHelp")}</p>
      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100">
            {hasSearched ? `${t("search.results")} (${visibleResults.length})` : t("search.recent")}
          </h2>
          {hasSearched && query && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t("search.matches")} &ldquo;{query}&rdquo;
            </span>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleResults.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-8 max-w-lg mx-auto">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("search.noMatches")}
            </p>
            <p dir="rtl" className="font-nastaliq text-xl text-brand-gold mb-4">
              ہچ مٹ و بدل اس دا لوز تا ردٹ رسینگتو۔
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("search.tryAgain")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
