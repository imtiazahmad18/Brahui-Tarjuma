-- ==============================================================================
-- BRAHUI LAOZAANK - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Enable pg_trgm extension for fast Arabic/Urdu/Brahui text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. WRITERS TABLE
CREATE TABLE IF NOT EXISTS writers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    photo_url TEXT,
    writer_type TEXT NOT NULL DEFAULT 'foreign' CHECK (writer_type IN ('brahui', 'foreign')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2b. NESTED POETRY / PROSE CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_ur TEXT NOT NULL,
    name_brh TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 0
);

-- Seed all taxonomy nodes.
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('poetry','Poetry','شاعری',NULL,1,0) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('prose','Prose','نثر',NULL,2,0) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;

INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('ghazal','Ghazal','غزل',(SELECT id FROM categories WHERE slug='poetry'),1,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('sher','Couplet / Sher','شعر',(SELECT id FROM categories WHERE slug='poetry'),2,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('rubai','Quatrain / Rubai','رباعی',(SELECT id FROM categories WHERE slug='poetry'),3,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('nazm','Nazm','نظم',(SELECT id FROM categories WHERE slug='poetry'),4,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('folk-poetry','Folk Poetry','لوک شاعری',(SELECT id FROM categories WHERE slug='poetry'),5,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('other-poetry','Other Poetry','دیگر',(SELECT id FROM categories WHERE slug='poetry'),6,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('fiction','Fiction','فکشن',(SELECT id FROM categories WHERE slug='prose'),1,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('non-fiction','Non-Fiction','غیر افسانوی',(SELECT id FROM categories WHERE slug='prose'),2,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;

INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('prose-poem','Prose Poem','نثری نظم',(SELECT id FROM categories WHERE slug='nazm'),1,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('free-verse','Free Verse','آزاد نظم',(SELECT id FROM categories WHERE slug='nazm'),2,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('blank-verse','Blank Verse','نظمِ معریٰ',(SELECT id FROM categories WHERE slug='nazm'),3,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('short-story','Short Story','افسانہ / مختصر کہانی',(SELECT id FROM categories WHERE slug='fiction'),1,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('novelette','Novelette','ناولٹ',(SELECT id FROM categories WHERE slug='fiction'),2,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('novel','Novel','ناول',(SELECT id FROM categories WHERE slug='fiction'),3,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('drama','Drama','ڈراما',(SELECT id FROM categories WHERE slug='fiction'),4,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('folk-tales','Folk Tales','لوک کہانیاں',(SELECT id FROM categories WHERE slug='fiction'),5,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('humour-satire','Humour & Satire','طنز و مزاح',(SELECT id FROM categories WHERE slug='fiction'),6,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('articles','Articles','مضامین',(SELECT id FROM categories WHERE slug='non-fiction'),1,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('essays','Essays','انشائیے',(SELECT id FROM categories WHERE slug='non-fiction'),2,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('research','Research','تحقیق',(SELECT id FROM categories WHERE slug='non-fiction'),3,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('criticism','Criticism','تنقید',(SELECT id FROM categories WHERE slug='non-fiction'),4,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('interviews','Interviews','انٹرویوز',(SELECT id FROM categories WHERE slug='non-fiction'),5,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('biographies','Biographies','سوانح',(SELECT id FROM categories WHERE slug='non-fiction'),6,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('memoirs','Memoirs & Autobiography','خود نوشت',(SELECT id FROM categories WHERE slug='non-fiction'),7,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('sketches','Sketches','خاکے',(SELECT id FROM categories WHERE slug='non-fiction'),8,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('travelogue','Travelogue','سفرنامہ',(SELECT id FROM categories WHERE slug='non-fiction'),9,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('letters','Letters','خطوط',(SELECT id FROM categories WHERE slug='non-fiction'),10,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('reviews','Reviews','تبصرے',(SELECT id FROM categories WHERE slug='non-fiction'),11,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;

-- 3. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'translation' CHECK (content_type IN ('translation', 'original')),
    subtitle TEXT,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    body TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    cover_alt TEXT,
    writer_id UUID REFERENCES writers(id) ON DELETE SET NULL,
    original_title TEXT,
    original_text TEXT,
    original_lang TEXT DEFAULT 'en',
    original_dir TEXT DEFAULT 'ltr' CHECK (original_dir IN ('ltr', 'rtl')),
    source_credit TEXT,
    translator_name TEXT,
    translator_title TEXT,
    fiction_form TEXT CHECK (fiction_form IN ('short_story', 'novel', 'other')),
    references_text TEXT,
    pdf_url TEXT,
    meta_description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CHAPTERS TABLE (For Novels or multi-part works)
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, chapter_number)
);

-- 5. STATIC PAGES TABLE (For Admin-editable About and Contact pages)
CREATE TABLE IF NOT EXISTS static_pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5b. CONTACT MESSAGES TABLE (submissions from the public contact form)
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- 6. INDEXES FOR PERFORMANCE & URDU/ARABIC FULL-TEXT SEARCH
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_content_type ON articles(content_type);
CREATE INDEX IF NOT EXISTS idx_articles_writer_id ON articles(writer_id);
CREATE INDEX IF NOT EXISTS idx_chapters_article_id ON chapters(article_id, chapter_number ASC);
CREATE INDEX IF NOT EXISTS idx_writers_slug ON writers(slug);

-- Trigram GIN indexes for fast Urdu/Arabic/English substring matching
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_articles_body_trgm ON articles USING gin (body gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_writers_name_trgm ON writers USING gin (name gin_trgm_ops);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE writers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create the owner account in Supabase Auth, then run this update with its email.
-- Set the same address as ADMIN_EMAIL in the server environment. app_metadata
-- cannot be changed by the account owner through the public client API.
-- UPDATE auth.users
-- SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"owner"}'::jsonb
-- WHERE lower(email) = lower('YOUR_OWNER_EMAIL');

-- Recreate these policies so this script can be safely run again.
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Admin full access on categories" ON categories;
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin full access on categories" ON categories FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

DROP POLICY IF EXISTS "Public can view writers" ON writers;
DROP POLICY IF EXISTS "Admin full access on writers" ON writers;
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
DROP POLICY IF EXISTS "Admin full access on articles" ON articles;
DROP POLICY IF EXISTS "Public can view chapters of published articles" ON chapters;
DROP POLICY IF EXISTS "Admin full access on chapters" ON chapters;
DROP POLICY IF EXISTS "Public can view static pages" ON static_pages;
DROP POLICY IF EXISTS "Admin full access on static pages" ON static_pages;

CREATE POLICY "Public can view writers" ON writers FOR SELECT USING (true);
CREATE POLICY "Admin full access on writers" ON writers FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

CREATE POLICY "Public can view published articles" ON articles FOR SELECT
  USING (status = 'published');
CREATE POLICY "Admin full access on articles" ON articles FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

CREATE POLICY "Public can view chapters of published articles" ON chapters FOR SELECT
  USING (EXISTS (SELECT 1 FROM articles WHERE articles.id = chapters.article_id AND articles.status = 'published'));
CREATE POLICY "Admin full access on chapters" ON chapters FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

CREATE POLICY "Public can view static pages" ON static_pages FOR SELECT USING (true);
CREATE POLICY "Admin full access on static pages" ON static_pages FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

-- Contact messages: anyone may insert (public form), only the owner may read/manage.
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin full access on contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin full access on contact messages" ON contact_messages FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

-- 8. STORAGE BUCKETS (covers and pdfs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true) ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read covers" ON storage.objects;
DROP POLICY IF EXISTS "Public read pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert covers" ON storage.objects;
DROP POLICY IF EXISTS "Admin update covers" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete covers" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Admin update pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete pdfs" ON storage.objects;

CREATE POLICY "Public read covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Public read pdfs" ON storage.objects FOR SELECT USING (bucket_id = 'pdfs');
CREATE POLICY "Admin insert covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'covers' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
CREATE POLICY "Admin update covers" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'covers' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK (bucket_id = 'covers' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
CREATE POLICY "Admin delete covers" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'covers' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
CREATE POLICY "Admin insert pdfs" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pdfs' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
CREATE POLICY "Admin update pdfs" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'pdfs' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK (bucket_id = 'pdfs' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
CREATE POLICY "Admin delete pdfs" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'pdfs' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

-- 9. No sample writers or articles are inserted.

-- Seed Sample Static Pages: About and Contact
INSERT INTO static_pages (id, title, body)
VALUES (
    'about',
    'About Brahui Laozaank (براہوئی لوزانک نا باروٹ)',
    'Welcome to Brahui Laozaank (براہوئی لوزانک) — a dedicated literary repository committed to publishing original writing in Brahui and translations of world literature, poetry, criticism, and research into Brahui.

Our mission is to bridge cultures and philosophies by enriching Brahui literature with the world’s finest intellectual treasures, rendered in authentic Jameel Noori Nastaliq script.

Founded as a focused digital archive, Brahui Laozaank connects Brahui readers and students of literature to universal ideas while celebrating the linguistic beauty and expressive power of Brahui.'
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;

INSERT INTO static_pages (id, title, body)
VALUES (
    'contact',
    'Contact Brahui Laozaank (رابطہ)',
    'If you are a Brahui writer, translator, researcher, or poet, we welcome original writing in Brahui and translations into Brahui. 

Please reach out to the editor at:
Email: editor@brahuitarjuma.org (or your personal admin contact)
Location: Quetta / Balochistan, Pakistan

Original submissions should include the Brahui text and author details. Translations should include the source credit, original author, and translator details.'
) ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body;
