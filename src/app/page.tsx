import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublishedArticles, getAllWriters } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORIES, CategorySlug } from "@/types";
import { BookOpen, Sparkles, Feather, ArrowRight, Library } from "lucide-react";

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const articles = await getPublishedArticles();
  const writers = await getAllWriters();

  const featuredArticle = articles[0] || null;
  const recentArticles = articles.slice(1, 7);

  // Group by category for section showcases
  const categorySections: { slug: CategorySlug; name: string; urdu: string }[] = [
    { slug: "fiction", name: "Fiction", urdu: "فکشن" },
    { slug: "poetry", name: "Poetry", urdu: "شاعری" },
    { slug: "articles", name: "Articles & Essays", urdu: "نوشتانک" },
    { slug: "criticism", name: "Criticism", urdu: "نغد" },
    { slug: "research", name: "Research", urdu: "پٹّ و پول" },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Branding Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F4EFE6] via-[#FBF9F5] to-[#FBF9F5] dark:from-[#0B111A] dark:via-[#0F1722] dark:to-[#0F1722] border-b border-[#E8E2D9] dark:border-[#243245] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Brahui Translation Digital Archive</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-gray-900 dark:text-gray-100">
                Brahui Tarjuma
              </h1>

              {/* Nastaliq Hero Subtitle */}
              <div dir="rtl" lang="brh" className="pt-1">
                <p className="font-nastaliq text-2xl sm:text-3xl lg:text-4xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
                  جہانی ادب نا براہوئی زبان ئٹی گچین مٹ و بدل
                </p>
              </div>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                An open digital sanctuary dedicated to rendering world literature, fiction, poetry,
                philosophical essays, and scholarly research into Brahui, in traditional Jameel Noori Nastaliq script.
              </p>

              {/* Category Quick Links */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-2">
                {Object.values(CATEGORIES).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1A2536] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-teal dark:hover:border-teal-400 hover:text-brand-teal transition-all shadow-xs"
                  >
                    <span>{cat.englishName}</span>
                    <span className="font-nastaliq text-brand-gold dark:text-amber-400" dir="rtl">
                      ({cat.urduName})
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Hero Visual: Circular Emblem Logo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-0 bg-gradient-to-tr from-brand-gold/40 via-brand-teal/30 to-brand-gold/40 shadow-xl">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#17212F] border-4 border-white dark:border-gray-800">
                  <Image
                    src="/brahui-tarjuma.jpeg"
                    alt="Brahui Tarjuma Official Emblem"
                    fill
                    sizes="(max-width: 640px) 256px, 320px"
                    className="object-contain p-0"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article Showcase */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-teal dark:text-teal-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-gray-100">
                Featured Translation
              </h2>
            </div>
            <span className="font-nastaliq text-lg text-brand-gold dark:text-amber-400" dir="rtl">
              گچین مٹ
            </span>
          </div>

          <ArticleCard article={featuredArticle} featured={true} />
        </section>
      )}

      {/* Recent Translations Grid */}
      {recentArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Feather className="w-5 h-5 text-brand-teal dark:text-teal-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-gray-100">
                Recent Translations
              </h2>
            </div>
            <span className="font-nastaliq text-lg text-brand-gold dark:text-amber-400" dir="rtl">
              تازہ ترین مٹ و بدل
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>
      )}

      {/* Sections by Category */}
      {categorySections.map((sec) => {
        const catArticles = articles.filter((a) => a.category === sec.slug).slice(0, 3);
        if (catArticles.length === 0) return null;

        return (
          <section key={sec.slug} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-gray-100">
                  {sec.name}
                </h2>
                <span className="font-nastaliq text-lg text-brand-gold dark:text-amber-400" dir="rtl">
                  ({sec.urdu})
                </span>
              </div>
              <Link
                href={`/category/${sec.slug}`}
                className="text-xs sm:text-sm font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-teal-light flex items-center gap-1 group"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catArticles.map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Featured Writers Strip */}
      {writers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFFFFF] dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Library className="w-5 h-5 text-brand-teal dark:text-teal-400" />
                <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100">
                  Translated Authors
                </h2>
              </div>
              <Link
                href="/writers"
                className="text-xs sm:text-sm font-semibold text-brand-teal dark:text-teal-400 hover:underline"
              >
                All Writers &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {writers.slice(0, 4).map((w) => (
                <Link
                  key={w.id}
                  href={`/writer/${w.slug}`}
                  className="group p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-teal dark:hover:border-teal-400 bg-gray-50/50 dark:bg-gray-800/30 transition-all flex items-center space-x-3"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                    {w.photo_url ? (
                      <Image
                        src={w.photo_url}
                        alt={w.name}
                        fill
                        sizes="48px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-lg font-bold text-brand-teal">
                        {w.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-teal truncate">
                      {w.name.split("(")[0].trim()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      View translations
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
