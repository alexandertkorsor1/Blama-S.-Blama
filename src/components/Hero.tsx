import { useState } from 'react';
import { ArrowRight, Download, Linkedin, Mail, FileText, MapPin, Scale } from 'lucide-react';
import { usePublicContent } from '@/context/PublicContentContext';

interface HeroProps {
  onOpenTextView?: () => void;
}

export default function Hero({ onOpenTextView }: HeroProps) {
  const [imageError, setImageError] = useState(false);
  const { profile } = usePublicContent();
  const fullName = profile?.full_name ?? 'Blama S. Blama';
  const professionalName = profile?.professional_name ?? 'Saah Blama';
  const title = profile?.title ?? 'Business Management Professional | Law Scholar | Public Administration & PYPP Fellow';
  const location = profile?.location ?? 'Monrovia, Republic of Liberia';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy-950 text-white"
    >
      {/* Background Architectural Grid & Subtle Radial Tone */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 25%, rgba(197,165,114,0.18) 0%, transparent 60%), radial-gradient(circle at 85% 75%, rgba(197,165,114,0.12) 0%, transparent 60%)',
          }}
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative z-10 site-container grid grid-cols-1 gap-12 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-12 lg:pt-32">
        {/* Left Column: Portrait Photo with Architectural Matting */}
        <div className="reveal flex justify-center lg:col-span-5 lg:justify-start order-2 lg:order-1" style={{ transitionDelay: '0.1s' }}>
          <div className="relative group">
            {/* Elegant Double Hairline Gold Border Frame */}
            <div className="absolute -inset-3.5 rounded-2xl border border-gold-500/30 transition-all duration-500 group-hover:border-gold-500/60" />
            <div className="absolute -inset-7 rounded-3xl border border-gold-500/15 transition-all duration-500 group-hover:border-gold-500/30 hidden sm:block" />
            
            {/* Main Portrait Container */}
            <div className="relative h-[430px] w-[310px] overflow-hidden rounded-xl bg-navy-900 shadow-2xl ring-1 ring-gold-500/30 sm:h-[500px] sm:w-[380px]">
              {profile?.profile_image_url && !imageError ? (
                <div className="relative h-full w-full">
                  <img
                    src={profile.profile_image_url}
                    alt={fullName}
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover object-[center_14%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent opacity-95 pointer-events-none" />
                  
                  {/* Bottom Portrait Tag */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="inline-flex items-center gap-1.5 rounded-md border border-gold-400/40 bg-navy-900/95 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-gold-300 backdrop-blur-md">
                      <Scale size={11} className="text-gold-400" />
                      Executive & Legal Scholar
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold text-white drop-shadow sm:text-2xl">
                      {fullName}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-gold-200/90 font-mono">
                      {professionalName} • PYPP Class XI
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-navy-900 p-8 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold-500/40 bg-navy-800 text-gold-400 font-serif text-3xl font-bold">
                    BSB
                  </div>
                  <p className="mt-4 font-serif text-lg font-bold text-white">{fullName}</p>
                  <p className="mt-1 text-xs text-gold-300 font-mono">{title}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Overview & Action Points */}
        <div className="reveal lg:col-span-7 order-1 lg:order-2" style={{ transitionDelay: '0.15s' }}>
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-gold-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
              REPUBLIC OF LIBERIA • EXECUTIVE PROFILE
            </span>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-6xl">
            {fullName}
          </h1>

          <p className="mt-3 text-lg font-medium text-gold-300 sm:text-xl font-serif italic">
            {profile?.tagline || `Bridging Enterprise Acumen, Public Service Stewardship & Equal Justice`}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-gold-200">
            <span className="rounded-md border border-gold-400/30 bg-navy-900/90 px-3 py-1 font-semibold">
              UMU BBA &apos;21 (Management)
            </span>
            <span className="rounded-md border border-gold-400/30 bg-navy-900/90 px-3 py-1 font-semibold">
              PYPP Class XI Fellow
            </span>
            <span className="rounded-md border border-gold-400/30 bg-navy-900/90 px-3 py-1 font-semibold">
              Ministry of National Defense
            </span>
            <span className="rounded-md border border-gold-400/30 bg-navy-900/90 px-3 py-1 font-semibold">
              Louis Arthur Grimes School of Law
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-100 sm:text-lg">
            {profile?.statement ||
              'A Liberian professional grounded in business management and driven by a commitment to public service, leadership, and the rule of law. My journey bridges organizational excellence with a deepening pursuit of legal research and equal justice.'}
          </p>

          {/* Action Hub: Visual vs Text Dossier */}
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            {onOpenTextView && (
              <button
                onClick={onOpenTextView}
                className="btn-gold !py-3.5 !px-6 text-sm font-bold shadow-lg"
              >
                <FileText size={16} />
                <span>Executive Text Dossier</span>
              </button>
            )}

            <button
              onClick={() => scrollTo('journey')}
              className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-navy-900/90 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-gold-400 hover:bg-gold-500/20"
            >
              <span>Explore Journey</span>
              <ArrowRight size={15} className="text-gold-400" />
            </button>

            <button
              onClick={() => scrollTo('resume')}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur-xs transition-all hover:bg-white/15 hover:border-white/40"
            >
              <Download size={15} className="text-gold-300" />
              <span>Résumé / CV Hub</span>
            </button>
          </div>

          {/* Quick Contact Line */}
          <div className="mt-9 flex flex-wrap items-center gap-6 border-t border-navy-800/80 pt-6 text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin size={14} className="text-gold-400" />
              {location}
            </span>
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 transition-colors text-slate-200 hover:text-gold-300"
              >
                <Mail size={14} className="text-gold-400" />
                {profile.email}
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors text-slate-200 hover:text-gold-300"
              >
                <Linkedin size={14} className="text-gold-400" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-cream-100 pointer-events-none" />
    </section>
  );
}
