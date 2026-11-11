"use client";
import React from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import Logo from "@/components/Logo";


export default function Footer() {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F4EFE6] dark:bg-[#0B111A] border-t border-[#E8E2D9] dark:border-[#243245] transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center">
              <Logo width={220} height={172} sizes="220px" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              {t("footer.mission")}
            </p>
          </div>

          {/* Main sections */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">{t("label.explore")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/poetry" className="text-gray-700 dark:text-gray-300 hover:text-brand-teal">{t("footer.poetry")}</Link></li>
              <li><Link href="/prose" className="text-gray-700 dark:text-gray-300 hover:text-brand-teal">{t("footer.prose")}</Link></li>
            </ul>
          </div>

          {/* Navigation & Administration */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              {t("label.libraryLinks")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/writers"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 transition-colors"
                >
                  {t("menu.writers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 transition-colors"
                >
                  {t("label.aboutProject")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 transition-colors"
                >
                  {t("menu.contact")}
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>{t("label.adminLogin")}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <p>
            &copy; {currentYear} {t("site.name")}. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
