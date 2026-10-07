import { Award, Landmark, Users, TrendingUp } from 'lucide-react';
import { useSectionContent } from '@/hooks/useSectionContent';

const iconLookup: Record<string, typeof Award> = {
  Award,
  TrendingUp,
  Landmark,
  Users,
};

export default function PYPPSection() {
  const { sections } = useSectionContent();
  const pypp = sections.pypp;

  return (
    <section id="pypp" className="relative section-padding py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(197,165,114,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,165,114,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="reveal text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
              {pypp.eyebrow}
            </span>
            <span className="h-px w-8 bg-gold-400" />
          </div>
          <h2 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {pypp.title}
          </h2>
          {pypp.subtitle && (
            <p className="mt-3 text-lg font-semibold text-gold-300 font-serif">{pypp.subtitle}</p>
          )}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-100 sm:text-lg">
            {pypp.description}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pypp.features.map((feature, index) => {
            const Icon = iconLookup[feature.iconName || ''] || [Award, TrendingUp, Landmark, Users][index % 4];
            return (
              <div
                key={feature.title}
                className="reveal rounded-2xl border border-gold-500/25 bg-navy-900/95 p-6 backdrop-blur-md transition-all duration-300 hover:border-gold-400 hover:bg-navy-850 shadow-md"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300 border border-gold-400/30">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-200">{feature.text}</p>
              </div>
            );
          })}
        </div>

        {/* PYPP in Action Showcase */}
        {pypp.showcase && pypp.showcase.length > 0 && (
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {pypp.showcase.map((card, index) => (
              <div
                key={card.title}
                className="reveal group relative overflow-hidden rounded-2xl border border-gold-500/30 bg-navy-900/90 shadow-xl transition-all duration-300 hover:border-gold-400"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-[16/10] overflow-hidden bg-navy-950">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="h-full w-full object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 bg-navy-900">
                  <span className="inline-block rounded-full bg-gold-500/20 border border-gold-400/40 px-3 py-0.5 text-xs font-mono font-bold text-gold-300">
                    {card.tag}
                  </span>
                  <h4 className="mt-3 font-serif text-xl font-bold text-white">
                    {card.title}
                  </h4>
                  <p className="mt-1.5 text-sm text-slate-200 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
