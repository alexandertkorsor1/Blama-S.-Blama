import { Briefcase, Users, Scale, Check } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { skillGroups } from '@/data/skills';

const iconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Users,
  Scale,
};

export default function SkillGroup() {
  return (
    <section id="skills" className="section-padding py-20 lg:py-28 bg-cream-200">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Skills"
            title="Professional capabilities and interests"
            description="Categorized strengths developed through business management, professional experience, public service, and legal studies."
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {skillGroups.map((group, index) => {
            const Icon = iconMap[group.icon] || Briefcase;
            return (
              <div
                key={group.category}
                className="reveal card card-hover p-6 sm:p-7"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-navy-900">{group.category}</h3>
                </div>

                <ul className="mt-5 space-y-3">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                        <Check size={12} />
                      </span>
                      <span className="text-sm font-medium text-navy-700">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
