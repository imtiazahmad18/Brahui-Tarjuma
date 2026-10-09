import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { getStaticPage } from "@/lib/data";
import { BookOpen, Sparkles, Heart, Globe, Feather } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us (باروٹ) — Brahui Tarjuma",
  description:
    "Learn about Brahui Tarjuma, an independent digital library and archive dedicated to rendering universal literature and poetry into the Brahui language.",
};

export default async function AboutPage() {
  const page = await getStaticPage("about");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header with Circular Logo */}
      <div className="text-center mb-12">
        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-brand-gold/60 shadow-md">
          <Image
            src="/logo-square.png"
            alt="Brahui Tarjuma Seal"
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-brand-teal dark:text-teal-400">
          Digital Archive & Mission
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-2 mb-3">
          About Brahui Tarjuma
        </h1>

        <div dir="rtl" className="py-2">
          <span className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
            براہوئی ترجمہ نا فکری پند و کاریم
          </span>
        </div>
      </div>

      {/* Main Body Content Card */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-10 shadow-sm space-y-8">
        <div className="prose dark:prose-invert max-w-none text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
          <p className="whitespace-pre-line leading-relaxed font-sans">
            {page.body}
          </p>
        </div>

        {/* Brahui Calligraphic Mission Statement */}
        <div
          dir="rtl"
          lang="brh"
          className="p-6 sm:p-8 rounded-xl bg-gradient-to-tr from-brand-teal/5 to-brand-gold/10 dark:from-brand-teal/20 dark:to-brand-gold/15 border border-brand-gold/30 text-right"
        >
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-gold block mb-2">
            ادبی منشور
          </span>
          <p className="font-nastaliq text-xl sm:text-2xl leading-nastaliq text-gray-900 dark:text-gray-100">
            براہوئی ترجمہ نا مسخت جہان نا عظیم شہکار ادب، نثری قصّہ غاتی، جدید و کلاسیکی شاعری، و فلسفیانہ مضامین آتے براہوئی زبان نا نفاست و شیرینی ٹی نذر کننگ ءِ، تانکہ ننا وانوک آ نسل جہانی فکر و ادب تون ہمگرنچ مرے۔
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <Globe className="w-6 h-6 text-brand-teal dark:text-teal-400 mb-2" />
            <h3 className="font-serif font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              Universal Canon
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Bringing Nobel laureates, modern classics, and timeless poetry into Brahui.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <Feather className="w-6 h-6 text-brand-gold mb-2" />
            <h3 className="font-serif font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              Nastaliq Aesthetics
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Preserving traditional Urdu/Arabic Nastaliq calligraphic typography.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <Heart className="w-6 h-6 text-brand-maroon mb-2" />
            <h3 className="font-serif font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              Open & Non-Commercial
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              100% free digital library for readers, researchers, and students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
