export type CategorySlug =
  | "poetry" | "prose" | "ghazal" | "sher" | "rubai" | "nazm"
  | "prose-poem" | "free-verse" | "blank-verse" | "folk-poetry" | "other-poetry"
  | "fiction" | "short-story" | "novelette" | "novel" | "drama" | "folk-tales" | "humour-satire"
  | "non-fiction" | "articles" | "essays" | "research" | "criticism" | "interviews"
  | "biographies" | "memoirs" | "sketches" | "travelogue" | "letters" | "reviews";

export interface CategoryInfo {
  slug: CategorySlug;
  englishName: string;
  urduName: string;
  name_brh?: string | null;
  description: string;
  parentSlug: CategorySlug | null;
  level: number;
  href: string;
  kind: "section" | "group" | "category" | "subcategory";
}

const categoryRows: CategoryInfo[] = [
  { slug:"poetry", englishName:"Poetry", urduName:"شاعری", description:"Brahui poetry in classical and contemporary forms.", parentSlug:null, level:0, href:"/poetry", kind:"section" },
  { slug:"ghazal", englishName:"Ghazal", urduName:"غزل", description:"Ghazals in Brahui.", parentSlug:"poetry", level:1, href:"/poetry/ghazal", kind:"category" },
  { slug:"sher", englishName:"Couplet / Sher", urduName:"شعر", description:"Standalone couplets in Brahui.", parentSlug:"poetry", level:1, href:"/poetry/sher", kind:"category" },
  { slug:"rubai", englishName:"Quatrain / Rubai", urduName:"رباعی", description:"Four-line rubai in Brahui.", parentSlug:"poetry", level:1, href:"/poetry/rubai", kind:"category" },
  { slug:"nazm", englishName:"Nazm", urduName:"نظم", description:"Nazm and its forms.", parentSlug:"poetry", level:1, href:"/poetry/nazm", kind:"group" },
  { slug:"prose-poem", englishName:"Prose Poem", urduName:"نثری نظم", description:"Prose poems in Brahui.", parentSlug:"nazm", level:2, href:"/poetry/nazm/prose-poem", kind:"subcategory" },
  { slug:"free-verse", englishName:"Free Verse", urduName:"آزاد نظم", description:"Free verse in Brahui.", parentSlug:"nazm", level:2, href:"/poetry/nazm/free-verse", kind:"subcategory" },
  { slug:"blank-verse", englishName:"Blank Verse", urduName:"نظمِ معریٰ", description:"Blank verse in Brahui.", parentSlug:"nazm", level:2, href:"/poetry/nazm/blank-verse", kind:"subcategory" },
  { slug:"folk-poetry", englishName:"Folk Poetry", urduName:"لوک شاعری", description:"Brahui folk poetry.", parentSlug:"poetry", level:1, href:"/poetry/folk-poetry", kind:"category" },
  { slug:"other-poetry", englishName:"Other Poetry", urduName:"دیگر", description:"Other forms of Brahui poetry.", parentSlug:"poetry", level:1, href:"/poetry/other-poetry", kind:"category" },
  { slug:"prose", englishName:"Prose", urduName:"نثر", description:"Fiction and non-fiction in Brahui.", parentSlug:null, level:0, href:"/prose", kind:"section" },
  { slug:"fiction", englishName:"Fiction", urduName:"فکشن", description:"Fiction written in or translated into Brahui.", parentSlug:"prose", level:1, href:"/prose/fiction", kind:"group" },
  { slug:"short-story", englishName:"Short Story", urduName:"افسانہ / مختصر کہانی", description:"Short stories in Brahui.", parentSlug:"fiction", level:2, href:"/prose/fiction/short-story", kind:"category" },
  { slug:"novelette", englishName:"Novelette", urduName:"ناولٹ", description:"Novelettes in Brahui.", parentSlug:"fiction", level:2, href:"/prose/fiction/novelette", kind:"category" },
  { slug:"novel", englishName:"Novel", urduName:"ناول", description:"Novels and serialized fiction in Brahui.", parentSlug:"fiction", level:2, href:"/prose/fiction/novel", kind:"category" },
  { slug:"drama", englishName:"Drama", urduName:"ڈراما", description:"Drama and scripts in Brahui.", parentSlug:"fiction", level:2, href:"/prose/fiction/drama", kind:"category" },
  { slug:"folk-tales", englishName:"Folk Tales", urduName:"لوک کہانیاں", description:"Folk tales in Brahui.", parentSlug:"fiction", level:2, href:"/prose/fiction/folk-tales", kind:"category" },
  { slug:"humour-satire", englishName:"Humour & Satire", urduName:"طنز و مزاح", description:"Humour and satire in Brahui.", parentSlug:"fiction", level:2, href:"/prose/fiction/humour-satire", kind:"category" },
  { slug:"non-fiction", englishName:"Non-Fiction", urduName:"غیر افسانوی", description:"Non-fiction writing in Brahui.", parentSlug:"prose", level:1, href:"/prose/non-fiction", kind:"group" },
  { slug:"articles", englishName:"Articles", urduName:"مضامین", description:"Articles in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/articles", kind:"category" },
  { slug:"essays", englishName:"Essays", urduName:"انشائیے", description:"Essays in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/essays", kind:"category" },
  { slug:"research", englishName:"Research", urduName:"تحقیق", description:"Research published in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/research", kind:"category" },
  { slug:"criticism", englishName:"Criticism", urduName:"تنقید", description:"Literary criticism in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/criticism", kind:"category" },
  { slug:"interviews", englishName:"Interviews", urduName:"انٹرویوز", description:"Interviews in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/interviews", kind:"category" },
  { slug:"biographies", englishName:"Biographies", urduName:"سوانح", description:"Biographies in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/biographies", kind:"category" },
  { slug:"memoirs", englishName:"Memoirs & Autobiography", urduName:"خود نوشت", description:"Memoirs and autobiography in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/memoirs", kind:"category" },
  { slug:"sketches", englishName:"Sketches", urduName:"خاکے", description:"Literary sketches in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/sketches", kind:"category" },
  { slug:"travelogue", englishName:"Travelogue", urduName:"سفرنامہ", description:"Travel writing in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/travelogue", kind:"category" },
  { slug:"letters", englishName:"Letters", urduName:"خطوط", description:"Letters in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/letters", kind:"category" },
  { slug:"reviews", englishName:"Reviews", urduName:"تبصرے", description:"Reviews in Brahui.", parentSlug:"non-fiction", level:2, href:"/prose/non-fiction/reviews", kind:"category" },
];

