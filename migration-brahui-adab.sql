-- Brahui Laozaank upgrade for existing Supabase projects. Safe to run more than once.
-- Existing rows receive content_type = 'translation' from the column default.
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'translation',
  ADD COLUMN IF NOT EXISTS translator_title text,
  ADD COLUMN IF NOT EXISTS fiction_form text,
  ADD COLUMN IF NOT EXISTS references_text text;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_content_type_check' AND conrelid = 'public.articles'::regclass) THEN
    ALTER TABLE public.articles ADD CONSTRAINT articles_content_type_check CHECK (content_type IN ('translation', 'original'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_fiction_form_check' AND conrelid = 'public.articles'::regclass) THEN
    ALTER TABLE public.articles ADD CONSTRAINT articles_fiction_form_check CHECK (fiction_form IS NULL OR fiction_form IN ('short_story', 'novel', 'other'));
  END IF;
END $$;

ALTER TABLE public.articles ALTER COLUMN original_title DROP NOT NULL;
ALTER TABLE public.articles ALTER COLUMN original_text DROP NOT NULL;
ALTER TABLE public.articles ALTER COLUMN original_lang DROP NOT NULL;
ALTER TABLE public.articles ALTER COLUMN original_dir DROP NOT NULL;
ALTER TABLE public.articles ALTER COLUMN source_credit DROP NOT NULL;
ALTER TABLE public.articles ALTER COLUMN translator_name DROP NOT NULL;
ALTER TABLE public.articles ALTER COLUMN translator_title DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_content_type ON public.articles(content_type);

-- Optional writer classification; existing writers remain foreign authors by default.
ALTER TABLE public.writers ADD COLUMN IF NOT EXISTS writer_type text NOT NULL DEFAULT 'foreign';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'writers_writer_type_check' AND conrelid = 'public.writers'::regclass) THEN
    ALTER TABLE public.writers ADD CONSTRAINT writers_writer_type_check CHECK (writer_type IN ('brahui', 'foreign'));
  END IF;
END $$;

-- RLS policies are intentionally left intact. Existing published-only public reads and owner-only writes continue to apply.

-- Update previous brand mentions and the old translations-only About/Contact copy in place.
UPDATE public.static_pages
SET title = replace(replace(title, 'Brahui Tarjuma', 'Brahui Laozaank'), 'براہوئی ترجمہ', 'براہوئی لوزانک'),
    body = replace(replace(body, 'Brahui Tarjuma', 'Brahui Laozaank'), 'براہوئی ترجمہ', 'براہوئی لوزانک')
WHERE id IN ('about', 'contact');
UPDATE public.static_pages
SET body = replace(body,
  'a dedicated literary repository committed to translating world masterpieces, classical fiction, contemporary poetry, critical essays, and thought-provoking research into the rich and ancient Brahui language.',
  'a literary publication for original Brahui writing by Brahui writers and translations into Brahui.')
WHERE id = 'about';
UPDATE public.static_pages
SET body = replace(body,
  'If you are a translator, researcher, or writer who has translated world literature, poetry, fiction, or criticism into Brahui, we warmly welcome your contributions.',
  'If you are a Brahui writer, translator, researcher, or poet, we welcome original writing in Brahui and translations into Brahui.')
WHERE id = 'contact';
