import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="relative w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-2 border-brand-gold/60">
        <Image
          src="/logo-square.png"
          alt="Brahui Tarjuma"
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <span className="text-sm font-semibold uppercase tracking-wider text-brand-maroon">
        Error 404
      </span>

      <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-2 mb-4">
        Page Not Found
      </h1>

      <div dir="rtl" className="py-2 mb-6">
        <p className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
          دا پنہ دستیاف متو یا موکلت کڑسہ ہنانے
        </p>
      </div>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 text-base">
        The translation or page you are searching for might have been moved, unpublished, or does not exist.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-teal text-white hover:bg-brand-teal-light transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-[#17212F] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-teal transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Search Library</span>
        </Link>
      </div>
    </div>
  );
}
