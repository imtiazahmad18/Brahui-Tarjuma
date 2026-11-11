import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory, getCategoryBrahuiNames } from "@/lib/data";
import { CATEGORY_BY_SLUG, CATEGORY_NODES, categoryPath } from "@/types";
import { cookies } from "next/headers";
import { normalizeLocale, translate } from "@/lib/i18n";
import { getSiteName } from "@/lib/brand";

export const revalidate = 0;
type Props = { params: { slug: string[] }; searchParams?: { page?: string; type?: string } };

function nodeForPath(parts: string[]) {
  const href = `/${parts.join("/")}`;
  return CATEGORY_NODES.find((node) => node.href === href) || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const node = nodeForPath(params.slug);
  if (!node) return { title: "Category Not Found" };
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const categoryNames = locale === "brh" ? await getCategoryBrahuiNames() : {};
  const name = locale === "brh" ? (categoryNames[node.slug] || node.urduName) : node.englishName;
  return {
    title: { absolute: `${name} | ${getSiteName(locale)}` },
    description: locale === "brh" ? `${name} — براہوئی زبان دا ادب۔` : node.description,
    alternates: { canonical: node.href },
    openGraph: { title: `${name} | ${getSiteName(locale)}`, description: locale === "brh" ? `${name} — براہوئی زبان دا ادب۔` : node.description, url: node.href },
  };
}

export default async function TaxonomyPage({ params, searchParams }: Props) {
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const isBrh = locale === "brh";
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const categoryNames = isBrh ? await getCategoryBrahuiNames() : {};
  const nodeName = (item: (typeof CATEGORY_NODES)[number]) => isBrh ? (categoryNames[item.slug] || item.urduName) : item.englishName;
  const node = nodeForPath(params.slug);
  if (!node) notFound();
  const type = searchParams?.type === "original" || searchParams?.type === "translation" ? searchParams.type : undefined;
  const page = Math.max(1, Number(searchParams?.page || 1));
  const { articles, total } = await getArticlesByCategory(node.slug, page, 12, type);
  const pages = Math.max(1, Math.ceil(total / 12));
  const children = CATEGORY_NODES.filter((child) => child.parentSlug === node.slug);
  const crumbs = categoryPath(node.slug);
  const crumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [{ name: t("label.home"), item: process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org" }, ...crumbs.map((item) => ({ name: nodeName(item), item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://brahuitarjuma.org"}${item.href}` }))]
      .map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.item })),
  };
  return <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap gap-2">
      <Link href="/" className="hover:text-brand-teal">{t("label.home")}</Link>{crumbs.map((crumb) => <span key={crumb.slug} className="flex gap-2"><span aria-hidden="true">›</span><Link href={crumb.href} aria-current={crumb.slug === node.slug ? "page" : undefined} className="hover:text-brand-teal">{nodeName(crumb)}</Link></span>)}
    </nav>
    <header className="mb-8"><h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100">{nodeName(node)}</h1><p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-300">{isBrh ? `${nodeName(node)} — براہوئی زبان دا ادب۔` : node.description}</p></header>
    {children.length > 0 && <nav aria-label={`${nodeName(node)} ${isBrh ? "درجے" : "categories"}`} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">{children.map((child) => <Link key={child.slug} href={child.href} className="flex items-center min-h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17212F] hover:border-brand-teal"><span>{nodeName(child)}</span></Link>)}</nav>}
    <nav aria-label={isBrh ? "مٹ و بدل نا چنت" : "Filter by work type"} className="flex flex-wrap gap-2 mb-2">{[{v:"all",label:t("filter.all")},{v:"original",label:t("filter.original")},{v:"translation",label:t("filter.translation")}].map((item) => <Link key={item.v} href={`${node.href}?type=${item.v}`} aria-current={(type || "all") === item.v ? "page" : undefined} className={`min-h-11 px-4 py-2 rounded-lg border ${((type || "all") === item.v) ? "bg-brand-teal text-white" : "bg-white dark:bg-[#17212F] border-gray-200 dark:border-gray-700"}`}>{item.label}</Link>)}</nav>
    <p className="text-xs text-gray-500 mb-6">{t("filter.originalHelp")} · {t("filter.translationHelp")}</p>
    {articles.length ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div> : <p className="rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center text-gray-600 dark:text-gray-300">{t("empty.results")}</p>}
    {pages > 1 && <nav aria-label={isBrh ? "صفحہ گردی" : "Pagination"} className="flex items-center justify-center gap-5 mt-10"><Link aria-disabled={page <= 1} href={`${node.href}?page=${Math.max(1,page-1)}&type=${type || "all"}`} className="min-h-11 px-4 py-2 rounded-lg border">{t("pagination.previous")}</Link><span>{t("pagination.page")} {page} / {pages}</span><Link aria-disabled={page >= pages} href={`${node.href}?page=${Math.min(pages,page+1)}&type=${type || "all"}`} className="min-h-11 px-4 py-2 rounded-lg border">{t("pagination.next")}</Link></nav>}
  </main>;
}
