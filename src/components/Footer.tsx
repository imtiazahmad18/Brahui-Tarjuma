import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/types";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F4EFE6] dark:bg-[#0B111A] border-t border-[#E8E2D9] dark:border-[#243245] transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-gold/60 shadow-sm">
                <Image
                  src="/logo-square.png"
                  alt="Brahui Tarjuma Emblem"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-teal dark:text-teal-300 font-serif">
                  Brahui Tarjuma
                </h3>
                <p dir="rtl" className="text-sm font-nastaliq text-brand-gold dark:text-amber-400 font-semibold">
                  براہوئی ترجمہ • مٹ و بدل
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              A specialized digital archive dedicated to translating world masterpieces, classical fiction, 
              contemporary poetry, criticism, and scholarly research into the Brahui language, presented 
              in authentic Jameel Noori Nastaliq script.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {Object.values(CATEGORIES).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 transition-colors flex items-center justify-between"
                  >
                    <span>{cat.englishName}</span>
                    <span className="font-nastaliq text-xs text-brand-gold dark:text-amber-400" dir="rtl">
                      {cat.urduName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation & Administration */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Library & Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/writers"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 transition-colors"
                >
                  Original Writers (نوشتہ کار)
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 transition-colors"
                >
                  About the Project
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 transition-colors"
                >
                  Submissions & Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/feed.xml"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 transition-colors"
                >
                  RSS Feed (feed.xml)
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Admin Login</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <p>
            &copy; {currentYear} Brahui Tarjuma. Preserving and translating literature into Brahui.
          </p>
          <p className="mt-2 sm:mt-0 font-nastaliq text-sm" dir="rtl">
            براہوئی زبان ٹی جہانی ادب نا مٹ و بدل
          </p>
        </div>
      </div>
    </footer>
  );
}
