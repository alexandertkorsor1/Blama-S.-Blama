import { Landmark, Award, Heart, TrendingUp, Users, Scale } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useSectionContent } from '@/hooks/useSectionContent';

const iconLookup: Record<string, typeof Award> = {
  Award,
  Landmark,
  Heart,
  TrendingUp,
  Users,
  Scale,
};

export default function LeadershipSection() {
  const { sections } = useSectionContent();
  const lead = sections.leadership;

  return (
    <section id="leadership" className="section-padding py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow={lead.eyebrow}
            title={lead.title}
            description={lead.description}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {lead.areas.map((area, index) => {
            const Icon = iconLookup[area.iconName || ''] || [Award, Landmark, Heart, TrendingUp][index % 4];
            return (
              <div
                key={area.title}
                className="reveal group flex items-start gap-5 rounded-xl border border-navy-100 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/5"
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-800 transition-colors duration-300 group-hover:bg-gold-600 group-hover:text-white">
                  <Icon size={26} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-navy-900">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{area.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
