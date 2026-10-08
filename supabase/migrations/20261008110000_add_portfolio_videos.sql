-- Featured portfolio videos managed by authenticated administrators.
CREATE TABLE IF NOT EXISTS public.portfolio_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  storage_path text,
  poster_url text,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_portfolio_videos_updated_at
  BEFORE UPDATE ON public.portfolio_videos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_portfolio_videos_order
  ON public.portfolio_videos(display_order, published);

ALTER TABLE public.portfolio_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published portfolio videos"
  ON public.portfolio_videos FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage portfolio videos"
  ON public.portfolio_videos FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
