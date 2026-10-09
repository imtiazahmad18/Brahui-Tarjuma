import { MetadataRoute } from "next";
import { getPublishedArticles, getAllWriters } from "@/lib/data";
import { CATEGORIES } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";
  const articles = await getPublishedArticles();
  const writers = await getAllWriters();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/writers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Category pages
  Object.keys(CATEGORIES).forEach((cat) => {
    routes.push({
      url: `${siteUrl}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    });
  });

  // Writer pages
  writers.forEach((w) => {
    routes.push({
      url: `${siteUrl}/writer/${w.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Article pages (EXCLUDES /original and /admin as required!)
  articles.forEach((a) => {
    routes.push({
      url: `${siteUrl}/article/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  });

  return routes;
}
