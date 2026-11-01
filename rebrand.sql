-- Apply the new Brahui Matt o badal name to existing About and Contact content.
-- This updates only old brand wording, preserving the rest of the saved page text.
UPDATE public.static_pages
SET
  title = replace(
    replace(title, 'Brahui Tarjuma', 'Brahui Matt o badal'),
    'براہوئی ترجمہ', 'براہوئی مٹ و بدل'
  ),
  body = replace(
    replace(body, 'Brahui Tarjuma', 'Brahui Matt o badal'),
    'براہوئی ترجمہ', 'براہوئی مٹ و بدل'
  )
WHERE id IN ('about', 'contact')
  AND (title LIKE '%Brahui Tarjuma%' OR body LIKE '%Brahui Tarjuma%');