export const CATEGORY_NODES = categoryRows;
export const CATEGORIES = Object.fromEntries(categoryRows.map((row) => [row.slug, row])) as Record<CategorySlug, CategoryInfo>;
export const CATEGORY_LEAVES = categoryRows.filter((row) => !categoryRows.some((child) => child.parentSlug === row.slug));
export const CATEGORY_CHILDREN = (parent: CategorySlug) => categoryRows.filter((row) => row.parentSlug === parent);
export const CATEGORY_BY_SLUG = (slug: string) => CATEGORIES[slug as CategorySlug] || null;
export const categoryPath = (slug: string): CategoryInfo[] => {
  const result: CategoryInfo[] = [];
  let node: CategoryInfo | null = CATEGORY_BY_SLUG(slug);
  while (node) {
    result.unshift(node);
    node = node.parentSlug ? CATEGORY_BY_SLUG(node.parentSlug) : null;
  }
  return result;
};
export const categoryHref = (slug: string) => CATEGORY_BY_SLUG(slug)?.href || "/";
export const isPoetryCategory = (slug: string) => categoryPath(slug).some((node) => node.slug === "poetry");

export interface Writer {
  writer_type?: "brahui" | "foreign";
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
  content_type?: "translation" | "original";
  title: string;
  subtitle?: string | null;
  slug: string;
  category: CategorySlug;
  category_id?: string | null;
  category_info?: CategoryInfo | null;
  is_featured?: boolean;
  body: string;
  cover_image_url: string;
  cover_alt?: string | null;
  writer_id?: string | null;
  writer?: Writer | null;
  original_title?: string | null;
  original_text?: string | null;
  original_lang?: string | null; // e.g. 'en', 'ur', 'ar', 'fa'
  original_dir?: "ltr" | "rtl" | null;
  source_credit?: string | null;
  translator_name?: string | null;
  translator_title?: string | null;
  fiction_form?: "short_story" | "novel" | "other" | null;
  references_text?: string | null;
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
