"use client";

import React, { useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const enRef = useRef<HTMLButtonElement>(null);
  const brhRef = useRef<HTMLButtonElement>(null);
  const choose = (next: "en" | "brh") => {
    setLocale(next);
    (next === "en" ? enRef : brhRef).current?.focus();
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      choose(locale === "en" ? "brh" : "en");
    }
  };
  return <div role="radiogroup" aria-label={t("locale.switcher")} dir="ltr" onKeyDown={onKeyDown} className={`language-switch ${className}`}>
    <span aria-hidden="true" className={`language-switch-indicator ${locale === "brh" ? "is-brh" : ""}`} />
    <button ref={enRef} type="button" role="radio" aria-checked={locale === "en"} tabIndex={locale === "en" ? 0 : -1} onClick={() => choose("en")} className="language-switch-option">EN</button>
    <button ref={brhRef} type="button" role="radio" aria-checked={locale === "brh"} tabIndex={locale === "brh" ? 0 : -1} onClick={() => choose("brh")} className="language-switch-option font-nastaliq">براہوئی</button>
  </div>;
}
