import { supabase, isSupabaseConfigured } from "./supabase";
import { SEED_ARTICLES, SEED_WRITERS, STATIC_PAGES_SEED } from "@/data/seedData";
import { Article, CategorySlug, Writer, StaticPageData } from "@/types";
import { normalizeUrduSearch } from "./utils";

/**
 * Fetch all published articles with writer info
 */
export async function getPublishedArticles(): Promise<Article[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          writer:writers(*),
          chapters(*)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Article[];
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to seed articles:", e);
    }
  }

  // Fallback to seeds
  return SEED_ARTICLES.filter((a) => a.status === "published");
}

/**
 * Fetch single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          writer:writers(*),
          chapters(*)
        `)
        .eq("slug", slug)
        .single();

      if (!error && data) {
        // Sort chapters if any
        if (data.chapters && Array.isArray(data.chapters)) {
          data.chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number);
        }
        return data as Article;
      }
    } catch (e) {
      console.warn("Supabase fetch single article failed, falling back to seed articles:", e);
    }
  }

  const found = SEED_ARTICLES.find((a) => a.slug === slug);
  return found || null;
}

/**
 * Fetch articles by category
 */
export async function getArticlesByCategory(
  category: CategorySlug,
  page = 1,
  limit = 12
): Promise<{ articles: Article[]; total: number }> {
  const allArticles = await getPublishedArticles();
  const filtered = allArticles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
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

      if (!error && data && data.length > 0) {
        return data as Writer[];
      }
    } catch (e) {
      console.warn("Supabase fetch writers failed, falling back to seed writers:", e);
    }
  }

  return SEED_WRITERS;
}

/**
 * Fetch writer by slug with their articles
 */
export async function getWriterBySlug(slug: string): Promise<{ writer: Writer | null; articles: Article[] }> {
  const writers = await getAllWriters();
  const writer = writers.find((w) => w.slug === slug) || null;
  if (!writer) return { writer: null, articles: [] };

  const articles = await getPublishedArticles();
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
  limit = 3
): Promise<Article[]> {
  const all = await getPublishedArticles();
  const others = all.filter((a) => a.slug !== currentSlug);

  const matched = others.filter((a) => a.category === category || (writerId && a.writer_id === writerId));
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
        return data as StaticPageData;
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
