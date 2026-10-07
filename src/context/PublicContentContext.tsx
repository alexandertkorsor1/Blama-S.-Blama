import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import { profile as staticProfile } from '@/data/profile';
import { education as staticEducation } from '@/data/education';
import { experiences as staticExperiences } from '@/data/experience';
import { skillGroups as staticSkillGroups } from '@/data/skills';
import { articles as staticArticles } from '@/data/articles';
import { achievements as staticAchievements } from '@/data/achievements';
import { timelineEntries as staticTimelineEntries } from '@/data/timeline';
import { galleryImages as staticGalleryImages } from '@/data/gallery';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Experience = Database['public']['Tables']['experiences']['Row'];
type ExperienceResponsibility = Database['public']['Tables']['experience_responsibilities']['Row'];
type ExperienceSkill = Database['public']['Tables']['experience_skills']['Row'];
type ExperienceAchievement = Database['public']['Tables']['experience_achievements']['Row'];
type SkillCategory = Database['public']['Tables']['skill_categories']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type Article = Database['public']['Tables']['articles']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];
type GalleryImage = Database['public']['Tables']['gallery_images']['Row'];
type TimelineItem = Database['public']['Tables']['timeline_items']['Row'];
type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

export type PublicExperience = Experience & {
  responsibilities: ExperienceResponsibility[];
  skills: ExperienceSkill[];
  achievements: ExperienceAchievement[];
};

export type PublicGalleryImage = GalleryImage & { publicUrl: string };

