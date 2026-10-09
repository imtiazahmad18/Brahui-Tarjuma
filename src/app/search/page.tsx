"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Article } from "@/types";
import { searchArticles, getPublishedArticles } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import { Search as SearchIcon, X } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
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
          <span>Library Search</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-2">
          Search Translations
        </h1>

        <div dir="rtl" className="py-2">
          <span className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
            ترجمہ، نوشتہ کار یا عنوان پٹ و پول کبو
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-2">
          Search across Brahui titles, original author names, translators, or passage keywords in Nastaliq or English.
        </p>

        {/* Search Input Box */}
        <div className="mt-8 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search in Brahui (ٹوبہ ٹیک سنگھ, فیض) or English (Manto, Poetry)..."
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
            <span>Suggestions:</span>
            <button
              onClick={() => {
                setQuery("ٹوبہ ٹیک سنگھ");
                executeSearch("ٹوبہ ٹیک سنگھ");
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-teal/10 hover:text-brand-teal transition-colors font-nastaliq"
              dir="rtl"
            >
              ٹوبہ ٹیک سنگھ
            </button>
            <button
              onClick={() => {
                setQuery("فیض");
                executeSearch("فیض");
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-teal/10 hover:text-brand-teal transition-colors font-nastaliq"
              dir="rtl"
            >
              فیض احمد فیض
            </button>
            <button
              onClick={() => {
                setQuery("بورخیس");
                executeSearch("بورخیس");
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-teal/10 hover:text-brand-teal transition-colors font-nastaliq"
              dir="rtl"
            >
              بورخیس
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

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100">
            {hasSearched ? `Search Results (${results.length})` : "Featured & Recent Translations"}
          </h2>
          {hasSearched && query && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Matches for &ldquo;{query}&rdquo;
            </span>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-8 max-w-lg mx-auto">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No matching translations found.
            </p>
            <p dir="rtl" className="font-nastaliq text-xl text-brand-gold mb-4">
              ہچ مٹ و بدل اس دا لوز تا ردٹ ملاو متو۔
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Try checking your spelling, using broader keywords, or searching by author name.
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
