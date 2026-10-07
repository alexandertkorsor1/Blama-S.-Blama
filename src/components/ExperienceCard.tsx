import { Building2, CheckSquare, Award } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePublicContent } from '@/context/PublicContentContext';
import { useSectionContent } from '@/hooks/useSectionContent';

interface ExperienceCardProps {
  onOpenTextView?: () => void;
}

export default function ExperienceCard({ onOpenTextView }: ExperienceCardProps) {
  const { experiences } = usePublicContent();
  const { sections } = useSectionContent();

  return (
    <section id="experience" className="section-padding py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow={sections.experience.eyebrow}
            title={sections.experience.title}
            description={sections.experience.description}
            actionLabel="View in Text Dossier ↗"
            onAction={onOpenTextView}
          />
        </div>

        <div className="mt-12 space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="reveal card card-hover p-6 sm:p-8 border border-parchment-200"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-parchment-200 pb-4 lg:pb-0 lg:pr-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                      <Building2 size={20} />
                    </div>
                    {exp.current && (
                      <span className="rounded-full bg-gold-50 border border-gold-400/50 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-gold-900">
                        Current Service
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-navy-950">{exp.role}</h3>
                  <p className="mt-1 text-sm font-semibold text-gold-800">{exp.organization}</p>
                  {exp.period && (
                    <p className="mt-2 text-xs font-mono text-navy-500">{exp.period}</p>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-5">
                  <div>
                    <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-500">
                      Core Responsibilities & Stewardship
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {exp.responsibilities.map((resp) => (
                        <li key={resp.id} className="flex items-start gap-2.5 text-sm text-navy-800">
                          <CheckSquare size={15} className="mt-0.5 shrink-0 text-gold-600" />
                          <span>{resp.responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {exp.skills.length > 0 && (
                    <div>
                      <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-500">
                        Applied Competencies
                      </h4>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-md border border-parchment-300 bg-parchment-50 px-2.5 py-1 text-xs font-medium text-navy-800 font-sans"
                          >
                            {skill.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {exp.achievements.length > 0 && (
                    <div className="rounded-lg bg-parchment-50/80 p-4 border border-parchment-200">
                      <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-800 flex items-center gap-1.5">
                        <Award size={13} className="text-gold-700" />
                        Verified Milestone Contributions
                      </h4>
                      <ul className="mt-2 space-y-1.5">
                        {exp.achievements.map((ach) => (
                          <li key={ach.id} className="text-xs sm:text-sm text-navy-800 flex items-start gap-2">
                            <span className="text-gold-600">•</span>
                            <span>{ach.achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
