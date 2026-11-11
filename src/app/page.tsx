import Link from "next/link";
import Image from "next/image";
import { getPublishedArticles, getAllWriters, getCategoryBrahuiNames } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import { Article, categoryPath } from "@/types";
import { Search } from "lucide-react";
import { cookies } from "next/headers";
import { normalizeLocale, translate } from "@/lib/i18n";
import Logo from "@/components/Logo";

export const revalidate = 0;
type Props = { searchParams?: { type?: string } };
function inSection(article: Article, section: "poetry" | "prose") {
  return categoryPath(article.category).some((node) => node.slug === section);
}

export default async function HomePage({ searchParams }: Props) {
  const locale = normalizeLocale(cookies().get("brahui-locale")?.value);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const [articles, writers, categoryNames] = await Promise.all([getPublishedArticles(), getAllWriters(), getCategoryBrahuiNames()]);
  const categoryName = (slug: "poetry" | "prose", english: string, urdu: string) => locale === "brh" ? (categoryNames[slug] || urdu) : english;
  const brahuiWriters = writers.filter((writer) => writer.writer_type === "brahui").slice(0, 8);
  const type = searchParams?.type === "original" || searchParams?.type === "translation" ? searchParams.type : "all";
  const filtered = type === "all" ? articles : articles.filter((a) => (a.content_type || "translation") === type);
  const featured = filtered.find((article) => article.is_featured);
  const poetry = filtered.filter((article) => inSection(article, "poetry")).slice(0, 4);
  const prose = filtered.filter((article) => inSection(article, "prose")).slice(0, 4);
  const couplets = articles.filter((article) => article.category === "sher");
  const couplet = couplets.length ? couplets[Math.floor(Math.random() * couplets.length)] : null;
  const worksToggle = [{ value: "all", label: t("filter.all") }, { value: "original", label: t("filter.original") }, { value: "translation", label: t("filter.translation") }];

  return <div className="space-y-14 pb-16">
    <section className="bg-gradient-to-b from-[#F4EFE6] via-[#FBF9F5] to-[#FBF9F5] dark:from-[#0B111A] dark:via-[#0F1722] dark:to-[#0F1722] border-b border-[#E8E2D9] dark:border-[#243245] py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-5 text-center">
        <Logo width={360} height={283} priority sizes="(min-width: 640px) 360px, 280px" className="hero-logo" />
        <p className="text-lg text-gray-600 dark:text-gray-300">{t("site.tagline")}</p>
        <form action="/search" className="w-full max-w-xl flex"><input name="q" aria-label={t("search.aria")} placeholder={t("search.placeholder")} className="flex-1 min-w-0 min-h-12 px-4 rounded-l-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#17212F]"/><button className="min-w-14 rounded-r-xl bg-brand-teal text-white" aria-label={t("menu.search")}><Search className="w-5 h-5 mx-auto"/></button></form>
        <div className="flex gap-3 justify-center"><Link href="/poetry" className="px-4 py-2 rounded-lg bg-white dark:bg-[#17212F] border border-gray-200 dark:border-gray-700">{categoryName("poetry", "Poetry", "شاعری")}</Link><Link href="/prose" className="px-4 py-2 rounded-lg bg-white dark:bg-[#17212F] border border-gray-200 dark:border-gray-700">{categoryName("prose", "Prose", "نثر")}</Link></div>
      </div>
    </section>

    {featured && <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold font-serif mb-5">{t("label.featured")}</h2><ArticleCard article={featured} featured/></section>}

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2"><h2 className="text-2xl font-bold font-serif">{t("label.latestWorks")}</h2><div className="flex gap-2">{worksToggle.map((item)=><Link key={item.value} href={item.value === "all" ? "/" : `/?type=${item.value}`} aria-current={type === item.value ? "page" : undefined} className={`min-h-11 px-4 py-2 rounded-lg border ${type===item.value?"bg-brand-teal text-white":"border-gray-200 dark:border-gray-700"}`}>{item.label}</Link>)}</div></div>
      <p className="text-xs text-gray-500 mb-5">{t("filter.originalHelp")} · {t("filter.translationHelp")}</p>
      <div className="grid lg:grid-cols-2 gap-8">
        {[{name:categoryName("poetry", "Poetry", "شاعری"),href:"/poetry",items:poetry},{name:categoryName("prose", "Prose", "نثر"),href:"/prose",items:prose}].map((section)=><section key={section.name} className="min-w-0"><div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-800 pb-3 mb-5"><h3 className="text-xl font-bold font-serif">{section.name}</h3><Link href={section.href} className="text-sm text-brand-teal hover:underline">{t("action.browseAll")}</Link></div>{section.items.length?<div className="grid sm:grid-cols-2 gap-5">{section.items.map((article)=><ArticleCard key={article.id} article={article}/>)}</div>:<p className="text-sm text-gray-500 dark:text-gray-400 py-8">{section.items === poetry ? t("empty.poetry") : t("empty.prose")}</p>}</section>)}
      </div>
    </section>

    {couplet && <section className="max-w-4xl mx-auto px-4"><div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/5 dark:bg-brand-gold/10 p-7 sm:p-10 text-center"><p className="text-xs uppercase tracking-widest text-brand-teal dark:text-teal-300 mb-3">{t("label.coupletOfDay")}</p><Link href={`/article/${couplet.slug}`} className="block font-nastaliq whitespace-pre-line text-2xl sm:text-3xl leading-[2.2] text-gray-900 dark:text-gray-100">{couplet.body}</Link>{couplet.writer&&<Link href={`/writer/${couplet.writer.slug}`} className="inline-block mt-4 text-sm text-brand-teal dark:text-teal-300 hover:underline">{couplet.writer.name}</Link>}</div></section>}

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-baseline justify-between mb-5"><h2 className="text-2xl font-bold font-serif">{t("label.brahuiWriters")}</h2><Link href="/writers" className="text-sm text-brand-teal hover:underline">{t("action.allWriters")}</Link></div>{brahuiWriters.length?<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{brahuiWriters.map((writer)=><Link key={writer.id} href={`/writer/${writer.slug}`} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17212F] p-3 hover:border-brand-teal"><span className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">{writer.photo_url?<Image src={writer.photo_url} alt={writer.name} width={48} height={48} className="w-full h-full object-cover"/>:<span className="w-full h-full grid place-items-center font-serif text-brand-teal">{writer.name.slice(0,1)}</span>}</span><span className="text-sm font-medium truncate">{writer.name}</span></Link>)}</div>:<p className="text-gray-500">{t("empty.writers")}</p>}</section>
  </div>;
}
