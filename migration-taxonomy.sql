-- Brahui Laozaank nested taxonomy upgrade. Safe to rerun; keeps all article and writer rows.
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ur text NOT NULL,
  parent_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 0
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admin full access on categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin full access on categories" ON public.categories FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('poetry','Poetry','شاعری',NULL,1,0) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('prose','Prose','نثر',NULL,2,0) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;

INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('ghazal','Ghazal','غزل',(SELECT id FROM public.categories WHERE slug='poetry'),1,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('sher','Couplet / Sher','شعر',(SELECT id FROM public.categories WHERE slug='poetry'),2,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('rubai','Quatrain / Rubai','رباعی',(SELECT id FROM public.categories WHERE slug='poetry'),3,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('nazm','Nazm','نظم',(SELECT id FROM public.categories WHERE slug='poetry'),4,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('folk-poetry','Folk Poetry','لوک شاعری',(SELECT id FROM public.categories WHERE slug='poetry'),5,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('other-poetry','Other Poetry','دیگر',(SELECT id FROM public.categories WHERE slug='poetry'),6,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('fiction','Fiction','فکشن',(SELECT id FROM public.categories WHERE slug='prose'),1,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('non-fiction','Non-Fiction','غیر افسانوی',(SELECT id FROM public.categories WHERE slug='prose'),2,1) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;

INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('prose-poem','Prose Poem','نثری نظم',(SELECT id FROM public.categories WHERE slug='nazm'),1,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('free-verse','Free Verse','آزاد نظم',(SELECT id FROM public.categories WHERE slug='nazm'),2,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('blank-verse','Blank Verse','نظمِ معریٰ',(SELECT id FROM public.categories WHERE slug='nazm'),3,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('short-story','Short Story','افسانہ / مختصر کہانی',(SELECT id FROM public.categories WHERE slug='fiction'),1,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('novelette','Novelette','ناولٹ',(SELECT id FROM public.categories WHERE slug='fiction'),2,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('novel','Novel','ناول',(SELECT id FROM public.categories WHERE slug='fiction'),3,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('drama','Drama','ڈراما',(SELECT id FROM public.categories WHERE slug='fiction'),4,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('folk-tales','Folk Tales','لوک کہانیاں',(SELECT id FROM public.categories WHERE slug='fiction'),5,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('humour-satire','Humour & Satire','طنز و مزاح',(SELECT id FROM public.categories WHERE slug='fiction'),6,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('articles','Articles','مضامین',(SELECT id FROM public.categories WHERE slug='non-fiction'),1,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('essays','Essays','انشائیے',(SELECT id FROM public.categories WHERE slug='non-fiction'),2,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('research','Research','تحقیق',(SELECT id FROM public.categories WHERE slug='non-fiction'),3,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('criticism','Criticism','تنقید',(SELECT id FROM public.categories WHERE slug='non-fiction'),4,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('interviews','Interviews','انٹرویوز',(SELECT id FROM public.categories WHERE slug='non-fiction'),5,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('biographies','Biographies','سوانح',(SELECT id FROM public.categories WHERE slug='non-fiction'),6,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('memoirs','Memoirs & Autobiography','خود نوشت',(SELECT id FROM public.categories WHERE slug='non-fiction'),7,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('sketches','Sketches','خاکے',(SELECT id FROM public.categories WHERE slug='non-fiction'),8,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('travelogue','Travelogue','سفرنامہ',(SELECT id FROM public.categories WHERE slug='non-fiction'),9,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('letters','Letters','خطوط',(SELECT id FROM public.categories WHERE slug='non-fiction'),10,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;
INSERT INTO public.categories (slug, name_en, name_ur, parent_id, sort_order, level) VALUES ('reviews','Reviews','تبصرے',(SELECT id FROM public.categories WHERE slug='non-fiction'),11,2) ON CONFLICT (slug) DO UPDATE SET name_en=EXCLUDED.name_en, name_ur=EXCLUDED.name_ur, parent_id=EXCLUDED.parent_id, sort_order=EXCLUDED.sort_order, level=EXCLUDED.level;

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id),
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Remove only CHECK constraints that restrict articles.category to the former flat category list.
DO $$ DECLARE c record; BEGIN
  FOR c IN
    SELECT con.conname FROM pg_constraint con
    WHERE con.conrelid = 'public.articles'::regclass AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%category%'
      AND pg_get_constraintdef(con.oid) NOT ILIKE '%content_type%'
      AND pg_get_constraintdef(con.oid) NOT ILIKE '%fiction_form%'
  LOOP
    EXECUTE format('ALTER TABLE public.articles DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

-- Map the former five categories without changing or deleting any article.
UPDATE public.articles a
SET category = CASE
      WHEN a.category = 'fiction' AND a.fiction_form = 'novel' THEN 'novel'
      WHEN a.category = 'fiction' AND a.fiction_form = 'other' THEN 'fiction'
      WHEN a.category = 'fiction' THEN 'short-story'
      WHEN a.category = 'poetry' THEN 'nazm'
      WHEN a.category = 'criticism' THEN 'criticism'
      WHEN a.category = 'research' THEN 'research'
      WHEN a.category = 'articles' THEN 'articles'
      ELSE a.category
    END,
    category_id = (SELECT c.id FROM public.categories c WHERE c.slug = CASE
      WHEN a.category = 'fiction' AND a.fiction_form = 'novel' THEN 'novel'
      WHEN a.category = 'fiction' AND a.fiction_form = 'other' THEN 'fiction'
      WHEN a.category = 'fiction' THEN 'short-story'
      WHEN a.category = 'poetry' THEN 'nazm'
      WHEN a.category = 'criticism' THEN 'criticism'
      WHEN a.category = 'research' THEN 'research'
      WHEN a.category = 'articles' THEN 'articles'
      ELSE a.category
    END);

ALTER TABLE public.articles ALTER COLUMN category_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON public.articles(is_featured) WHERE is_featured = true;
