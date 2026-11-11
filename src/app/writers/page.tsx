import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllWriters, getPublishedArticles } from "@/lib/data";
import { User, Library, BookOpen } from "lucide-react";
import { cookies } from "next/headers";
import { normalizeLocale, translate } from "@/lib/i18n";

export const revalidate = 60;

export function generateMetadata(): Metadata {
  const isBrh = normalizeLocale(cookies().get("brahui-locale")?.value) === "brh";
  return isBrh
    ? { title: "نوشتہ کار", description: "براہوئی نوشتہ کار ءُ براہوئی ءَ ترجمہ شدہ ادب نا مصنف ببین۔", alternates: { canonical: "/writers" } }
    : { title: "Writers", description: "Explore Brahui writers and foreign authors whose works are available in Brahui.", alternates: { canonical: "/writers" } };
}

export default async function WritersIndexPage({ searchParams }: { searchParams?: { type?: string } }) {
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const isBrh = locale === "brh";
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const [writers, articles] = await Promise.all([
    getAllWriters(),
    getPublishedArticles(),
  ]);

  const writerType = searchParams?.type === "brahui" || searchParams?.type === "foreign" ? searchParams.type : "all";
  const visibleWriters = writers.filter(w => writerType === "all" || (w.writer_type || "foreign") === writerType);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-8 sm:p-12 mb-12 shadow-sm text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-300 uppercase tracking-wider mb-4">
          <Library className="w-3.5 h-3.5" />
          <span>{t("writer.directory")}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-2">
          {t("menu.writers")}
        </h1>

        {isBrh && <div dir="rtl" className="py-2"><span className="font-nastaliq text-3xl sm:text-4xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">نوشتہ کار</span></div>}

        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-base sm:text-lg mt-2">
          {t("writer.description")}
        </p>
      </div>

      <nav className="flex justify-center gap-2 mb-8">{[{v:"all",t:t("writer.all")},{v:"brahui",t:t("writer.brahui")},{v:"foreign",t:t("writer.foreign")}].map(x=><Link key={x.v} href={`/writers?type=${x.v}`} className={`min-h-11 px-4 py-2 rounded-lg border ${writerType===x.v?"bg-brand-teal text-white":"bg-white dark:bg-[#17212F]"}`}>{x.t}</Link>)}</nav>
      {/* Writers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleWriters.map((writer) => {
          const writerArticles = articles.filter(
            (a) => a.writer_id === writer.id || (a.writer && a.writer.slug === writer.slug)
          );

          return (
            <Link
              key={writer.id}
              href={`/writer/${writer.slug}`}
              data-scroll-reveal
              className="group bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 shadow-sm hover:shadow-md hover:border-brand-teal dark:hover:border-teal-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-brand-gold/60 shrink-0">
                    {writer.photo_url ? (
                      <Image
                        src={writer.photo_url}
                        alt={writer.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-2xl font-bold text-brand-teal">
                        {writer.name[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-gray-100 group-hover:text-brand-teal transition-colors">
                      {writer.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs text-brand-teal dark:text-teal-400 font-medium mt-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{writerArticles.length} {isBrh ? "مٹ و بدل" : `work${writerArticles.length === 1 ? "" : "s"}`}</span>
                    </span>
                  </div>
                </div>

                {writer.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4">
                    {writer.bio}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold text-brand-teal dark:text-teal-400">
                <span>{isBrh ? "ھمے مٹ و بدل ببین" : "View all works"}</span>
                <span>&rarr;</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
