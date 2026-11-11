import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORIES } from "@/types";
import { notFound } from "next/navigation";
export const revalidate = 0;
export const metadata: Metadata = { title: "Original Writing (اصل تحریریں)", description: "Original Brahui writing by Brahui writers.", alternates: { canonical: "/original-writing" } };
export default async function WorksPage({ searchParams }: { searchParams?: { page?: string; category?: string } }) {
 const all = await getPublishedArticles(); const category = searchParams?.category || "all";
 if (category !== "all" && !(category in CATEGORIES)) notFound();
 const page = Math.max(1, Number(searchParams?.page || 1)); const filtered = all.filter(a => (a.content_type || "translation") === "original" && (category === "all" || a.category === category));
 const pageSize = 12; const pages = Math.max(1, Math.ceil(filtered.length/pageSize)); const items = filtered.slice((page-1)*pageSize,page*pageSize);
 return <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-gray-100">Original Writing</h1><p dir="rtl" className="font-nastaliq text-2xl text-brand-gold mt-2">اصل تحریریں</p><nav className="flex flex-wrap gap-2 my-6">{["all",...Object.keys(CATEGORIES)].map(c=><Link key={c} href={`/original-writing?category=${c}`} className={`px-3 py-1.5 rounded-lg border ${category===c?"bg-brand-teal text-white":"bg-white dark:bg-[#17212F]"}`}>{c === "all" ? "All" : CATEGORIES[c as keyof typeof CATEGORIES].englishName}</Link>)}</nav>{items.length ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{items.map(a=><ArticleCard key={a.id} article={a} />)}</div> : <p className="py-12 text-center text-gray-600 dark:text-gray-300">No original writing published yet.</p>}{pages>1 && <div className="flex justify-center gap-5 mt-8"><Link href={`/original-writing?page=${Math.max(1,page-1)}&category=${category}`}>Previous</Link><span>Page {page} of {pages}</span><Link href={`/original-writing?page=${Math.min(pages,page+1)}&category=${category}`}>Next</Link></div>}</main>;
}
