import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/article/*/original", // Excludes original pages so Google ranks the Brahui translation!
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
