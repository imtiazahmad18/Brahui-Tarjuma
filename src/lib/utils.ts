import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates estimated reading time in minutes
 */
export function estimateReadingTime(text: string): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 180; // slightly conservative for Nastaliq / complex literary reading
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Formats date into readable string e.g. "Oct 12, 2024"
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "Recent";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recent";
  }
}

/**
 * Normalizes Urdu/Arabic text for forgiving search matching
 */
export function normalizeUrduSearch(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "") // remove arabic diacritics / tashkeel
    .replace(/[يىي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[ة]/g, "ہ")
    .replace(/[ھ]/g, "ہ")
    .replace(/[ؤ]/g, "و")
    .replace(/[إأآ]/g, "ا")
    .trim();
}

/**
 * Generates an English/URL safe slug from title or text
 */
export function generateSlug(text: string): string {
  if (!text) return `article-${Date.now()}`;
  
  // Basic transliteration dictionary for common Urdu/Brahui phonemes
  const charMap: Record<string, string> = {
    "ا": "a", "آ": "aa", "ب": "b", "پ": "p", "ت": "t", "ٹ": "t", "ث": "s",
    "ج": "j", "چ": "ch", "ح": "h", "خ": "kh", "د": "d", "ڈ": "d", "ذ": "z",
    "ر": "r", "ڑ": "r", "ز": "z", "ژ": "zh", "س": "s", "ش": "sh", "ص": "s",
    "ض": "z", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f", "ق": "q",
    "ک": "k", "گ": "g", "ل": "l", "م": "m", "ن": "n", "ں": "n", "و": "w",
    "ہ": "h", "ھ": "h", "ء": "", "ی": "y", "ے": "e", " ": "-"
  };

  let transliterated = "";
  for (const ch of text.trim()) {
    if (charMap[ch] !== undefined) {
      transliterated += charMap[ch];
    } else if (/[a-zA-Z0-9-]/.test(ch)) {
      transliterated += ch.toLowerCase();
    }
  }

  const slug = transliterated
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `article-${Math.floor(Math.random() * 899999 + 100000)}`;
}
