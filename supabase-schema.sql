-- ==============================================================================
-- BRAHUI TARJUMA - SUPABASE DATABASE SCHEMA & RLS POLICIES
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('fiction', 'poetry', 'criticism', 'research', 'articles')),
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

-- 6. INDEXES FOR PERFORMANCE & URDU/ARABIC FULL-TEXT SEARCH
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_writer_id ON articles(writer_id);
CREATE INDEX IF NOT EXISTS idx_chapters_article_id ON chapters(article_id, chapter_number ASC);
CREATE INDEX IF NOT EXISTS idx_writers_slug ON writers(slug);

-- Trigram GIN indexes for fast Urdu/Arabic/English substring matching
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_articles_body_trgm ON articles USING gin (body gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_writers_name_trgm ON writers USING gin (name gin_trgm_ops);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE writers ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

-- Writers Policies
-- Public can read any writer
CREATE POLICY "Public can view writers" 
ON writers FOR SELECT 
USING (true);

-- Authenticated admin can insert/update/delete writers
CREATE POLICY "Admin full access on writers" 
ON writers FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Articles Policies
-- Public can only read published articles
CREATE POLICY "Public can view published articles" 
ON articles FOR SELECT 
USING (status = 'published');

-- Authenticated admin can do everything on articles
CREATE POLICY "Admin full access on articles" 
ON articles FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Chapters Policies
-- Public can view chapters of published articles
CREATE POLICY "Public can view chapters of published articles" 
ON chapters FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM articles 
        WHERE articles.id = chapters.article_id 
        AND articles.status = 'published'
    )
);

-- Authenticated admin can do everything on chapters
CREATE POLICY "Admin full access on chapters" 
ON chapters FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Static Pages Policies
CREATE POLICY "Public can view static pages" 
ON static_pages FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on static pages" 
ON static_pages FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 8. STORAGE BUCKETS (covers and pdfs)
-- Run in Supabase SQL editor or create via Storage dashboard:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('pdfs', 'pdfs', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies:
-- Allow public access to view covers and pdfs
CREATE POLICY "Public read covers" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'covers');

CREATE POLICY "Public read pdfs" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'pdfs');

-- Admin can upload and delete files in covers and pdfs
CREATE POLICY "Admin insert covers" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Admin update covers" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'covers');

CREATE POLICY "Admin delete covers" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'covers');

CREATE POLICY "Admin insert pdfs" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Admin update pdfs" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'pdfs');

CREATE POLICY "Admin delete pdfs" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'pdfs');

-- 9. SEED INITIAL SAMPLE DATA
-- Insert sample writer: Saadat Hasan Manto
INSERT INTO writers (id, name, slug, bio, photo_url)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Saadat Hasan Manto (سعادت حسن منٹو)',
    'saadat-hasan-manto',
    'One of the greatest short-story writers in South Asian literature, known for his incisive, unvarnished portrayal of human nature, partition, and society.',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample writer: Faiz Ahmad Faiz
