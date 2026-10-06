-- ==============================================================================
-- Migration: CMS Database Foundation & Admin Authorization
-- Project: Blama S. Blama Professional Portfolio
-- ==============================================================================

-- 1. Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Admin Users table (Links to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger for admin_users
CREATE TRIGGER tr_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Database-backed Authorization function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

-- 3. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  professional_name text,
  title text NOT NULL,
  tagline text,
  country text DEFAULT 'Liberia',
  email text,
  linkedin text,
  location text,
  statement text,
  profile_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Education table
CREATE TABLE IF NOT EXISTS public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  field text NOT NULL,
  year text,
  status text NOT NULL DEFAULT 'Completed',
  description text,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization text NOT NULL,
  role text NOT NULL,
  period text,
  current boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5a. Experience Responsibilities (relational)
CREATE TABLE IF NOT EXISTS public.experience_responsibilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  responsibility text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5b. Experience Skills Developed (relational)
CREATE TABLE IF NOT EXISTS public.experience_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  skill text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5c. Experience Achievements (relational)
CREATE TABLE IF NOT EXISTS public.experience_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  achievement text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  organization text NOT NULL,
  year text,
  description text,
  verified boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. Skill Categories table
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  icon text DEFAULT 'Briefcase',
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_skill_categories_updated_at
  BEFORE UPDATE ON public.skill_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7a. Skills table (relational)
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  date text,
  read_time text,
  excerpt text,
  content text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'upcoming', 'archived')),
  published_at timestamptz,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Gallery Images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text,
  image_url text NOT NULL,
  alt text NOT NULL,
  category text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Timeline Items table
CREATE TABLE IF NOT EXISTS public.timeline_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  organization text NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_timeline_items_updated_at
  BEFORE UPDATE ON public.timeline_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. Contact Messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz,
  replied_at timestamptz
);

-- 12. Site Settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text DEFAULT 'Blama S. Blama | Business Management, Leadership & Legal Studies',
  site_description text,
  contact_form_enabled boolean NOT NULL DEFAULT true,
  maintenance_mode boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_education_order ON public.education(display_order, published);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON public.experiences(display_order, published);
CREATE INDEX IF NOT EXISTS idx_exp_resp_exp_id ON public.experience_responsibilities(experience_id, display_order);
CREATE INDEX IF NOT EXISTS idx_exp_skills_exp_id ON public.experience_skills(experience_id, display_order);
CREATE INDEX IF NOT EXISTS idx_exp_ach_exp_id ON public.experience_achievements(experience_id, display_order);
CREATE INDEX IF NOT EXISTS idx_achievements_order ON public.achievements(category, display_order, published);
CREATE INDEX IF NOT EXISTS idx_skill_cat_order ON public.skill_categories(display_order, published);
CREATE INDEX IF NOT EXISTS idx_skills_cat_order ON public.skills(category_id, display_order, published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON public.gallery_images(category, display_order, published);
CREATE INDEX IF NOT EXISTS idx_timeline_order ON public.timeline_items(display_order, published);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages(status, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Public Read Policies (Published Content Only)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Public can view published education"
  ON public.education FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view published experiences"
  ON public.experiences FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view published experience responsibilities"
  ON public.experience_responsibilities FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.experiences e WHERE e.id = experience_id AND e.published = true));

CREATE POLICY "Public can view published experience skills"
  ON public.experience_skills FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.experiences e WHERE e.id = experience_id AND e.published = true));

CREATE POLICY "Public can view published experience achievements"
  ON public.experience_achievements FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.experiences e WHERE e.id = experience_id AND e.published = true));

CREATE POLICY "Public can view published achievements"
  ON public.achievements FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view published skill categories"
  ON public.skill_categories FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view published skills"
  ON public.skills FOR SELECT
  USING (published = true AND EXISTS (SELECT 1 FROM public.skill_categories sc WHERE sc.id = category_id AND sc.published = true));

CREATE POLICY "Public can view published or upcoming articles"
  ON public.articles FOR SELECT
  USING (status IN ('published', 'upcoming'));

CREATE POLICY "Public can view published gallery images"
  ON public.gallery_images FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view published timeline items"
  ON public.timeline_items FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (
    char_length(name) > 0 AND
    char_length(email) > 0 AND
    char_length(subject) > 0 AND
    char_length(message) > 0
  );

-- ------------------------------------------------------------------------------
-- Admin Policies (Full Management via is_admin())
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can manage admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage education"
  ON public.education FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage experiences"
  ON public.experiences FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage experience responsibilities"
  ON public.experience_responsibilities FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage experience skills"
  ON public.experience_skills FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage experience achievements"
  ON public.experience_achievements FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage skill categories"
  ON public.skill_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage skills"
  ON public.skills FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage articles"
  ON public.articles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage gallery images"
  ON public.gallery_images FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage timeline items"
  ON public.timeline_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- Storage Bucket Setup (portfolio-media)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read portfolio media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admins can upload portfolio media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

CREATE POLICY "Admins can update portfolio media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

CREATE POLICY "Admins can delete portfolio media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.is_admin());
