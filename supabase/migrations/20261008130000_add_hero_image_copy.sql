-- Per-image editorial copy for the public hero carousel.
ALTER TABLE public.hero_images
  ADD COLUMN IF NOT EXISTS caption text,
  ADD COLUMN IF NOT EXISTS description text;