INSERT INTO writers (id, name, slug, bio, photo_url)
VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Faiz Ahmad Faiz (فیض احمد فیض)',
    'faiz-ahmad-faiz',
    'Revolutionary poet, humanist, and one of the most celebrated modern Urdu poets, nominee for the Nobel Prize in Literature.',
    'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=800'
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample writer: Jorge Luis Borges
INSERT INTO writers (id, name, slug, bio, photo_url)
VALUES (
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'Jorge Luis Borges (خورخے لوئیس بورخیس)',
    'jorge-luis-borges',
    'Argentine short-story writer, essayist, poet and translator, a key figure in Spanish-language and universal literature.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Article 1: Fiction / Short Story (Toba Tek Singh in Brahui)
INSERT INTO articles (
    title, subtitle, slug, category, body, cover_image_url, cover_alt,
    writer_id, original_title, original_text, original_lang, original_dir,
    source_credit, translator_name, meta_description, status, published_at
) VALUES (
    'ٹوبہ ٹیک سنگھ',
    'سعادت حسن منٹو نا شاہکار کسّہ نا براہوئی مٹ',
    'toba-tek-singh',
    'fiction',
    'بٹوارہ نا دو سال پد ہند و پاکستان نا حکومت آتے دا خیال بس کہ پاگل خاناتیٹی ارادہ مروک پاگل تا تبادلہ کننگے۔ یعنی ہندو و سکھ پاگل آتے ہندوستان روانہ کننگے و مسلمان پاگل آتے پاکستان راہی کننگے۔

لاہور نا پاگل خانہ ٹی ایلو پاگل تا وڑ اسہ پاگل اس بس ہرانا پن بشن سنگھ ئس، ولے کل اودے "ٹوبہ ٹیک سنگھ" پاریرہ۔ او پندرہ سال آن دا پاگل خانہ ٹی ئس۔ او اسل گپتوفکہ، ہروخت تینا تینٹ دا ہیت آتے تکرار کریکہ: "اوپڑی گڑگڑ دی اناکس دی بے دھیانا دی منگ دی دال آف دی لالٹین"۔

بشن سنگھ ہروخت تینا وطن ٹوبہ ٹیک سنگھ نا باروٹ سوج کریکہ۔ کس اس اودے پاتو کہ ٹوبہ ٹیک سنگھ دا وختی ہندوستان ٹی ءِ یا پاکستان ٹی۔ 

آخر تبادلہ نا دے بس۔ واگہ بارڈر آ ساہت خڑک مس۔ بشن سنگھ آن سوج مس تو اودے پاننگا کہ نات وطن ہندوستان ٹی ہنا۔ بشن سنگھ گام اس مونا ہننگ نا خاہشدار متو، او واپس پدی تس۔ او ہڑتوملے ملک آتا نیام نا ڈیہہ آ سلوک مس۔

صبح آن مست، او بے جان مروک ڈغار آ خلیس۔ ہندا ڈیہہ آ کہ ہرانا نہ کس اس پاکستان پن تخاسس، نہ ہندوستان۔ او ہندا نیامی ڈغار آ ندر مس۔',
    '/brahui-tarjuma.jpeg',
    'Toba Tek Singh Brahui Translation Cover',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'ٹوبہ ٹیک سنگھ (Toba Tek Singh)',
    'تقسیم کے دو تین سال بعد پاکستان اور ہندوستان کی حکومتوں کو خیال آیا کہ اخلاقی قیدیوں کی طرح پاگلوں کا بھی تبادلہ ہونا چاہیے۔ یعنی جو ہندو اور سکھ پاگل پاکستان کے پاگل خانوں میں ہیں، انہیں ہندوستان پہنچا دیا جائے اور جو مسلمان ہندوستان کے پاگل خانوں میں ہیں، انہیں پاکستان کے حوالے کر دیا جائے۔

لاہور کے پاگل خانے میں جب یہ خبر پہنچی تو بڑی دلچسپ بحثیں شروع ہوئیں۔ ایک سکھ پاگل تھا جس کا نام بشن سنگھ تھا۔ پندرہ برس سے وہ اس پاگل خانے میں تھا۔ دن رات میں وہ کبھی نہیں سویا تھا۔ نہ لیٹا تھا۔ کبھی کبھار دیوار کے ساتھ ٹیک لگا لیتا تھا۔ اس کی زبان پر ہمیشہ یہ الفاظ رہتے تھے: "اوپڑی گڑگڑ دی اناکس دی بے دھیانا دی منگ دی دال آف دی لالٹین"۔

جب تبادلے کا وقت آیا اور بشن سنگھ کو واہگہ بارڈر پر لایا گیا، تو اس نے افسر سے پوچھا: "ٹوبہ ٹیک سنگھ کہاں ہے؟ پاکستان میں یا ہندوستان میں؟" افسر ہنسا اور بولا: "ہندوستان میں۔"

بشن سنگھ نے انکار کر دیا اور پیچھے بھاگا۔ سپاہیوں نے اسے پکڑنے کی کوشش کی لیکن وہ دونوں ملکوں کی خاردار تاروں کے درمیان کی زمین پر گر پڑا۔ سورج نکلنے سے پہلے اس کے حلق سے چیخ نکلی۔ ادھر خاردار تاروں کے پیچھے ہندوستان تھا، ادھر ویسے ہی تاروں کے پیچھے پاکستان، اور درمیان میں زمین کے اس ٹکڑے پر جس کا کوئی نام نہ تھا، ٹوبہ ٹیک سنگھ پڑا تھا۔',
    'ur',
    'rtl',
    'Original Urdu masterpiece published in 1955',
    'عبدالرزاق ساسولی',
    'سعادت حسن منٹو نا نامدار کسّہ ٹوبہ ٹیک سنگھ نا براہوئی مٹ و بدل، براہوئی ترجمہ نا مونا تروک۔',
    'published',
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Seed Article 2: Poetry (Dawn of Freedom - Subh-e-Azadi)
INSERT INTO articles (
    title, subtitle, slug, category, body, cover_image_url, cover_alt,
    writer_id, original_title, original_text, original_lang, original_dir,
    source_credit, translator_name, meta_description, status, published_at
) VALUES (
    'آزادی نا سُہب',
    'فیض احمد فیض نا نظم نا براہوئی مٹ',
    'azadi-na-sohb',
    'poetry',
    'دا چٹ داغ دار رژنائی، دا شب گزیدہ سُہب
دا او سُہب اف کہ ہرانا تمنا ٹی ننا قافلہ روان مسس

ننا سنگت آک پاریرہ کہ دا کسر نا گڈسر آ
روشنائی نا اسہ پین ساہت اس ودی مروئی ءِ
فلک نا خن تا خیسنی مٹ مروئی ءِ
ننا بے ساہا ارواہ تے قرار بنوئی ءِ

ولے ننا است نا درد اونواری ءِ
روشنی نا پیاس اونواری ءِ
نجات نا ساہت پین مونا ءِ
بروسہ متو، ننکان پین مزل اس برجاءِ

مونا ہنبو، سنگتو! کہ دا او سحر اف
ہرانا واہمہ ٹی ننا تپوک خنک چارہ ئسر!',
    '/brahui-tarjuma.jpeg',
    'Faiz Ahmad Faiz Poetry Brahui Translation',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'صبحِ آزادی (Subh-e-Azadi)',
    'یہ داغ داغ اُجالا، یہ شب گزیدہ سحر
وہ انتظار تھا جس کا، یہ وہ سحر تو نہیں

یہ وہ سحر تو نہیں جس کی آرزو لے کر
چلے تھے یار کہ مل جائے گی کہیں نہ کہیں
فلک کے دشت میں تاروں کی آخری منزل
کہیں تو ہوگا شبِ سست موج کا ساحل
کہیں تو جا کے رکے گا سفینۂ غمِ دل

ابھی گرانیٔ شب میں کمی نہیں آئی
نجاتِ دیدہ و دل کی گھڑی نہیں آئی
چلے چلو کہ وہ منزل ابھی نہیں آئی!',
    'ur',
    'rtl',
    'Dast-e-Saba (1952), Faiz Ahmad Faiz',
    'نور خان مینگل',
    'فیض احمد فیض نا شاہکار نظم صبح آزادی نا براہوئی زبان ٹی منظوم مٹ۔',
    'published',
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Seed Article 3: Article / Criticism / Essay (World Literature and Translation)
INSERT INTO articles (
    title, subtitle, slug, category, body, cover_image_url, cover_alt,
    writer_id, original_title, original_text, original_lang, original_dir,
    source_credit, translator_name, meta_description, status, published_at
) VALUES (
    'جہانی ادب و مٹ و بدل نا کڑد',
    'بورخیس نا لٹریچر و ترجمہ آ فکر انگیز کالم',
    'world-literature-and-translation',
    'articles',
    'اسہ کتاب اس ہروخت تینا اولیکو زبان نا قید آن پاش مروک اسہ جہانی پند اس کٹنگ نا کوشست کریکہ۔ مٹ و بدل (ترجمہ) ہچ وختی اسہ بے جان نقل اس مفک، بلکن او تخلیقی ارواہ نا پین ارواہ اسے ٹی داخل مننگ نا نامدار کسر ءِ۔

ہر زبان کائنات ءِ ہرنگ نا تینا اسہ جتا خن اس تخک۔ ہراتم نن انگریزی یا ہسپانوی نا کسّہ سے براہوئی نا لبز اتے ٹی مٹ کینہ، تو نن بیرہ الفاظ آتے بدل تفنہ، بلکن نن اسہ نوکیں تہذیبی پل اس جوڑ کینہ۔ دا پل جہان نا گڑتی، مہر، درد و فکر ءِ ننا چاگڑد نا نیام آ اتیک۔

بورخیس نا ہیت ئس کہ اصل متن نا پابندی آن گیشتر ترجمہ نا اندرونی صداقت اہمیت تخک۔ اسہ جوانیں ترجمہ اس تینا وجود ٹی خود اسہ پین ادبی معجزہ اس جوڑ مریک۔ براہوئی زبان ٹی جہانی ادب نا ترجمہ کڑد نا نشاندہی کریک کہ ننا لبزاک ہم جہانی معیار تا کڑد ءِ پاش کننگ نا پبی کچ تخارہ۔',
    '/brahui-tarjuma.jpeg',
    'Borges essay Brahui translation cover',
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'The Homeric Versions (Las versiones homéricas)',
    'No problem is as completely concordant with literature and its modest mystery as the questions posed by translation. To suppose that every recombination of elements is necessarily inferior to its original form is to suppose that draft nine is necessarily inferior to draft H -- for there can only be drafts. The concept of the definitive text corresponds only to religion or exhaustion.

A translation is not a copy; it is a continuation of the life of a work into another linguistic and cultural atmosphere. Through translation, languages cross-pollinate, expand their horizons, and enrich the collective human consciousness.',
    'en',
    'ltr',
    'Selected Non-Fictions, Jorge Luis Borges',
    'ڈاکٹر خدائیداد بزدار',
    'بورخیس نا ترجمہ و جہانی ادب آ فکر انگیز مضمون نا براہوئی زبان ٹی فکری ترجمہ۔',
    'published',
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Static Pages: About and Contact
INSERT INTO static_pages (id, title, body)
VALUES (
    'about',
    'About Brahui Tarjuma (براہوئی ترجمہ نا باروٹ)',
    'Welcome to Brahui Tarjuma (براہوئی ترجمہ) — a dedicated literary repository committed to translating world masterpieces, classical fiction, contemporary poetry, critical essays, and thought-provoking research into the rich and ancient Brahui language.

Our mission is to bridge cultures and philosophies by enriching Brahui literature with the world’s finest intellectual treasures, rendered in authentic Jameel Noori Nastaliq script.

Founded as a focused digital archive, Brahui Tarjuma connects Brahui readers and students of literature to universal ideas while celebrating the linguistic beauty and expressive power of Brahui.'
) ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body;

INSERT INTO static_pages (id, title, body)
VALUES (
    'contact',
    'Contact Brahui Tarjuma (رابطہ)',
    'If you are a translator, researcher, or writer who has translated world literature, poetry, fiction, or criticism into Brahui, we warmly welcome your contributions. 

Please reach out to the editor at:
Email: editor@brahuitarjuma.org (or your personal admin contact)
Location: Quetta / Balochistan, Pakistan

Submissions should include the Brahui text, original source credits, and original author details.'
) ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body;
