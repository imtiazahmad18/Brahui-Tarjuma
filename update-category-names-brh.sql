-- Idempotent Brahui category-name update from the owner-reviewed locale file.
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_brh text;

UPDATE public.categories AS c
SET name_brh = v.name_brh
FROM (VALUES
  ('poetry', 'شاعری'),
  ('ghazal', 'غزل'),
  ('sher', 'شعر'),
  ('rubai', 'رباعی'),
  ('nazm', 'نظم'),
  ('prose-poem', 'نثری نظم'),
  ('free-verse', 'آزاد نظم'),
  ('blank-verse', 'نظمِ معریٰ'),
  ('folk-poetry', 'لوک شاعری'),
  ('other-poetry', 'پین'),
  ('prose', 'نثر'),
  ('fiction', 'فکشن'),
  ('short-story', 'افسانہ / چنکو قصہ'),
  ('novelette', 'ناولٹ'),
  ('novel', 'ناول'),
  ('drama', 'ڈراما'),
  ('folk-tales', 'لوک قصہ غال'),
  ('humour-satire', 'طنز و مزاح'),
  ('non-fiction', 'غیر افسانوی'),
  ('articles', 'مضامین / تحریریں'),
  ('essays', 'مضمون'),
  ('research', 'پٹ و پول'),
  ('criticism', 'نغد'),
  ('interviews', 'انٹرویوز'),
  ('biographies', 'سوانح'),
  ('memoirs', 'خود نوشت'),
  ('sketches', 'خاکہ'),
  ('travelogue', 'سفرنامہ'),
  ('letters', 'خطوط'),
  ('reviews', 'تبصرے')
) AS v(slug, name_brh)
WHERE c.slug = v.slug;
