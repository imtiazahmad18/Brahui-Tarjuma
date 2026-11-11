import type { Metadata } from "next";
import { cookies } from "next/headers";
import { normalizeLocale } from "@/lib/i18n";
export function generateMetadata(): Metadata {
  const isBrh = normalizeLocale(cookies().get("brahui-locale")?.value) === "brh";
  return isBrh
    ? { title: "ادب ڳُلہ", description: "براہوئی زبان ءَ ادب، نوشتگ ءُ ترجمہ ڳُلہ کن۔", alternates: { canonical: "/search" } }
    : { title: "Search Brahui Literature", description: "Search original Brahui writing and translations in Urdu, Arabic, Brahui, and English.", alternates: { canonical: "/search" } };
}
export default function SearchLayout({ children }: { children: React.ReactNode }) { return children; }
