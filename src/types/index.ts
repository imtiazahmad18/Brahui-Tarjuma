export type CategorySlug =
  | "fiction"
  | "poetry"
  | "criticism"
  | "research"
  | "articles";

export interface CategoryInfo {
  slug: CategorySlug;
  englishName: string;
  urduName: string;
  description: string;
}

export const CATEGORIES: Record<CategorySlug, CategoryInfo> = {
  fiction: {
    slug: "fiction",
    englishName: "Fiction",
    urduName: "فکشن",
    description: "Short stories, novels, and prose fiction translated into Brahui",
  },
  poetry: {
    slug: "poetry",
    englishName: "Poetry",
    urduName: "شاعری",
    description: "Classical and modern world poetry rendered in lyrical Brahui verse",
  },
  criticism: {
    slug: "criticism",
    englishName: "Criticism",
    urduName: "نغد",
    description: "Literary critique, theory, and analytical perspectives in Brahui",
  },
  research: {
    slug: "research",
    englishName: "Research",
    urduName: "پٹّ و پول",
    description: "Scholarly research papers, linguistic studies, and historical essays",
  },
  articles: {
    slug: "articles",
    englishName: "Articles",
    urduName: "نوشتانک",
    description: "Philosophical, cultural, and literary essays and translated articles",
  },
};

export interface Writer {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
  articles?: Article[];
}

export interface Chapter {
  id: string;
  article_id: string;
  chapter_number: number;
  title: string;
  body: string;
  created_at?: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  category: CategorySlug;
  body: string;
  cover_image_url: string;
  cover_alt?: string | null;
  writer_id?: string | null;
  writer?: Writer | null;
  original_title?: string | null;
  original_text?: string | null;
  original_lang?: string | null; // e.g. 'en', 'ur', 'ar', 'fa'
  original_dir?: "ltr" | "rtl";
  source_credit?: string | null;
  translator_name?: string | null;
  pdf_url?: string | null;
  meta_description?: string | null;
  status: "draft" | "published";
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  chapters?: Chapter[];
}

export interface StaticPageData {
  id: string;
  title: string;
  body: string;
  updated_at?: string;
}
