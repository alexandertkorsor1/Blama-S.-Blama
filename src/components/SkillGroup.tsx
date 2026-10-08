import { useState } from 'react';
import { Briefcase, Users, Scale, Check, Award, ShieldCheck, Trophy, Landmark } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePublicContent } from '@/context/PublicContentContext';
import { useSectionContent } from '@/hooks/useSectionContent';
import { getCertificateForSkill, type CertificateItem } from '@/data/certificates';
import CertificateViewerModal from './CertificateViewerModal';

const iconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Users,
  Scale,
  Award,
  Trophy,
  Landmark,
};

export default function SkillGroup() {
  const { skillCategories, skills } = usePublicContent();
  const { sections } = useSectionContent();
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <section id="skills" className="section-padding py-20 lg:py-28 bg-parchment-50 border-t border-parchment-200">
      <div className="site-container">
        <div className="reveal">
          <SectionHeading
            eyebrow={sections.skills.eyebrow}
            title={sections.skills.title}
            description={sections.skills.description}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {skillCategories.map((group, index) => {
            const Icon = iconMap[group.icon ?? ''] || Briefcase;
            const categorySkills = skills.filter((skill) => skill.category_id === group.id);

            return (
              <div
                key={group.id}
                className="reveal card card-hover p-6 sm:p-7 border border-parchment-200 bg-white flex flex-col justify-between"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div>
                  <div className="flex items-center gap-3 border-b border-parchment-100 pb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-navy-950">{group.category}</h3>
                      <p className="text-[11px] font-mono text-navy-500">{categorySkills.length} Core Competencies</p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {categorySkills.map((skill) => {
                      const cert = getCertificateForSkill(skill.name);
                      return (
                        <li key={skill.id} className="flex items-start justify-between gap-2 group/item">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700 mt-0.5">
                              <Check size={12} />
                            </span>
                            <span className="text-sm font-medium text-navy-800">{skill.name}</span>
                          </div>

                          {cert && (
                            <button
                              type="button"
                              onClick={() => setSelectedCert(cert)}
                              title={`View ${cert.title}`}
                              className="inline-flex items-center gap-1 rounded-md bg-gold-50 px-2 py-0.5 text-[10px] font-mono font-bold text-gold-900 border border-gold-300 hover:bg-gold-500 hover:text-navy-950 transition-colors shrink-0"
                            >
                              <Award size={11} className="text-gold-700" />
                              <span>Credential</span>
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Certificate Inspection Modal */}
      <CertificateViewerModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
    </section>
  );
}
