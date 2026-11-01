import { NextResponse } from "next/server";
import { getPublishedArticles } from "@/lib/data";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";
  const articles = await getPublishedArticles();

  const rssItems = articles
    .map((article) => {
      const pubDate = article.published_at
        ? new Date(article.published_at).toUTCString()
        : new Date().toUTCString();

      const writerName = article.writer ? article.writer.name : "Original Author";
      const excerpt = (article.meta_description || article.body.slice(0, 200))
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/article/${article.slug}</link>
      <guid>${siteUrl}/article/${article.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
      <author>${writerName}</author>
      <category>${article.category}</category>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Brahui Tarjuma (براہوئی ترجمہ)</title>
    <link>${siteUrl}</link>
    <description>Translations of World Literature, Poetry, and Criticism into Brahui</description>
    <language>brh</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
