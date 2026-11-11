"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Sun, Moon, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORY_CHILDREN, CATEGORY_BY_SLUG } from "@/types";
import { useLocale } from "@/components/LocaleProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";

const menuItems = ["poetry", "prose"] as const;
type MenuSlug = typeof menuItems[number];

export default function Header() {
  const pathname = usePathname();
  const { locale, t, categoryName } = useLocale();
  const isBrh = locale === "brh" && !pathname.startsWith("/admin");
  const nodeName = (node: { slug: string; englishName: string; urduName: string }) => categoryName(node.slug, node.englishName, node.urduName);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroups, setMobileGroups] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<MenuSlug | null>(null);
  const [openChild, setOpenChild] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const dark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);
  useEffect(() => { setMobileOpen(false); setOpenMenu(null); setOpenChild(null); }, [pathname]);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = null; };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => { setOpenMenu(null); setOpenChild(null); }, 180); };
  const toggleMobileGroup = (key: string) => setMobileGroups((old) => old.includes(key) ? old.filter((v) => v !== key) : [...old, key]);
  const focusMenuItem = (event: React.KeyboardEvent<HTMLElement>) => {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); items[(current + 1 + items.length) % items.length].focus(); }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); items[(current - 1 + items.length) % items.length].focus(); }
    if (event.key === "Escape") { event.preventDefault(); setOpenMenu(null); setOpenChild(null); menuButtonRefs.current[openMenu || ""]?.focus(); }
  };
  const submitSearch = (event: React.FormEvent) => { event.preventDefault(); const value = search.trim(); if (value) router.push(`/search?q=${encodeURIComponent(value)}`); };
  const navLinkClass = (href: string) => `inline-flex items-center gap-1 px-2 xl:px-3 min-h-11 rounded-lg text-sm font-semibold transition-colors ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "text-brand-teal dark:text-teal-300 bg-brand-teal/10 dark:bg-brand-teal/20" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}`;

  return <header className="sticky top-0 z-50 bg-[#FBF9F5]/95 dark:bg-[#0F1722]/95 backdrop-blur border-b border-[#E8E2D9] dark:border-[#243245]">
    <div className="max-w-7xl mx-auto px-3 sm:px-5 xl:px-6">
      <div className="flex items-center gap-2 h-[76px]">
        <Link href="/" className="flex shrink-0 items-center mr-2" aria-label={`${t("site.name")} ${t("label.home")}`}>
          <Logo width={56} height={44} priority sizes="56px" />
        </Link>

        <nav aria-label={t("menu.main")} className={`hidden ${isBrh ? "min-[1100px]:flex" : "lg:flex"} items-center gap-1 flex-1`}>
          {menuItems.map((section) => {
            const node = CATEGORY_BY_SLUG(section)!;
            const children = CATEGORY_CHILDREN(section);
            return <div key={section} className="relative" onMouseEnter={() => { cancelClose(); setOpenMenu(section); }} onMouseLeave={scheduleClose} onFocusCapture={() => { cancelClose(); setOpenMenu(section); }} onKeyDown={focusMenuItem}>
              <div className="flex items-center">
                <Link href={node.href} className={navLinkClass(node.href)}>{nodeName(node)}</Link>
                <button ref={(el) => { menuButtonRefs.current[section] = el; }} type="button" aria-label={t("menu.openCategoryMenu")} aria-haspopup="menu" aria-expanded={openMenu === section} onClick={() => { cancelClose(); setOpenMenu(openMenu === section ? null : section); }} onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpenMenu(section); requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-menu="${section}"] [role="menuitem"]`)?.focus()); } }} className="min-h-11 min-w-8 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronDown className="w-4 h-4 mx-auto" /></button>
              </div>
              {openMenu === section && <div data-menu={section} role="menu" aria-label={`${nodeName(node)} ${t("menu.categories")}`} className={`menu-popover absolute ${isBrh ? "right-0" : "left-0"} top-full pt-2 min-w-64 z-50`} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17212F] shadow-xl p-2">
                  {children.map((child) => {
                    const nested = CATEGORY_CHILDREN(child.slug);
                    return <div key={child.slug} className="relative" onMouseEnter={() => { if (nested.length) setOpenChild(child.slug); }}>
                      <div className="flex items-center justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Link role="menuitem" href={child.href} className="flex-1 min-h-11 flex items-center justify-between gap-3 px-3 text-sm text-gray-800 dark:text-gray-100"><span>{nodeName(child)}</span></Link>
                        {nested.length > 0 && <button type="button" aria-label={t("menu.openSubcategoryMenu")} aria-haspopup="menu" aria-expanded={openChild === child.slug} onClick={() => setOpenChild(openChild === child.slug ? null : child.slug)} className="min-h-11 min-w-10 text-gray-500"><ChevronRight className="w-4 h-4 mx-auto" /></button>}
                      </div>
                      {nested.length > 0 && openChild === child.slug && <div role="menu" aria-label={`${nodeName(child)} ${t("menu.categories")}`} className={`menu-popover absolute ${isBrh ? "right-full pr-2" : "left-full pl-2"} top-0 w-64 z-50`} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}><div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17212F] shadow-xl p-2">{nested.map((leaf) => <Link key={leaf.slug} role="menuitem" href={leaf.href} className="flex items-center justify-between gap-3 min-h-11 px-3 rounded-lg text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"><span>{nodeName(leaf)}</span></Link>)}</div></div>}
                    </div>;
                  })}
                </div>
              </div>}
            </div>;
          })}
          <Link href="/writers" className={navLinkClass("/writers")}>{t("menu.writers")}</Link>
          <Link href="/about" className={navLinkClass("/about")}>{t("menu.about")}</Link>
          <Link href="/contact" className={navLinkClass("/contact")}>{t("menu.contact")}</Link>
        </nav>

        <div className="flex items-center gap-1 ml-auto lg:ml-0">
          {!pathname.startsWith("/admin") && <LanguageSwitcher className="desktop-language-switch" />}
          {searchOpen ? <form onSubmit={submitSearch} className="hidden md:flex items-center"><input autoFocus value={search} onChange={(e)=>setSearch(e.target.value)} aria-label={t("search.aria")} placeholder={t("search.placeholder")} className="w-40 xl:w-52 h-10 px-3 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#17212F] text-sm"/><button type="submit" aria-label={t("menu.search")} className="h-10 px-3 rounded-r-lg bg-brand-teal text-white"><Search className="w-4 h-4"/></button><button type="button" aria-label={t("search.close")} onClick={()=>setSearchOpen(false)} className="ml-1 min-h-10 min-w-10"><X className="w-4 h-4 mx-auto"/></button></form> : <button type="button" onClick={()=>setSearchOpen(true)} aria-label={t("menu.search")} className="min-h-11 min-w-11 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"><Search className="w-5 h-5 mx-auto"/></button>}
          <button type="button" onClick={toggleTheme} aria-label={isDark ? t("theme.light") : t("theme.dark")} className="min-h-11 min-w-11 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">{mounted && isDark ? <Sun className="w-5 h-5 mx-auto text-amber-400"/> : <Moon className="w-5 h-5 mx-auto"/>}</button>
          <button type="button" aria-label={mobileOpen ? t("menu.close") : t("menu.open")} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(!mobileOpen)} className={`${isBrh ? "min-[1100px]:hidden" : "lg:hidden"} min-h-11 min-w-11 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}>{mobileOpen?<X className="w-6 h-6 mx-auto"/>:<Menu className="w-6 h-6 mx-auto"/>}</button>
        </div>
      </div>
    </div>

    {mobileOpen && <div className={`mobile-drawer ${isBrh ? "min-[1100px]:hidden" : "lg:hidden"} fixed inset-0 top-[76px] z-40 bg-[#FBF9F5] dark:bg-[#0F1722] overflow-y-auto border-t border-[#E8E2D9] dark:border-[#243245]`}>
      <nav aria-label={t("menu.mobile")} className="px-4 py-4 pb-10 space-y-2">
        <Link href="/" aria-label={`${t("site.name")} ${t("label.home")}`} className="flex justify-center pb-4 mb-2 border-b border-gray-200 dark:border-gray-800">
          <Logo width={214} height={168} sizes="214px" />
        </Link>
        {menuItems.map((section) => {
          const node=CATEGORY_BY_SLUG(section)!; const children=CATEGORY_CHILDREN(section); const expanded=mobileGroups.includes(section);
          return <section key={section} className="border-b border-gray-200 dark:border-gray-800 pb-2"><div className="flex items-center"><Link href={node.href} className="flex-1 min-h-12 flex items-center text-base font-semibold">{nodeName(node)}</Link><button type="button" aria-label={`${expanded?t("menu.collapse"):t("menu.expand")} ${nodeName(node)}`} aria-expanded={expanded} onClick={()=>toggleMobileGroup(section)} className="min-h-12 min-w-12"><ChevronDown className={`w-5 h-5 mx-auto transition-transform ${expanded?"rotate-180":""}`}/></button></div>
            {expanded && <div className="pl-3 space-y-1">{children.map((child)=>{const nested=CATEGORY_CHILDREN(child.slug);const childExpanded=mobileGroups.includes(child.slug);return <div key={child.slug}><div className="flex items-center"><Link href={child.href} className="flex-1 min-h-11 flex items-center px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><span>{nodeName(child)}</span></Link>{nested.length>0&&<button type="button" aria-label={`${childExpanded?t("menu.collapse"):t("menu.expand")} ${nodeName(child)}`} aria-expanded={childExpanded} onClick={()=>toggleMobileGroup(child.slug)} className="min-h-11 min-w-11"><ChevronDown className={`w-4 h-4 mx-auto transition-transform ${childExpanded?"rotate-180":""}`}/></button>}</div>{nested.length>0&&childExpanded&&<div className="pl-4">{nested.map((leaf)=><Link key={leaf.slug} href={leaf.href} className="flex items-center min-h-11 px-3 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800"><span>{nodeName(leaf)}</span></Link>)}</div>}</div>})}</div>}
          </section>;
        })}
        <Link href="/writers" className="flex items-center min-h-12 px-2 border-b border-gray-200 dark:border-gray-800">{t("menu.writers")}</Link><Link href="/about" className="flex items-center min-h-12 px-2 border-b border-gray-200 dark:border-gray-800">{t("menu.about")}</Link><Link href="/contact" className="flex items-center min-h-12 px-2 border-b border-gray-200 dark:border-gray-800">{t("menu.contact")}</Link>
        {!pathname.startsWith("/admin") && <LanguageSwitcher className="mt-3" />}
        <form onSubmit={submitSearch} className="flex pt-3"><input value={search} onChange={e=>setSearch(e.target.value)} aria-label={t("search.aria")} placeholder={t("search.placeholder")} className="flex-1 min-w-0 min-h-12 px-3 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#17212F]"/><button className="min-w-12 rounded-r-lg bg-brand-teal text-white" aria-label={t("menu.search")}><Search className="w-5 h-5 mx-auto"/></button></form>
        <button type="button" onClick={toggleTheme} className="flex items-center gap-3 min-h-12 px-2 w-full"><span>{isDark?t("theme.lightLabel"):t("theme.darkLabel")}</span>{isDark?<Sun className="w-5 h-5 text-amber-400"/>:<Moon className="w-5 h-5"/>}</button>
      </nav>
    </div>}
  </header>;
}
