"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Menu, X, BookOpen } from "lucide-react";
import { CATEGORIES, CategorySlug } from "@/types";

const NAV_CATEGORIES: { slug: CategorySlug; english: string; urdu: string }[] = [
  { slug: "fiction", english: "Fiction", urdu: "فکشن" },
  { slug: "poetry", english: "Poetry", urdu: "شاعری" },
  { slug: "criticism", english: "Criticism", urdu: "نغد" },
  { slug: "research", english: "Research", urdu: "پٹّ و پول" },
  { slug: "articles", english: "Articles", urdu: "نوشتانک" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F5]/95 dark:bg-[#0F1722]/95 backdrop-blur border-b border-[#E8E2D9] dark:border-[#243245] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-6">
        <div className="flex items-center gap-2 h-20">
          {/* Circular Logo & Brand Name */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 group text-decoration-none focus:outline-none min-w-0"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden border border-brand-gold/60 bg-white shadow-sm group-hover:scale-[1.03] transition-transform">
              <Image
                src="/brand-logo-circle.png"
                alt="Brahui Matt o badal logo"
                fill
                sizes="(min-width: 640px) 56px, 48px"
                unoptimized
                className="object-contain"
                priority
              />
            </div>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[13px] sm:text-base lg:text-lg font-bold tracking-tight text-brand-teal dark:text-teal-300 font-serif whitespace-nowrap">
                Brahui Matt o badal
              </span>
              <span
                dir="rtl"
                className="text-[11px] sm:text-sm font-nastaliq text-brand-gold dark:text-amber-400 font-semibold whitespace-nowrap"
              >
                براہوئی مٹ و بدل
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-stretch mx-1 xl:mx-3">
            <Link
              href="/"
              className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                pathname === "/"
                  ? "text-brand-teal dark:text-teal-300 font-semibold bg-brand-teal/10 dark:bg-brand-teal/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
              }`}
            >
              <span>Home</span>
              <span dir="rtl" className="text-[11px] leading-none font-nastaliq font-normal text-brand-gold dark:text-amber-400">ہوم</span>
            </Link>

            {NAV_CATEGORIES.map((cat) => {
              const active = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "text-brand-teal dark:text-teal-300 font-semibold bg-brand-teal/10 dark:bg-brand-teal/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                  }`}
                >
                  <span>{cat.english}</span>
                  <span dir="rtl" className="text-[11px] leading-none font-nastaliq font-normal text-brand-gold dark:text-amber-400">{cat.urdu}</span>
                </Link>
              );
            })}

            <Link
              href="/writers"
              className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                pathname.startsWith("/writer")
                  ? "text-brand-teal dark:text-teal-300 font-semibold bg-brand-teal/10 dark:bg-brand-teal/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
              }`}
            >
              <span>Writers</span>
              <span dir="rtl" className="text-[11px] leading-none font-nastaliq font-normal text-brand-gold dark:text-amber-400">نوشتہ کار</span>
            </Link>

            <Link
              href="/about"
              className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                pathname === "/about"
                  ? "text-brand-teal dark:text-teal-300 font-semibold bg-brand-teal/10 dark:bg-brand-teal/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
              }`}
            >
              <span>About</span>
              <span dir="rtl" className="text-[11px] leading-none font-nastaliq font-normal text-brand-gold dark:text-amber-400">تعارف</span>
            </Link>

            <Link
              href="/contact"
              className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                pathname === "/contact"
                  ? "text-brand-teal dark:text-teal-300 font-semibold bg-brand-teal/10 dark:bg-brand-teal/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
              }`}
            >
              <span>Contact</span>
              <span dir="rtl" className="text-[11px] leading-none font-nastaliq font-normal text-brand-gold dark:text-amber-400">رابطہ</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex shrink-0 items-center space-x-2">
            {/* Search Button */}
            <Link
              href="/search"
              aria-label="Search translations"
              className="p-2 lg:p-2.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 lg:p-2.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
              {mounted && isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2D9] dark:border-[#243245] bg-[#FBF9F5] dark:bg-[#0F1722] px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Home
          </Link>

          <div className="pt-2 pb-1 border-t border-gray-200 dark:border-gray-800">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categories
            </span>
          </div>

          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>{cat.english}</span>
              <span className="font-nastaliq text-xs text-brand-gold dark:text-amber-400" dir="rtl">
                ({cat.urdu})
              </span>
            </Link>
          ))}

          <div className="pt-2 pb-1 border-t border-gray-200 dark:border-gray-800">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Explore & Info
            </span>
          </div>

          <Link
            href="/writers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Writers (نوشتہ کار)
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Contact & Submissions
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-1.5 rounded-md text-xs font-medium text-brand-teal dark:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
}
