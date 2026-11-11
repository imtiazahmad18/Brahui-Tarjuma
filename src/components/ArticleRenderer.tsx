import React from "react";
import { CategorySlug } from "@/types";

interface ArticleRendererProps {
  body: string;
  category: CategorySlug;
  fontSize: number; // in pixels
  brahuiMode?: boolean;
}

export default function ArticleRenderer({
  body,
  category,
  fontSize,
  brahuiMode = false,
}: ArticleRendererProps) {
  const isPoetry = ["ghazal", "sher", "rubai", "nazm", "prose-poem", "free-verse", "blank-verse", "folk-poetry", "other-poetry"].includes(category);
  const isGhazal = category === "ghazal";
  const isSingleCouplet = category === "sher";
  const isRubai = category === "rubai";
  const readingBaseSize = fontSize + (brahuiMode && isPoetry ? 2 : 0);
  const responsiveFontSize = brahuiMode
    ? `clamp(${Math.max(22, readingBaseSize - 2)}px, calc(${readingBaseSize}px - 2px + 0.45vw), ${readingBaseSize}px)`
    : `clamp(${Math.max(16, fontSize - 2)}px, calc(${fontSize}px - 2px + 0.45vw), ${fontSize}px)`;

  if (isPoetry) {
    // Preserve stanzas separated by double linebreaks, and lines within stanzas
    const stanzas = body.split(/\n\s*\n/);

    return (
      <div
        dir="rtl"
        lang="brh"
        className="poem-container my-4 sm:my-8 text-center"
        style={{ fontSize: responsiveFontSize }}
      >
        {isSingleCouplet || isRubai ? <div className="stanza my-6 py-4">{body.split(/\n/).map((line, index) => <div key={index} className="min-h-[1.8em] font-nastaliq text-gray-900 dark:text-gray-100">{line || " "}</div>)}</div> : stanzas.map((stanza, sIdx) => {
          const lines = stanza.split(/\n/);
          return (
            <div key={sIdx} className={`stanza my-6 py-4 ${isGhazal ? "border-b border-gray-100 dark:border-gray-800 last:border-0" : ""}`}>
              {lines.map((line, lIdx) => <div key={lIdx} className="line min-h-[1em] font-nastaliq text-gray-900 dark:text-gray-100 tracking-wide">{line || " "}</div>)}
            </div>
          );
        })}
      </div>
    );
  }

  // Prose / Essay / Short Story / Novel
  const paragraphs = body.split(/\n\s*\n/);

  return (
    <div
      dir="rtl"
      lang="brh"
      className="article-prose my-4 sm:my-8 space-y-4 sm:space-y-6 text-gray-900 dark:text-gray-100 font-nastaliq"
      style={{ fontSize: responsiveFontSize }}
    >
      {paragraphs.map((p, idx) => (
        <p key={idx} className="leading-nastaliq text-right whitespace-pre-wrap">
          {p}
        </p>
      ))}
    </div>
  );
}
