-- Replace the previous site name in About and Contact content without deleting page settings.
UPDATE public.static_pages
SET title = replace(replace(title, 'Brahui Tarjuma', 'Brahui Laozaank'), 'براہوئی ترجمہ', 'براہوئی لوزانک'),
    body = replace(replace(body, 'Brahui Tarjuma', 'Brahui Laozaank'), 'براہوئی ترجمہ', 'براہوئی لوزانک')
WHERE id IN ('about', 'contact')
  AND (title LIKE '%Brahui Tarjuma%' OR body LIKE '%Brahui Tarjuma%' OR title LIKE '%براہوئی ترجمہ%' OR body LIKE '%براہوئی ترجمہ%');
