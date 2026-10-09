import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WebSiteJsonLd } from "@/components/SEOHead";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org";

export const viewport: Viewport = {
  themeColor: "#0D4D54",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brahui Tarjuma (براہوئی ترجمہ) — World Literature in Brahui",
    template: "%s | Brahui Tarjuma",
  },
  description:
    "A dedicated digital archive publishing Brahui translations of world fiction, classical and modern poetry, literary criticism, essays, and scholarly research in authentic Nastaliq script.",
  keywords: [
    "Brahui",
    "Brahui Tarjuma",
    "براہوئی",
    "براہوئی ترجمہ",
    "Brahui Literature",
    "Brahui Poetry",
    "Nastaliq",
    "World Literature Translation",
    "Balochistan",
  ],
  authors: [{ name: "Brahui Tarjuma Editorial Archive" }],
  creator: "Brahui Tarjuma",
  publisher: "Brahui Tarjuma",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/logo-square.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo-square.png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Brahui Tarjuma (براہوئی ترجمہ) — World Literature in Brahui",
    description:
      "A digital archive publishing Brahui translations of world essays, poems, short stories and novels in authentic Nastaliq script.",
    siteName: "Brahui Tarjuma",
    images: [
      {
        url: "/brahui-tarjuma.jpeg",
        width: 1024,
        height: 559,
        alt: "Brahui Tarjuma Emblem & Calligraphy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brahui Tarjuma (براہوئی ترجمہ)",
    description:
      "A digital archive publishing Brahui translations of world essays, poems, short stories and novels in authentic Nastaliq script.",
    images: ["/brahui-tarjuma.jpeg"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-square.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-[#0F1722] text-[#1C242E] dark:text-[#F3F4F6] selection:bg-brand-gold/30 selection:text-brand-teal">
        <WebSiteJsonLd siteUrl={siteUrl} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
