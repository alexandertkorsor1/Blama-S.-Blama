import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Save, UserCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageSelectorUploader from '@/components/admin/ImageSelectorUploader';

type ProfileForm = {
  full_name: string;
  professional_name: string;
  title: string;
  tagline: string;
  statement: string;
  country: string;
  location: string;
  email: string;
  linkedin: string;
  profile_image_url: string;
};

const emptyProfile: ProfileForm = {
  full_name: '', professional_name: '', title: '', tagline: '', statement: '', country: '', location: '', email: '', linkedin: '', profile_image_url: '',
};

const optionalValue = (value: string) => value.trim() || null;

export default function AdminProfilePage() {
  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setNotice(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[Profile] Unable to load profile:', error);
        setLoadError('Unable to load your profile. Please try again.');
        return;
      }

      if (!data) {
        setProfileId(null);
        setForm(emptyProfile);
        return;
      }

      setProfileId(data.id);
      setForm({
        full_name: data.full_name,
        professional_name: data.professional_name ?? '',
        title: data.title,
        tagline: data.tagline ?? '',
        statement: data.statement ?? '',
        country: data.country ?? '',
        location: data.location ?? '',
        email: data.email ?? '',
        linkedin: data.linkedin ?? '',
        profile_image_url: data.profile_image_url ?? '',
      });
    } catch (error) {
      console.error('[Profile] Unexpected load failure:', error);
      setLoadError('Unable to load your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadProfile(); }, [loadProfile]);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice(null);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    if (!form.full_name.trim() || !form.title.trim()) {
      setNotice('Full name and professional title are required.');
      return;
    }

    setIsSaving(true);
    setNotice(null);
    const profileData = {
      full_name: form.full_name.trim(),
      title: form.title.trim(),
      professional_name: optionalValue(form.professional_name),
      tagline: optionalValue(form.tagline),
      statement: optionalValue(form.statement),
      country: optionalValue(form.country),
      location: optionalValue(form.location),
      email: optionalValue(form.email),
      linkedin: optionalValue(form.linkedin),
      profile_image_url: optionalValue(form.profile_image_url),
    };

    try {
      if (profileId) {
        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', profileId)
          .select('*')
          .single();
        if (error || !data) {
          console.error('[Profile] Unable to update profile:', error);
          setNotice('Unable to save your profile. Please try again.');
          return;
        }
        setProfileId(data.id);
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select('*')
          .single();
        if (error || !data) {
          console.error('[Profile] Unable to create profile:', error);
          setNotice('Unable to save your profile. Please try again.');
          return;
        }
        setProfileId(data.id);
      }
      setForm({
        full_name: profileData.full_name,
        title: profileData.title,
        professional_name: profileData.professional_name ?? '',
        tagline: profileData.tagline ?? '',
        statement: profileData.statement ?? '',
        country: profileData.country ?? '',
        location: profileData.location ?? '',
        email: profileData.email ?? '',
        linkedin: profileData.linkedin ?? '',
        profile_image_url: profileData.profile_image_url ?? '',
      });
      setNotice('Profile saved successfully.');
    } catch (error) {
      console.error('[Profile] Unexpected save failure:', error);
      setNotice('Unable to save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const fields: Array<{ field: keyof ProfileForm; label: string; type?: string; placeholder?: string }> = [
    { field: 'full_name', label: 'Full Name', placeholder: 'Blama S. Blama' },
    { field: 'professional_name', label: 'Professional Name', placeholder: 'Blama S. Blama' },
    { field: 'title', label: 'Professional Title', placeholder: 'Attorney at Law' },
    { field: 'country', label: 'Country', placeholder: 'Liberia' },
    { field: 'location', label: 'Location', placeholder: 'Monrovia' },
    { field: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com' },
    { field: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://www.linkedin.com/in/your-profile' },
  ];

  if (isLoading) {
    return <div className="mx-auto max-w-5xl space-y-6 animate-pulse"><div className="h-40 rounded-3xl bg-navy-100" /><div className="h-96 rounded-3xl bg-white" /></div>;
  }

  return <div className="mx-auto max-w-5xl space-y-6 animate-fadeIn">
    <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300"><UserCheck size={22} /></div><h1 className="font-serif text-3xl font-bold">Profile & Identity</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">Maintain the primary professional profile shown throughout the Blama S. Blama portfolio.</p></div><button type="button" onClick={() => void loadProfile()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-gold-500"><RefreshCw size={16} /> Refresh profile</button></div></section>

    {loadError && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"><p className="font-semibold">{loadError}</p><button type="button" onClick={() => void loadProfile()} className="mt-3 font-semibold underline underline-offset-4">Try again</button></div>}

    {!loadError && <form onSubmit={handleSave} className="space-y-6"><section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex flex-col gap-2 border-b border-navy-100 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-serif text-2xl font-bold text-navy-950">{profileId ? 'Edit profile' : 'Create primary profile'}</h2><p className="mt-1 text-sm text-navy-600">{profileId ? 'Updates are saved directly to the portfolio profile.' : 'No profile exists yet. Complete the required fields to create it.'}</p></div></div>
      {notice && <div role="status" className={'mb-5 rounded-xl border p-4 text-sm ' + (notice === 'Profile saved successfully.' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800')}>{notice}</div>}
      <div className="space-y-8"><div><h3 className="font-serif text-lg font-bold text-navy-900">Identity</h3><div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{fields.slice(0, 3).map(({ field, label, type = 'text', placeholder }) => <label key={field} className="block text-sm font-semibold text-navy-800">{label}<input required={field === 'full_name' || field === 'title'} type={type} value={form[field]} onChange={(event) => updateField(field, event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-normal text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label>)}</div></div>
      <div className="border-t border-navy-100 pt-7"><h3 className="font-serif text-lg font-bold text-navy-900">Professional Positioning</h3><div className="mt-4 space-y-4"><label className="block text-sm font-semibold text-navy-800">Tagline<input value={form.tagline} onChange={(event) => updateField('tagline', event.target.value)} placeholder="A concise professional positioning statement" className="mt-2 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label><label className="block text-sm font-semibold text-navy-800">Professional Statement<textarea rows={6} value={form.statement} onChange={(event) => updateField('statement', event.target.value)} placeholder="Write the professional summary displayed on the portfolio." className="mt-2 w-full resize-y rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label></div></div>
      <div className="border-t border-navy-100 pt-7"><h3 className="font-serif text-lg font-bold text-navy-900">Location & Contact</h3><div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{fields.slice(3).map(({ field, label, type = 'text', placeholder }) => <label key={field} className="block text-sm font-semibold text-navy-800">{label}<input type={type} value={form[field]} onChange={(event) => updateField(field, event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-normal text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label>)}</div></div>
      <div className="border-t border-navy-100 pt-7">
        <ImageSelectorUploader
          value={form.profile_image_url}
          onChange={(newUrl) => updateField('profile_image_url', newUrl)}
          caption={form.tagline}
          onCaptionChange={(newCaption) => updateField('tagline', newCaption)}
          label="Profile & Executive Portrait Image"
          description="Select an official portrait from the portfolio archive or upload a new photo directly from your device. Add custom photo description and Text of Trust watermark."
        />
      </div>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-navy-100 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-navy-500">Required fields are marked when creating or updating the profile.</p><button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-bold text-navy-950 shadow-sm transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"><Save size={16} />{isSaving ? 'Saving…' : profileId ? 'Save profile' : 'Create profile'}</button></div>
    </section></form>}
  </div>;
}
