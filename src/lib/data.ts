import { supabase, isSupabaseConfigured } from "./supabase";
import { STATIC_PAGES_SEED } from "@/data/seedData";
import { Article, CategorySlug, Writer, StaticPageData, CATEGORY_BY_SLUG, CATEGORY_NODES } from "@/types";
import { normalizeUrduSearch } from "./utils";

const LEGACY_CATEGORY_MAP: Record<string, CategorySlug> = {
  fiction: "short-story", poetry: "nazm", criticism: "criticism", research: "research", articles: "articles",
};

function normalizeArticleRow(row: any): Article {
  const slug = LEGACY_CATEGORY_MAP[row.category] || row.category;
  const staticInfo = CATEGORY_BY_SLUG(slug);
  return { ...row, category: slug, category_info: staticInfo ? { ...staticInfo, name_brh: row.category_info?.name_brh || row.category_info?.name_ur || staticInfo.urduName, id: row.category_info?.id, parent_id: row.category_info?.parent_id } as any : null } as Article;
}

function descendantsOf(slug: CategorySlug): Set<string> {
  const descendants = new Set<string>([slug]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of CATEGORY_NODES) {
      if (node.parentSlug && descendants.has(node.parentSlug) && !descendants.has(node.slug)) {
        descendants.add(node.slug); changed = true;
      }
    }
  }
  return descendants;
}

/**
 * Fetch all published articles with writer info
 */
export async function getPublishedArticles(): Promise<Article[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`*, writer:writers(*), chapters(*), category_info:categories(*)`)
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (!error && data) return data.map(normalizeArticleRow);

      // Lets the pre-taxonomy site continue serving existing rows until its migration is applied.
      const fallback = await supabase.from("articles").select(`*, writer:writers(*), chapters(*)`).eq("status", "published").order("published_at", { ascending: false });
      if (!fallback.error && fallback.data) return fallback.data.map(normalizeArticleRow);
      console.warn("Supabase fetch failed while loading published articles:", error || fallback.error);
    } catch (e) {
      console.warn("Supabase fetch failed while loading published articles:", e);
    }
  }
  return [];
}

/**
 * Fetch single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("articles")
        .select(`*, writer:writers(*), chapters(*), category_info:categories(*)`)
        .eq("slug", slug).single();
      if (!error && data) {
        if (data.chapters && Array.isArray(data.chapters)) data.chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number);
        return normalizeArticleRow(data);
      }
      const fallback = await supabase.from("articles").select(`*, writer:writers(*), chapters(*)`).eq("slug", slug).single();
      if (!fallback.error && fallback.data) return normalizeArticleRow(fallback.data);
    } catch (e) { console.warn("Supabase fetch failed while loading an article:", e); }
  }
  return null;
}

/**
 * Fetch articles by category
 */
export async function getArticlesByCategory(
  category: CategorySlug,
  page = 1,
  limit = 12,
  contentType?: "translation" | "original"
): Promise<{ articles: Article[]; total: number }> {
  const allArticles = await getPublishedArticles();
  const descendants = descendantsOf(category);
  const filtered = allArticles.filter((a) => descendants.has(a.category_info?.slug || a.category) && (!contentType || (a.content_type || "translation") === contentType));
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    articles: paginated,
    total: filtered.length,
  };
}

/**
 * Fetch all writers
 */
export async function getAllWriters(): Promise<Writer[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("writers")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        return data as Writer[];
      }
    } catch (e) {
      console.warn("Supabase fetch failed while loading writers:", e);
    }
  }

  return [];
}

export async function getCategoryBrahuiNames(): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) return {};
  try {
    const { data, error } = await supabase.from("categories").select("slug, name_brh, name_ur, name_en");
    if (!error && data) return Object.fromEntries(data.map((row: any) => [row.slug, row.name_brh || row.name_ur || row.name_en]));
  } catch (error) {
    console.warn("Supabase fetch failed while loading category names:", error);
  }
  return {};
}

/**
 * Fetch writer by slug with their articles
 */
