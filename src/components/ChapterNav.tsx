"use client";

import React from "react";
import { Chapter } from "@/types";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface ChapterNavProps {
  chapters: Chapter[];
  currentChapterIndex: number;
  onSelectChapter: (index: number) => void;
}

export default function ChapterNav({
  chapters,
  currentChapterIndex,
  onSelectChapter,
}: ChapterNavProps) {
  if (!chapters || chapters.length === 0) return null;

  const currentChapter = chapters[currentChapterIndex];
  const hasPrev = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < chapters.length - 1;

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-5 my-8 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-teal dark:text-teal-300">
          <BookOpen className="w-4 h-4" />
          <span>Novel Chapters ({chapters.length} Parts)</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Chapter {currentChapterIndex + 1} of {chapters.length}
        </span>
      </div>

      {/* Chapter Dropdown Selector */}
      <div className="mb-4">
        <label htmlFor="chapter-select" className="sr-only">
          Select Chapter
        </label>
        <select
          id="chapter-select"
          value={currentChapterIndex}
          onChange={(e) => onSelectChapter(Number(e.target.value))}
          className="w-full bg-[#FBF9F5] dark:bg-[#0F1722] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-teal focus:outline-none"
        >
          {chapters.map((chap, idx) => (
            <option key={chap.id || idx} value={idx}>
              Chapter {chap.chapter_number}: {chap.title}
            </option>
          ))}
        </select>
      </div>

      {/* Chapter Previous and Next Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onSelectChapter(currentChapterIndex - 1)}
          disabled={!hasPrev}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            hasPrev
              ? "bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-300 hover:bg-brand-teal hover:text-white"
              : "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Chapter</span>
        </button>

        <button
          onClick={() => onSelectChapter(currentChapterIndex + 1)}
          disabled={!hasNext}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            hasNext
              ? "bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-teal-300 hover:bg-brand-teal hover:text-white"
              : "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
