-- Add an optional Brahui-script category label; existing labels and data stay intact.
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS name_brh text;