type PublicContent = {
  profile: Profile | null;
  education: Education[];
  experiences: PublicExperience[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  articles: Article[];
  achievements: Achievement[];
  galleryImages: PublicGalleryImage[];
  timelineItems: TimelineItem[];
  settings: SiteSettings | null;
  isLoading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
};

const defaultProfile: Profile = {
  id: 'default-profile',
  full_name: staticProfile.fullName,
  professional_name: staticProfile.professionalName,
  title: staticProfile.title,
  tagline: staticProfile.tagline,
  country: staticProfile.country,
  email: staticProfile.email,
  linkedin: staticProfile.linkedin,
  location: staticProfile.location,
  statement: staticProfile.statement,
  profile_image_url: staticProfile.photo ?? '/profile.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const defaultEducation: Education[] = staticEducation.map((e, idx) => ({
  id: e.id,
  institution: e.institution,
  degree: e.degree,
  field: e.field,
  year: e.year,
  status: e.status,
  description: e.description,
  display_order: idx + 1,
  published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const defaultExperiences: PublicExperience[] = staticExperiences.map((exp, idx) => ({
  id: exp.id,
  organization: exp.organization,
  role: exp.role,
  period: exp.period,
  current: exp.current,
  display_order: idx + 1,
  published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  responsibilities: exp.responsibilities.map((r, rIdx) => ({
    id: `${exp.id}-resp-${rIdx}`,
    experience_id: exp.id,
    responsibility: r,
    display_order: rIdx + 1,
    created_at: new Date().toISOString(),
  })),
  skills: exp.skillsDeveloped.map((s, sIdx) => ({
    id: `${exp.id}-skill-${sIdx}`,
    experience_id: exp.id,
    skill: s,
    display_order: sIdx + 1,
    created_at: new Date().toISOString(),
  })),
  achievements: exp.achievements.map((a, aIdx) => ({
    id: `${exp.id}-ach-${aIdx}`,
    experience_id: exp.id,
    achievement: a,
    display_order: aIdx + 1,
    created_at: new Date().toISOString(),
  })),
}));

const defaultSkillCategories: SkillCategory[] = staticSkillGroups.map((group, idx) => ({
  id: group.id,
  category: group.category,
  icon: group.icon,
  display_order: idx + 1,
  published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const defaultSkills: Skill[] = staticSkillGroups.flatMap((group) =>
  group.skills.map((skillName, sIdx) => ({
    id: `${group.id}-skill-${sIdx}`,
    category_id: group.id,
    name: skillName,
    display_order: sIdx + 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
);

const defaultArticles: Article[] = staticArticles.map((art, idx) => ({
  id: art.id,
  title: art.title,
  slug: art.id,
  category: art.category,
  date: art.date,
  read_time: art.readTime,
  excerpt: art.excerpt,
  content: art.content,
  status: art.status,
  display_order: idx + 1,
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const defaultAchievements: Achievement[] = staticAchievements.map((ach, idx) => ({
  id: ach.id,
  category: ach.category,
  title: ach.title,
  organization: ach.organization,
  year: ach.year,
  description: ach.description,
  verified: ach.verified,
  display_order: idx + 1,
  published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const defaultTimelineItems: TimelineItem[] = staticTimelineEntries.map((t, idx) => ({
  id: t.id,
  year: t.year,
  category: t.category,
  title: t.title,
  organization: t.organization,
  description: t.description,
  display_order: idx + 1,
  published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const defaultGalleryImages: PublicGalleryImage[] = staticGalleryImages.map((img, idx) => ({
  id: `gallery-img-${idx}`,
  image_url: img.src,
  alt: img.alt,
  category: img.category,
  storage_path: null,
  publicUrl: img.src,
  display_order: idx + 1,
  published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const initialContent: Omit<PublicContent, 'isLoading' | 'error' | 'refresh'> = {
  profile: defaultProfile,
  education: defaultEducation,
  experiences: defaultExperiences,
  skillCategories: defaultSkillCategories,
  skills: defaultSkills,
  articles: defaultArticles,
  achievements: defaultAchievements,
  galleryImages: defaultGalleryImages,
  timelineItems: defaultTimelineItems,
  settings: null,
};

const toPublicImage = (image: GalleryImage): PublicGalleryImage => ({
  ...image,
  publicUrl: image.storage_path
    ? supabase.storage.from('portfolio-media').getPublicUrl(image.storage_path).data.publicUrl
    : image.image_url,
});

const PublicContentContext = createContext<PublicContent | undefined>(undefined);

export function PublicContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [
        profileResult,
        educationResult,
        experiencesResult,
        responsibilitiesResult,
        experienceSkillsResult,
        experienceAchievementsResult,
        categoriesResult,
        skillsResult,
        articlesResult,
        achievementsResult,
        galleryResult,
        timelineResult,
        settingsResult,
      ] = await Promise.all([
        supabase.from('profiles').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('education').select('*').order('display_order', { ascending: true }),
        supabase.from('experiences').select('*').order('display_order', { ascending: true }),
        supabase.from('experience_responsibilities').select('*').order('display_order', { ascending: true }),
        supabase.from('experience_skills').select('*').order('display_order', { ascending: true }),
        supabase.from('experience_achievements').select('*').order('display_order', { ascending: true }),
        supabase.from('skill_categories').select('*').order('display_order', { ascending: true }),
        supabase.from('skills').select('*').order('display_order', { ascending: true }),
        supabase.from('articles').select('*').order('display_order', { ascending: true }).order('published_at', { ascending: false }),
        supabase.from('achievements').select('*').order('display_order', { ascending: true }),
        supabase.from('gallery_images').select('*').order('display_order', { ascending: true }),
        supabase.from('timeline_items').select('*').order('display_order', { ascending: true }),
        supabase.from('site_settings').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      ]);

      const responsibilities = responsibilitiesResult.data ?? [];
      const experienceSkills = experienceSkillsResult.data ?? [];
      const experienceAchievements = experienceAchievementsResult.data ?? [];
      
      const experiencesFromDb = (experiencesResult.data && experiencesResult.data.length > 0)
        ? experiencesResult.data.map((experience) => ({
            ...experience,
            responsibilities: responsibilities.filter((item) => item.experience_id === experience.id),
            skills: experienceSkills.filter((item) => item.experience_id === experience.id),
            achievements: experienceAchievements.filter((item) => item.experience_id === experience.id),
          }))
        : defaultExperiences;

      const profileFromDb = profileResult.data ?? defaultProfile;
      const educationFromDb = (educationResult.data && educationResult.data.length > 0) ? educationResult.data : defaultEducation;
      const categoriesFromDb = (categoriesResult.data && categoriesResult.data.length > 0) ? categoriesResult.data : defaultSkillCategories;
      const skillsFromDb = (skillsResult.data && skillsResult.data.length > 0) ? skillsResult.data : defaultSkills;
      const articlesFromDb = (articlesResult.data && articlesResult.data.length > 0) ? articlesResult.data : defaultArticles;
      const achievementsFromDb = (achievementsResult.data && achievementsResult.data.length > 0) ? achievementsResult.data : defaultAchievements;
      const galleryFromDb = (galleryResult.data && galleryResult.data.length > 0) ? galleryResult.data.map(toPublicImage) : defaultGalleryImages;
      const timelineFromDb = (timelineResult.data && timelineResult.data.length > 0) ? timelineResult.data : defaultTimelineItems;

      setContent({
        profile: profileFromDb,
        education: educationFromDb,
        experiences: experiencesFromDb,
        skillCategories: categoriesFromDb,
        skills: skillsFromDb,
        articles: articlesFromDb,
        achievements: achievementsFromDb,
        galleryImages: galleryFromDb,
        timelineItems: timelineFromDb,
        settings: settingsResult.data ?? null,
      });
      setError(false);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const refreshSoon = () => window.setTimeout(() => void refresh(), 100);
    const tables = [
      'profiles', 'education', 'experiences', 'experience_responsibilities', 'experience_skills',
      'experience_achievements', 'skill_categories', 'skills', 'articles', 'achievements',
      'gallery_images', 'timeline_items', 'site_settings',
    ];
    let channel = supabase.channel('public-portfolio-content');
    tables.forEach((table) => {
      channel = channel.on('postgres_changes', { event: '*', schema: 'public', table }, refreshSoon);
    });
    channel.subscribe();

    const refreshOnFocus = () => void refresh();
    window.addEventListener('focus', refreshOnFocus);
    const interval = window.setInterval(() => void refresh(), 30000);

    return () => {
      window.removeEventListener('focus', refreshOnFocus);
      window.clearInterval(interval);
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  useEffect(() => {
    if (content.settings?.site_title) document.title = content.settings.site_title;
    if (content.settings?.site_description) {
      let description = document.querySelector('meta[name="description"]');
      if (!description) {
        description = document.createElement('meta');
        description.setAttribute('name', 'description');
        document.head.appendChild(description);
      }
      description.setAttribute('content', content.settings.site_description);
    }
  }, [content.settings]);

  const value = useMemo(() => ({ ...content, isLoading, error, refresh }), [content, error, isLoading, refresh]);
  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

export function usePublicContent(): PublicContent {
  const context = useContext(PublicContentContext);
  if (!context) throw new Error('usePublicContent must be used within PublicContentProvider.');
  return context;
}
