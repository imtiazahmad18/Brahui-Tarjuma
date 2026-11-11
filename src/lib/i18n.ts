import en from "../../locales/en.json";
import brh from "../../locales/brh.json";

export type Locale = "en" | "brh";
export type MessageKey = keyof typeof en;
export const dictionaries = { en, brh } as const;
export function normalizeLocale(value?: string | null): Locale {
  return value === "brh" || value === "ur" ? "brh" : "en";
}
export function translate(locale: Locale, key: MessageKey): string {
  return dictionaries[locale][key] || en[key];
}
