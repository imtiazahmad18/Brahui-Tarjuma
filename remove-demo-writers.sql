-- One-time cleanup for the verified sample content from the project's setup SQL.
-- Only these exact demo article slugs and writer IDs/slugs are affected.
BEGIN;

DELETE FROM public.chapters AS c
USING public.articles AS a
WHERE c.article_id = a.id
  AND a.slug IN (
    'toba-tek-singh',
    'azadi-na-sohb',
    'world-literature-and-translation'
  );

DELETE FROM public.articles
WHERE slug IN (
  'toba-tek-singh',
  'azadi-na-sohb',
  'world-literature-and-translation'
);

DELETE FROM public.writers AS w
WHERE (
  (w.id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'::uuid AND w.slug = 'saadat-hasan-manto')
  OR (w.id = 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'::uuid AND w.slug = 'faiz-ahmad-faiz')
  OR (w.id = 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'::uuid AND w.slug = 'jorge-luis-borges')
)
AND NOT EXISTS (SELECT 1 FROM public.articles AS a WHERE a.writer_id = w.id);

COMMIT;
