import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { WebSiteJsonLd } from "@/components/SEOHead";
import { cookies } from "next/headers";
import { normalizeLocale } from "@/lib/i18n";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getCategoryBrahuiNames } from "@/lib/data";
import { SITE_NAME, SITE_NAME_BRH, getSiteName } from "@/lib/brand";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

export const viewport: Viewport = {
  themeColor: "#0D4D54",
  width: "device-width",
  initialScale: 1,
};

const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Original Brahui Literature and Translations | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Original Brahui literature and translations into Brahui.",
  keywords: [
    "Brahui",
    SITE_NAME,
    "براہوئی",
    SITE_NAME_BRH,
    "Brahui Literature",
    "Brahui Poetry",
    "Nastaliq",
    "World Literature Translation",
    "Balochistan",
  ],
  authors: [{ name: `${SITE_NAME} Editorial Archive` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${SITE_NAME} — Original Brahui Literature and Translations`,
    description:
      "Original Brahui literature and translations into Brahui.",
    siteName: SITE_NAME,
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brahui Laozaank wordmark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Original Brahui literature and translations into Brahui.",
    images: ["/brand/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const siteName = getSiteName(locale);
  return {
    ...baseMetadata,
    title: {
      default: `Original Brahui Literature and Translations | ${siteName}`,
      template: `%s | ${siteName}`,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${siteName} — Original Brahui Literature and Translations`,
      siteName,
    },
    twitter: { ...baseMetadata.twitter, title: siteName },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const categoryNames = await getCategoryBrahuiNames();
  return (
    <html lang={initialLocale === "brh" ? "brh" : "en"} dir={initialLocale === "brh" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { var t=localStorage.getItem('theme'); if (t==='dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark'); } catch (_) {}` }} />
        <link rel="preload" href="/fonts/jameel-noori-nastaliq.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-[#0F1722] text-[#1C242E] dark:text-[#F3F4F6]">
       <LocaleProvider initialLocale={initialLocale} categoryNames={categoryNames}>
        <WebSiteJsonLd siteUrl={siteUrl} locale={initialLocale} />
        <ScrollReveal />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
       </LocaleProvider>
      </body>
    </html>
  );
}
