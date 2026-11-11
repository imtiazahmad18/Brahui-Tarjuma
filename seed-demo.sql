-- Optional demo content for Brahui Laozaank. Placeholder copy only, not copyrighted text.
INSERT INTO writers (name, slug, bio, writer_type) VALUES
  ('Sample Brahui Writer', 'sample-brahui-writer', 'Sample profile for original Brahui writing.', 'brahui'),
  ('Sample Foreign Author', 'sample-foreign-author', 'Placeholder profile for translated works.', 'foreign')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, subtitle, slug, category, category_id, content_type, body, cover_image_url, cover_alt, writer_id, status, published_at, meta_description, is_featured)
SELECT '[Sample] Short story', 'A placeholder story', 'sample-original-short-story', 'short-story', c.id, 'original', 'Sample placeholder prose written for this demo only. Replace it with an original Brahui story.', '/brand/logo.png', 'Sample story cover', w.id, 'published', now(), 'Sample original short story placeholder.', true
FROM writers w CROSS JOIN categories c WHERE w.slug='sample-brahui-writer' AND c.slug='short-story'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, subtitle, slug, category, category_id, content_type, body, cover_image_url, cover_alt, writer_id, status, published_at, meta_description)
SELECT '[Sample] Sample Ghazal', 'A placeholder poem', 'sample-original-ghazal', 'ghazal', c.id, 'original', 'Sample first couplet line\nSample second couplet line\n\nSample next couplet line\nSample final couplet line', '/brand/logo.png', 'Sample ghazal cover', w.id, 'published', now(), 'Sample original Ghazal placeholder.'
FROM writers w CROSS JOIN categories c WHERE w.slug='sample-brahui-writer' AND c.slug='ghazal'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, subtitle, slug, category, category_id, content_type, body, cover_image_url, cover_alt, writer_id, status, published_at, meta_description, references_text)
SELECT '[Sample] Research note', 'Placeholder references', 'sample-original-research', 'research', c.id, 'original', 'Sample placeholder research text. Replace it with original work before publication.', '/brand/logo.png', 'Sample research cover', w.id, 'published', now(), 'Sample Brahui research placeholder.', 'Sample reference entry; replace with real sources.'
FROM writers w CROSS JOIN categories c WHERE w.slug='sample-brahui-writer' AND c.slug='research'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, subtitle, slug, category, category_id, content_type, body, cover_image_url, cover_alt, writer_id, original_title, original_text, original_lang, original_dir, source_credit, translator_name, translator_title, status, published_at, meta_description)
SELECT '[Sample] Translation story', 'A placeholder translation', 'sample-translation-story', 'short-story', c.id, 'translation', 'Sample placeholder translated text written for this demo only. It is not from a published work.', '/brand/logo.png', 'Sample translation cover', w.id, 'Sample source title', 'Sample source text written for this demo.', 'en', 'ltr', 'Sample citation placeholder', 'Sample Translator', '[Sample] Translation story', 'published', now(), 'Sample translation placeholder.'
FROM writers w CROSS JOIN categories c WHERE w.slug='sample-foreign-author' AND c.slug='short-story'
ON CONFLICT (slug) DO NOTHING;
