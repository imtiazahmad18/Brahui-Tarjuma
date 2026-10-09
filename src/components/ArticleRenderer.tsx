import React from "react";
import { CategorySlug } from "@/types";

interface ArticleRendererProps {
  body: string;
  category: CategorySlug;
  fontSize: number; // in pixels
}

export default function ArticleRenderer({
  body,
  category,
  fontSize,
}: ArticleRendererProps) {
  const isPoetry = category === "poetry";

  if (isPoetry) {
    // Preserve stanzas separated by double linebreaks, and lines within stanzas
    const stanzas = body.split(/\n\s*\n/).map((stanza) => stanza.trim()).filter(Boolean);

    return (
      <div
        dir="rtl"
        lang="brh"
        className="poem-container my-8"
        style={{ fontSize: `${fontSize}px` }}
      >
        {stanzas.map((stanza, sIdx) => {
          const lines = stanza.split(/\n/).map((line) => line.trim()).filter(Boolean);
          return (
            <div key={sIdx} className="stanza my-6 py-4">
              {lines.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className="line font-nastaliq text-gray-900 dark:text-gray-100 tracking-wide hover:text-brand-teal dark:hover:text-teal-300 transition-colors"
                >
                  {line}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // Prose / Essay / Short Story / Novel
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div
      dir="rtl"
      lang="brh"
      className="article-prose my-8 space-y-6 text-gray-900 dark:text-gray-100 font-nastaliq"
      style={{ fontSize: `${fontSize}px` }}
    >
      {paragraphs.map((p, idx) => (
        <p key={idx} className="leading-nastaliq text-justify">
          {p}
        </p>
      ))}
    </div>
  );
}
