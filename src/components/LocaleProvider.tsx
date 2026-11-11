"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { dictionaries, Locale, MessageKey, normalizeLocale, translate } from "@/lib/i18n";

type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: MessageKey) => string; categoryName: (slug: string, englishName: string, fallbackUrdu: string) => string };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, initialLocale, categoryNames = {} }: { children: React.ReactNode; initialLocale: Locale; categoryNames?: Record<string, string> }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const fallbackTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const effectiveLocale = pathname.startsWith("/admin") ? "en" : locale;
  useEffect(() => {
    const rtl = effectiveLocale === "brh";
    document.documentElement.lang = rtl ? "brh" : "en";
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.classList.toggle("locale-brh", rtl);
  }, [effectiveLocale]);
  const setLocale = (next: Locale) => {
    if (next === effectiveLocale) return;
    localStorage.setItem("brahui-locale", next);
    document.cookie = `brahui-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    const root = document.documentElement;
    const update = () => {
      root.lang = next === "brh" ? "brh" : "en";
      root.dir = next === "brh" ? "rtl" : "ltr";
      root.classList.toggle("locale-brh", next === "brh");
      setLocaleState(next);
      router.refresh();
    };
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    const viewDocument = document as Document & { startViewTransition?: (callback: () => void) => { finished: Promise<void> } };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion && viewDocument.startViewTransition) {
      viewDocument.startViewTransition(update);
    } else if (!reducedMotion) {
      root.classList.add("locale-switching");
      fallbackTimer.current = setTimeout(() => {
        update();
        window.requestAnimationFrame(() => root.classList.remove("locale-switching"));
      }, 90);
    } else {
      update();
    }
  };
  const value = useMemo(() => ({ locale: effectiveLocale as Locale, setLocale, t: (key: MessageKey) => translate(effectiveLocale as Locale, key), categoryName: (slug: string, english: string, fallbackUrdu: string) => {
    if (effectiveLocale !== "brh") return english;
    const dictionaryName = (dictionaries.brh as Record<string, string>)[`category.${slug}`];
    return categoryNames[slug] || dictionaryName || fallbackUrdu || english;
  } }), [effectiveLocale, categoryNames]);
  return <LocaleContext.Provider value={value}><div id="site-content">{children}</div></LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
