import { GraduationCap, Briefcase, Award, Landmark, Scale, Compass } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { timelineEntries, type TimelineEntry } from '@/data/timeline';

const categoryConfig: Record<TimelineEntry['category'], { icon: typeof GraduationCap; color: string }> = {
  Education: { icon: GraduationCap, color: 'bg-navy-900 text-gold-400' },
  Professional: { icon: Briefcase, color: 'bg-gold-600 text-white' },
  PYPP: { icon: Award, color: 'bg-navy-700 text-gold-400' },
  'Public Service': { icon: Landmark, color: 'bg-navy-800 text-gold-400' },
  'Legal Studies': { icon: Scale, color: 'bg-gold-700 text-white' },
  Future: { icon: Compass, color: 'bg-cream-300 text-navy-800' },
};

export default function Timeline() {
  return (
    <section id="journey" className="bg-navy-900 section-padding py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Journey"
            title="A timeline of growth and purpose"
            description="From business education through professional development, public service, and legal studies — each step builds on the last."
            align="center"
          />
        </div>

        <div className="relative mt-16">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-navy-700 sm:left-1/2 sm:-translate-x-px" />

          {timelineEntries.map((entry, index) => {
            const config = categoryConfig[entry.category];
            const Icon = config.icon;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={`${entry.title}-${index}`}
                className={`reveal relative mb-12 flex items-start gap-6 sm:gap-0 ${
                  isLeft ? 'sm:flex-row-reverse' : ''
                }`}
              >
                <div className="absolute left-4 -translate-x-1/2 z-10 sm:left-1/2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-navy-900 ${config.color}`}
                  >
                    <Icon size={16} />
                  </div>
                </div>

                <div className="hidden sm:block sm:w-1/2" />

                <div className={`pl-12 sm:pl-0 sm:w-1/2 ${isLeft ? 'sm:pr-12' : 'sm:pl-12'}`}>
                  <div className="card border-navy-700 bg-navy-800 p-5 card-hover">
                    {entry.year && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                        {entry.year}
                      </span>
                    )}
                    <span className="ml-2 text-xs font-medium text-navy-300">
                      {entry.category}
                    </span>
                    <h3 className="mt-2 font-serif text-lg font-bold text-white">{entry.title}</h3>
                    <p className="mt-1 text-sm font-medium text-gold-300">{entry.organization}</p>
                    <p className="mt-3 text-sm leading-relaxed text-navy-200">{entry.description}</p>
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
