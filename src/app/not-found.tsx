import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Home, Search } from "lucide-react";
import { cookies } from "next/headers";
import { normalizeLocale, translate } from "@/lib/i18n";
import Logo from "@/components/Logo";

export default function NotFound() {
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const isBrh = locale === "brh";
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mx-auto mb-6"><Logo width={240} height={188} sizes="240px" /></div>

      <span className="text-sm font-semibold uppercase tracking-wider text-brand-maroon">
        Error 404
      </span>

      <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-2 mb-4">
        {t("error.notFound")}
      </h1>

      {isBrh && <div dir="rtl" className="py-2 mb-6">
        <p className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
          بَشخنداری۔۔۔ نُمے درکار ءَ ورخ دا وخت ءَ ساڑی اف        </p>
      </div>}

      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 text-base">
        {t("error.notFoundDescription")}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-teal text-white hover:bg-brand-teal-light transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>{t("error.backHome")}</span>
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-[#17212F] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-teal transition-all"
        >
          <Search className="w-4 h-4" />
          <span>{t("menu.search")}</span>
        </Link>
      </div>
    </div>
  );
}
