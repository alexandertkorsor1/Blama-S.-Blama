import { useState, useEffect } from 'react';
import {
  Landmark,
  Award,
  TrendingUp,
  Users,
  Heart,
  Save,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Edit3,
  Upload,
} from 'lucide-react';
import { useSectionContent } from '@/hooks/useSectionContent';
import ImageSelectorUploader from '@/components/admin/ImageSelectorUploader';

export default function AdminLeadershipPage() {
  const { sections, updateSectionMeta, resetAllSections } = useSectionContent();

  const [pyppEyebrow, setPyppEyebrow] = useState(sections.pypp.eyebrow);
  const [pyppTitle, setPyppTitle] = useState(sections.pypp.title);
  const [pyppSubtitle, setPyppSubtitle] = useState(sections.pypp.subtitle);
  const [pyppDescription, setPyppDescription] = useState(sections.pypp.description);
  const [pyppFeatures, setPyppFeatures] = useState(sections.pypp.features);
  const [pyppShowcase, setPyppShowcase] = useState(sections.pypp.showcase);

  const [leadEyebrow, setLeadEyebrow] = useState(sections.leadership.eyebrow);
  const [leadTitle, setLeadTitle] = useState(sections.leadership.title);
  const [leadDescription, setLeadDescription] = useState(sections.leadership.description);
  const [leadAreas, setLeadAreas] = useState(sections.leadership.areas);

  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setPyppEyebrow(sections.pypp.eyebrow);
    setPyppTitle(sections.pypp.title);
    setPyppSubtitle(sections.pypp.subtitle);
    setPyppDescription(sections.pypp.description);
    setPyppFeatures(sections.pypp.features);
    setPyppShowcase(sections.pypp.showcase);

    setLeadEyebrow(sections.leadership.eyebrow);
    setLeadTitle(sections.leadership.title);
    setLeadDescription(sections.leadership.description);
    setLeadAreas(sections.leadership.areas);
  }, [sections]);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    updateSectionMeta('pypp', {
      eyebrow: pyppEyebrow.trim(),
      title: pyppTitle.trim(),
      subtitle: pyppSubtitle.trim(),
      description: pyppDescription.trim(),
      features: pyppFeatures,
      showcase: pyppShowcase,
    });

    updateSectionMeta('leadership', {
      eyebrow: leadEyebrow.trim(),
      title: leadTitle.trim(),
      description: leadDescription.trim(),
      areas: leadAreas,
    });

    setMessage({ kind: 'success', text: 'Leadership and PYPP Fellowship content updated successfully.' });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset Leadership & PYPP fellowship sections to curated defaults?')) return;
    resetAllSections();
    setMessage({ kind: 'success', text: 'Restored official curated fellowship copy.' });
  };

  const updateFeature = (index: number, field: 'title' | 'text', val: string) => {
    setPyppFeatures((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const updateShowcase = (index: number, field: string, val: string) => {
    setPyppShowcase((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const updateLeadArea = (index: number, field: 'title' | 'text', val: string) => {
    setLeadAreas((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fadeIn font-sans pb-12">
      {/* Top Banner */}
      <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
              <Landmark size={22} />
            </div>
            <h1 className="font-serif text-3xl font-bold">Leadership & Public Service Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">
              Administrator controls for the President's Young Professionals Program (PYPP) Fellowship showcase, leadership pillars, and civilian defense field operations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white hover:border-gold-500 transition-colors"
            >
              <RefreshCw size={16} /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="btn-gold !py-2.5 !px-5 text-sm font-bold shadow-md"
            >
              <Save size={17} /> Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Alert Notice */}
      {message && (
        <div
          role={message.kind === 'error' ? 'alert' : 'status'}
          className={
            'rounded-2xl border p-4 text-sm font-medium ' +
            (message.kind === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800')
          }
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-10">
        {/* SECTION 1: PRESIDENT'S YOUNG PROFESSIONALS PROGRAM (PYPP) */}
        <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-navy-100 pb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-700">
              FEATURED NATIONAL FELLOWSHIP SECTION
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-navy-950">
              President's Young Professionals Program (PYPP)
            </h2>
            <p className="mt-1 text-xs text-navy-600">
              Configure hero badges, fellowship designation, mission overview, the 4 pillar cards, and field action images.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-navy-800">
                Eyebrow Label
              </label>
              <input
                type="text"
                value={pyppEyebrow}
                onChange={(e) => setPyppEyebrow(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800">
                Section Heading / Title
              </label>
              <input
                type="text"
                value={pyppTitle}
                onChange={(e) => setPyppTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-navy-800">
                Fellowship Role & Placement Subtitle
              </label>
              <input
                type="text"
                value={pyppSubtitle}
                onChange={(e) => setPyppSubtitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-navy-800">
                Fellowship Mission Overview Statement
              </label>
              <textarea
                rows={3}
                value={pyppDescription}
                onChange={(e) => setPyppDescription(e.target.value)}
                className="mt-1.5 w-full resize-none rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>
          </div>

          {/* 4 PYPP Pillars */}
          <div className="space-y-4 pt-4 border-t border-navy-100">
            <h3 className="font-serif text-lg font-bold text-navy-950">
              PYPP Fellowship Core Pillars (4 Cards)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pyppFeatures.map((feat, i) => (
                <div key={i} className="rounded-2xl border border-parchment-300 bg-parchment-50/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-gold-800">
                      Pillar 0{i + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => updateFeature(i, 'title', e.target.value)}
                    placeholder="Pillar Title"
                    className="w-full rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={feat.text}
                    onChange={(e) => updateFeature(i, 'text', e.target.value)}
                    placeholder="Pillar Description"
                    className="w-full resize-none rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs text-navy-800 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 2 Showcase Action Cards */}
          <div className="space-y-4 pt-4 border-t border-navy-100">
            <h3 className="font-serif text-lg font-bold text-navy-950">
              Field Delegation & Operations Showcase (2 Image Cards)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pyppShowcase.map((card, i) => (
                <div key={i} className="rounded-2xl border border-navy-200 bg-cream-50 p-5 space-y-4">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-navy-900 border border-navy-800">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="h-full w-full object-cover object-[center_25%]"
                    />
                  </div>

                  <ImageSelectorUploader
                    label={`Select Image for Showcase Card 0${i + 1}`}
                    currentUrl={card.imageUrl}
                    onSelectImage={(url) => updateShowcase(i, 'imageUrl', url)}
                    aspectRatio="16/10"
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-navy-800">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={card.tag}
                      onChange={(e) => updateShowcase(i, 'tag', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-navy-800">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateShowcase(i, 'title', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-bold text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-navy-800">
                      Description & Location Context
                    </label>
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => updateShowcase(i, 'description', e.target.value)}
                      className="mt-1 w-full resize-none rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs text-navy-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: LEADERSHIP & PUBLIC SERVICE */}
        <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-navy-100 pb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-700">
              CIVILIAN LEADERSHIP PROFILE
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-navy-950">
              Leadership & Public Service Areas
            </h2>
            <p className="mt-1 text-xs text-navy-600">
              Configure titles, summaries, and the four focal leadership domains displayed on the main page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-navy-800">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={leadEyebrow}
                onChange={(e) => setLeadEyebrow(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800">
                Section Title
              </label>
              <input
                type="text"
                value={leadTitle}
                onChange={(e) => setLeadTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-navy-800">
                Section Subtitle / Description
              </label>
              <input
                type="text"
                value={leadDescription}
                onChange={(e) => setLeadDescription(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>
          </div>

          {/* 4 Leadership Areas */}
          <div className="space-y-4 pt-4 border-t border-navy-100">
            <h3 className="font-serif text-lg font-bold text-navy-950">
              Leadership Focus Areas (4 Blocks)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leadAreas.map((area, i) => (
                <div key={i} className="rounded-2xl border border-parchment-300 bg-parchment-50/60 p-4 space-y-2">
                  <span className="font-mono text-[11px] font-bold text-gold-800">
                    Area 0{i + 1}
                  </span>
                  <input
                    type="text"
                    value={area.title}
                    onChange={(e) => updateLeadArea(i, 'title', e.target.value)}
                    placeholder="Area Title"
                    className="w-full rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={area.text}
                    onChange={(e) => updateLeadArea(i, 'text', e.target.value)}
                    placeholder="Area Description"
                    className="w-full resize-none rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs text-navy-800 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Save Action Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="btn-gold !py-3 !px-8 text-sm font-bold shadow-lg"
          >
            <Save size={18} />
            <span>Save All Leadership & Fellowship Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
