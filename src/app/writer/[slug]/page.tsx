import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWriterBySlug } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import { ArrowLeft, BookOpen, Feather } from "lucide-react";

interface WriterPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: WriterPageProps): Promise<Metadata> {
  const { writer } = await getWriterBySlug(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

  if (!writer) {
    return { title: "Writer Not Found" };
  }

  return {
    title: `${writer.name} — Brahui Translations`,
    description: writer.bio || `Brahui translations of works by ${writer.name}.`,
    alternates: {
      canonical: `${siteUrl}/writer/${writer.slug}`,
    },
    openGraph: {
      title: `${writer.name} — Brahui Tarjuma`,
      description: writer.bio || `Brahui translations of works by ${writer.name}.`,
      images: writer.photo_url ? [{ url: writer.photo_url }] : [],
    },
  };
}

export default async function WriterPage({ params }: WriterPageProps) {
  const { writer, articles } = await getWriterBySlug(params.slug);

  if (!writer) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/writers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-teal-light group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Writers (کل نوشتہ کار)</span>
        </Link>
      </div>

      {/* Author Bio Banner */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-8 sm:p-12 mb-12 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-4 border-brand-gold/60 shadow-md shrink-0">
            {writer.photo_url ? (
              <Image
                src={writer.photo_url}
                alt={writer.name}
                fill
                sizes="144px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif text-4xl font-bold text-brand-teal">
                {writer.name[0]}
              </div>
            )}
          </div>

          <div className="space-y-4 text-center sm:text-left flex-1">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-teal dark:text-teal-400">
                Author Archive
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-1">
                {writer.name}
              </h1>
            </div>

            {writer.bio && (
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {writer.bio}
              </p>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/20 text-brand-teal dark:text-amber-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{articles.length} Brahui Translation{articles.length === 1 ? "" : "s"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Translated Articles by this Writer */}
      <div className="space-y-8">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100">
            Translations of {writer.name.split("(")[0].trim()}
          </h2>
          <span className="font-nastaliq text-xl text-brand-gold dark:text-amber-400" dir="rtl">
            براہوئی مٹ و بدل
          </span>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-8">
            <p className="text-gray-600 dark:text-gray-300">
              No translated works have been published for this author yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
