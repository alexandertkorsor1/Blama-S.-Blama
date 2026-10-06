import { useState } from 'react';
import { ArrowRight, Download, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/data/profile';

export default function Hero() {
  const [imageError, setImageError] = useState(false);

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
      className="relative min-h-screen flex items-center overflow-hidden bg-navy-900"
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(197,165,114,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(197,165,114,0.08) 0%, transparent 50%)',
          }}
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-8xl grid-cols-1 gap-12 px-5 pt-32 pb-20 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-12 lg:pt-28">
        {/* Left Column: Portrait Photo */}
        <div className="reveal flex justify-center lg:col-span-5 lg:justify-start order-2 lg:order-1" style={{ transitionDelay: '0.1s' }}>
          <div className="relative group">
            {/* Ambient golden aura */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-gold-500/20 via-gold-500/10 to-transparent blur-xl opacity-75 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Decorative nested borders */}
            <div className="absolute -inset-2.5 rounded-2xl border border-gold-500/30 transition-all duration-500 group-hover:border-gold-500/50" />
            <div className="absolute -inset-5 rounded-3xl border border-gold-500/15 transition-all duration-500 group-hover:border-gold-500/25" />
            
            {/* Main Portrait Card */}
            <div className="relative h-[420px] w-[310px] overflow-hidden rounded-2xl bg-navy-950 shadow-2xl ring-1 ring-gold-500/20 sm:h-[490px] sm:w-[380px]">
              {profile.photo && !imageError ? (
                <div className="relative h-full w-full">
                  <img
                    src={profile.photo}
                    alt={profile.fullName}
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover object-[center_12%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Subtle top and bottom vignette gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent opacity-90 pointer-events-none" />
                  
                  {/* Bottom Portrait Info Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-[2px]">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-navy-900/90 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gold-300 shadow-sm backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                      Executive Profile
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold text-white drop-shadow-md sm:text-2xl">
                      {profile.fullName}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-gold-200/90 drop-shadow">
                      {profile.professionalName} • Management & Legal Studies
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-navy-800 to-navy-950 p-8 text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold-500/30 bg-navy-700 shadow-inner">
                    <span className="font-serif text-4xl font-bold text-gold-400">BSB</span>
                  </div>
                  <p className="mt-6 text-sm font-medium text-navy-200">Professional Portrait</p>
                  <p className="mt-2 text-xs text-navy-400">
                    Photo to be provided
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Text & Information */}
        <div className="reveal lg:col-span-7 order-1 lg:order-2" style={{ transitionDelay: '0.15s' }}>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-500" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
              {profile.country}
            </span>
          </div>

          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Blama S. Blama
          </h1>

          <p className="mt-3 text-lg font-medium text-gold-300 sm:text-xl">
            Also known professionally as {profile.professionalName}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-navy-100 sm:text-base">
            <span>Business Management Professional</span>
            <span className="text-gold-500">/</span>
            <span>Law Student</span>
            <span className="text-gold-500">/</span>
            <span>Public-Service & Leadership Professional</span>
          </div>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-200 sm:text-lg">
            {profile.statement}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => scrollTo('journey')} className="btn-primary">
              Explore My Journey
              <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollTo('resume')} className="btn-secondary !border-navy-600 !text-navy-100 hover:!bg-white hover:!text-navy-900 hover:!border-white">
              <Download size={16} />
              Download Résumé
            </button>
            <button onClick={() => scrollTo('contact')} className="btn-ghost !text-gold-300 hover:!text-gold-400">
              <Mail size={16} />
              Connect Professionally
            </button>
          </div>

          <div className="mt-10 flex items-center gap-5">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-10 w-10 rounded-full border border-navy-600 text-navy-200 transition-all hover:border-gold-500 hover:text-gold-400"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-navy-600 text-navy-200 transition-all hover:border-gold-500 hover:text-gold-400"
              aria-label="Email contact"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-cream-100 pointer-events-none" />
    </section>
  );
}
