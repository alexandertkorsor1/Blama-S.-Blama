-- A curated, ordered image sequence for the public portfolio hero panel.
CREATE TABLE IF NOT EXISTS public.hero_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  storage_path text,
  alt text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_hero_images_updated_at BEFORE UPDATE ON public.hero_images
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_hero_images_order ON public.hero_images(display_order, published);
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published hero images" ON public.hero_images FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage hero images" ON public.hero_images FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
