import { MetadataRoute } from "next";
import { getPublishedArticles, getAllWriters } from "@/lib/data";
import { CATEGORY_NODES, categoryPath } from "@/types";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";
  const [articles, writers] = await Promise.all([getPublishedArticles(), getAllWriters()]);
  const usedPaths = new Set<string>();
  for (const article of articles) for (const node of categoryPath(article.category)) usedPaths.add(node.href);
  const routes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...["/search", "/writers", "/about", "/contact"].map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...CATEGORY_NODES.filter((node) => usedPaths.has(node.href)).map((node) => ({ url: `${siteUrl}${node.href}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: node.level === 0 ? 0.9 : 0.8 })),
    ...writers.map((writer) => ({ url: `${siteUrl}/writer/${writer.slug}`, lastModified: writer.updated_at ? new Date(writer.updated_at) : new Date(), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...articles.map((article) => ({ url: `${siteUrl}/article/${article.slug}`, lastModified: article.updated_at ? new Date(article.updated_at) : new Date(), changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
  return routes;
}
