"use client";

import React, { useState } from "react";
import {
  Share2,
  Clock,
  Type,
  Sun,
  Moon,
  Download,
  Check,
  Printer,
  FileText,
} from "lucide-react";

interface ReaderToolbarProps {
  readingTime: number;
  fontSize: number; // in pixels
  setFontSize: (size: number) => void;
  title: string;
  pdfUrl?: string | null;
  slug: string;
}

export default function ReaderToolbar({
  readingTime,
  fontSize,
  setFontSize,
  title,
  pdfUrl,
  slug,
}: ReaderToolbarProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://brahuitarjuma.org/article/${slug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\nRead translation in Brahui:\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`${title} - Brahui translation:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="reader-toolbar bg-[#F4EFE6] dark:bg-[#131C28] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-3 sm:p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      {/* Left: Reading time & text size controls */}
      <div className="flex items-center flex-wrap gap-4">
        {/* Estimated reading time */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 text-brand-teal dark:text-teal-400" />
          <span>{readingTime} min read</span>
        </div>

        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

        {/* Font size increase / decrease buttons */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#1A2536] px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
          <button
            onClick={() => setFontSize(Math.max(16, fontSize - 2))}
            aria-label="Decrease text size"
            className="p-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-400 transition-colors"
            title="Smaller font"
          >
            A-
          </button>
          <span className="text-xs px-1.5 text-gray-500 dark:text-gray-400 font-mono">
            {fontSize}px
          </span>
          <button
            onClick={() => setFontSize(Math.min(32, fontSize + 2))}
            aria-label="Increase text size"
            className="p-1 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-teal dark:hover:text-teal-400 transition-colors"
            title="Larger font"
          >
            A+
          </button>
        </div>
      </div>

      {/* Right: PDF Download / Print & Social Share buttons */}
      <div className="flex items-center flex-wrap gap-2">
        {/* PDF Download if present */}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-maroon text-white hover:bg-brand-maroon/90 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        )}

        {/* Print / Save as PDF button */}
        <button
          onClick={handlePrint}
          aria-label="Print article or save as PDF"
          title="Print / Save PDF"
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1A2536] hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#1A2536] p-1 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            aria-label="Share on WhatsApp"
            title="Share to WhatsApp"
            className="px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
          >
            WhatsApp
          </button>

          {/* X / Twitter */}
          <button
            onClick={handleShareX}
            aria-label="Share on X"
            title="Share on X"
            className="px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            X
          </button>

          {/* Facebook */}
          <button
            onClick={handleShareFacebook}
            aria-label="Share on Facebook"
            title="Share on Facebook"
            className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
          >
            FB
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            aria-label="Copy link"
            title="Copy link"
            className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <span>Copy Link</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