export async function getWriterBySlug(slug: string): Promise<{ writer: Writer | null; articles: Article[] }> {
  const [writers, articles] = await Promise.all([
    getAllWriters(),
    getPublishedArticles(),
  ]);
  const writer = writers.find((w) => w.slug === slug) || null;
  if (!writer) return { writer: null, articles: [] };
  const writerArticles = articles.filter(
    (a) => a.writer_id === writer.id || (a.writer && a.writer.slug === slug)
  );

  return { writer, articles: writerArticles };
}

/**
 * Related articles (same category or same writer, excluding current)
 */
export async function getRelatedArticles(
  currentSlug: string,
  category: CategorySlug,
  writerId?: string | null,
  limit = 3,
  contentType?: "translation" | "original"
): Promise<Article[]> {
  const all = await getPublishedArticles();
  const others = all.filter((a) => a.slug !== currentSlug);

  const wantedCategory = CATEGORY_BY_SLUG(category)?.slug || category;
  const matched = others.sort((a,b) => Number((b.content_type || "translation") === contentType && b.category === wantedCategory) - Number((a.content_type || "translation") === contentType && a.category === wantedCategory) || Number(Boolean(writerId && b.writer_id === writerId)) - Number(Boolean(writerId && a.writer_id === writerId))).filter((a) => a.category === wantedCategory || (writerId && a.writer_id === writerId));
  if (matched.length >= limit) {
    return matched.slice(0, limit);
  }

  // Fallback to any remaining
  const set = new Set(matched.map((m) => m.id));
  const remaining = others.filter((o) => !set.has(o.id));
  return [...matched, ...remaining].slice(0, limit);
}

/**
 * Multi-lingual search: checks title, body, original writer, translator, and original text
 */
export async function searchArticles(query: string): Promise<Article[]> {
  if (!query || query.trim() === "") return [];
  const normalizedQ = normalizeUrduSearch(query);
  const rawQ = query.trim().toLowerCase();

  const allArticles = await getPublishedArticles();

  return allArticles.filter((article) => {
    const titleNorm = normalizeUrduSearch(article.title);
    const bodyNorm = normalizeUrduSearch(article.body);
    const origTitleNorm = normalizeUrduSearch(article.original_title || "");
    const origTextNorm = normalizeUrduSearch(article.original_text || "");
    const writerNameNorm = normalizeUrduSearch(article.writer?.name || "");
    const translatorNorm = normalizeUrduSearch(article.translator_name || "");

    return (
      titleNorm.includes(normalizedQ) ||
      article.title.toLowerCase().includes(rawQ) ||
      bodyNorm.includes(normalizedQ) ||
      origTitleNorm.includes(normalizedQ) ||
      origTextNorm.includes(normalizedQ) ||
      writerNameNorm.includes(normalizedQ) ||
      translatorNorm.includes(normalizedQ) ||
      (article.subtitle && normalizeUrduSearch(article.subtitle).includes(normalizedQ))
    );
  });
}

/**
 * Fetch static page content (About / Contact)
 */
export async function getStaticPage(id: string): Promise<StaticPageData> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("static_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const staticPage = data as StaticPageData;
        // Branding may be updated while older page copy still lives in the DB.
        // Normalize only the previous site name, preserving other page text.
        const rebrand = (value: string) =>
          value
            .replaceAll("Brahui Tarjuma", "Brahui Laozaank")
            .replaceAll("براہوئی ترجمہ", "براہوئی لوزانک");
        return {
          ...staticPage,
          title: rebrand(staticPage.title),
          body: id === "about"
            ? rebrand(staticPage.body).replace(/a dedicated literary repository committed to translating[\s\S]*?language\./i, "a literary publication for original writing in Brahui and translations into Brahui.").replace(/committed to translating world literature[\s\S]*?Brahui language\./i, "publishing original Brahui writing and translations into Brahui.")
            : rebrand(staticPage.body),
        };
      }
    } catch {
      // fallback
    }
  }

  return (
    STATIC_PAGES_SEED[id] || {
      id,
      title: id.charAt(0).toUpperCase() + id.slice(1),
      body: "Content coming soon.",
    }
  );
}
