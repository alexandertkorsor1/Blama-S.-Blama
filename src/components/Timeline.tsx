import { GraduationCap, Briefcase, Award, Landmark, Scale, Compass } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePublicContent } from '@/context/PublicContentContext';

const categoryConfig: Record<string, { icon: typeof GraduationCap; badgeColor: string; iconColor: string }> = {
  Education: { icon: GraduationCap, badgeColor: 'bg-navy-900 text-gold-300', iconColor: 'bg-navy-900 text-gold-300 ring-4 ring-white shadow-md' },
  Professional: { icon: Briefcase, badgeColor: 'bg-gold-700 text-white', iconColor: 'bg-gold-600 text-white ring-4 ring-white shadow-md' },
  PYPP: { icon: Award, badgeColor: 'bg-navy-800 text-gold-300', iconColor: 'bg-navy-800 text-gold-300 ring-4 ring-white shadow-md' },
  'Public Service': { icon: Landmark, badgeColor: 'bg-navy-950 text-gold-300', iconColor: 'bg-navy-900 text-gold-300 ring-4 ring-white shadow-md' },
  'Legal Studies': { icon: Scale, badgeColor: 'bg-gold-800 text-white', iconColor: 'bg-gold-700 text-white ring-4 ring-white shadow-md' },
  Future: { icon: Compass, badgeColor: 'bg-navy-800 text-gold-300', iconColor: 'bg-navy-800 text-gold-300 ring-4 ring-white shadow-md' },
};

export default function Timeline() {
  const { timelineItems } = usePublicContent();
  return (
    <section id="journey" className="bg-parchment-50 section-padding py-20 lg:py-28 border-t border-parchment-200">
      <div className="mx-auto max-w-5xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Milestone Trajectory"
            title="A timeline of growth and purpose"
            description="From business education through professional development, public service, and legal studies — each step builds on the last."
            align="center"
          />
        </div>

        <div className="relative mt-16">
          {/* Vertical Timeline Spine Line with Burnished Gold Gradient */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold-400 via-gold-500/60 to-gold-400 sm:left-1/2 sm:-translate-x-px" />

          {timelineItems.map((entry, index) => {
            const config = categoryConfig[entry.category] ?? categoryConfig.Professional;
            const Icon = config.icon;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={entry.id}
                className={`reveal relative mb-12 flex items-start gap-6 sm:gap-0 ${
                  isLeft ? 'sm:flex-row-reverse' : ''
                }`}
              >
                <div className="absolute left-4 -translate-x-1/2 z-10 sm:left-1/2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconColor}`}
                  >
                    <Icon size={17} />
                  </div>
                </div>

                <div className="hidden sm:block sm:w-1/2" />

                <div className={`pl-12 sm:pl-0 sm:w-1/2 ${isLeft ? 'sm:pr-12' : 'sm:pl-12'}`}>
                  <div className="card card-hover border-parchment-300 bg-white p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      {entry.year && (
                        <span className="rounded-md bg-gold-100 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-gold-900">
                          {entry.year}
                        </span>
                      )}
                      <span className="rounded-md bg-navy-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-navy-800">
                        {entry.category}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-xl font-bold text-navy-950 leading-snug">{entry.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-gold-800">{entry.organization}</p>
                    {entry.description && (
                      <p className="mt-3 text-sm leading-relaxed text-navy-800 font-sans">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
