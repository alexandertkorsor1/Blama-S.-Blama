import { Building2, CheckSquare } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { experiences } from '@/data/experience';

export default function ExperienceCard() {
  return (
    <section id="experience" className="section-padding py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Experience"
            title="Professional roles and placements"
            description="Practical experience across business operations, community development, and national public service."
          />
        </div>

        <div className="mt-12 space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.organization}
              className="reveal card card-hover p-6 sm:p-8"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                      <Building2 size={20} />
                    </div>
                    {exp.current && (
                      <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold text-navy-900">{exp.role}</h3>
                  <p className="mt-1 text-sm font-semibold text-gold-700">{exp.organization}</p>
                  {exp.period && (
                    <p className="mt-1 text-sm text-navy-500">{exp.period}</p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Responsibilities
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-navy-700">
                        <CheckSquare size={15} className="mt-0.5 shrink-0 text-gold-600" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-6 text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Skills Developed
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.skillsDeveloped.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <>
                      <h4 className="mt-6 text-xs font-semibold uppercase tracking-wider text-navy-400">
                        Achievements
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="text-sm text-navy-700">
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {!exp.achievements && (
                    <p className="mt-6 text-xs italic text-navy-400">
                      Detailed achievements to be documented upon verification.
                    </p>
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
