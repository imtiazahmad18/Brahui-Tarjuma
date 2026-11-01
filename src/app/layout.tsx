import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
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
    default: "Brahui Matt o badal (براہوئی مٹ و بدل) — World Literature in Brahui",
    template: "%s | Brahui Matt o badal",
  },
  description:
    "A dedicated digital archive publishing Brahui translations of world fiction, classical and modern poetry, literary criticism, essays, and scholarly research in authentic Nastaliq script.",
  keywords: [
    "Brahui",
    "Brahui Matt o badal",
    "براہوئی",
    "براہوئی مٹ و بدل",
    "Brahui Literature",
    "Brahui Poetry",
    "Nastaliq",
    "World Literature Translation",
    "Balochistan",
  ],
  authors: [{ name: "Brahui Matt o badal Editorial Archive" }],
  creator: "Brahui Matt o badal",
  publisher: "Brahui Matt o badal",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/brand-logo-circle.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Brahui Matt o badal (براہوئی مٹ و بدل) — World Literature in Brahui",
    description:
      "A digital archive publishing Brahui translations of world essays, poems, short stories and novels in authentic Nastaliq script.",
    siteName: "Brahui Matt o badal",
    images: [
      {
        url: "/brand-logo-circle.png",
        width: 664,
        height: 664,
        alt: "Brahui Matt o badal logo and calligraphy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brahui Matt o badal (براہوئی مٹ و بدل)",
    description:
      "A digital archive publishing Brahui translations of world essays, poems, short stories and novels in authentic Nastaliq script.",
    images: ["/brand-logo-circle.png"],
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-[#0F1722] text-[#1C242E] dark:text-[#F3F4F6]">
        <WebSiteJsonLd siteUrl={siteUrl} />
        <ScrollReveal />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
