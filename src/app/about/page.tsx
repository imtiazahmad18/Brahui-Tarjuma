import React from "react";
import Logo from "@/components/Logo";
import type { Metadata } from "next";
import { getStaticPage } from "@/lib/data";
import { BookOpen, Sparkles, Heart, Globe, Feather } from "lucide-react";
import { cookies } from "next/headers";
import { normalizeLocale, translate } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/brand";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us (باروٹ)",
  description:
    `Learn how ${SITE_NAME} publishes original writing in Brahui and translations into Brahui.`,
};

export default async function AboutPage() {
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const isBrh = locale === "brh";
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Brand and mission */}
      <div className="text-center mb-12">
        <div className="flex justify-center mx-auto mb-6"><Logo width={300} height={236} priority sizes="300px" /></div>

        <span className="text-xs font-semibold uppercase tracking-wider text-brand-teal dark:text-teal-400">
          {t("about.eyebrow")}
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-2 mb-3">
          {t("about.heading")}
        </h1>

        {isBrh && <div dir="rtl" className="py-2">
          <span className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
            {t("site.name")} نا بابت
          </span>
        </div>}
      </div>

      {/* Main Body Content Card */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-10 shadow-sm space-y-8">
        <div className="prose dark:prose-invert max-w-none text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
          <p className="whitespace-pre-line leading-relaxed font-sans">
            {t("about.mission")}
          </p>
        </div>

        {/* Brahui Calligraphic Mission Statement */}
        {isBrh && <div
          dir="rtl"
          lang="brh"
          className="p-6 sm:p-8 rounded-xl bg-gradient-to-tr from-brand-teal/5 to-brand-gold/10 dark:from-brand-teal/20 dark:to-brand-gold/15 border border-brand-gold/30 text-right"
        >
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-gold block mb-2">
            ادبی منشور
          </span>
          <p className="font-nastaliq text-xl sm:text-2xl leading-nastaliq text-gray-900 dark:text-gray-100">
            اِیں نا مسخت جہان نا عظیم شہکار ادب، نثری قصّہ غاتی، جدید و کلاسیکی شاعری، و فلسفیانہ مضامین آتے براہوئی زبان نا نفاست و شیرینی ٹی نذر کننگ ءِ، تانکہ ننا وانوک آ نسل جہانی فکر و ادب تون ہمگرنچ مرے۔
          </p>
        </div>}

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <Globe className="w-6 h-6 text-brand-teal dark:text-teal-400 mb-2" />
            <h3 className="font-serif font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              {t("about.pillar1")}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("about.pillar1Text")}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <Feather className="w-6 h-6 text-brand-gold mb-2" />
            <h3 className="font-serif font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              {t("about.pillar2")}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("about.pillar2Text")}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <Heart className="w-6 h-6 text-brand-maroon mb-2" />
            <h3 className="font-serif font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              {t("about.pillar3")}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("about.pillar3Text")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
