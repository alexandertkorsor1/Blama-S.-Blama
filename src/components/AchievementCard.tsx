import { useState } from 'react';
import { Award, Trophy, Medal, BadgeCheck, Star, ShieldCheck, Eye } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePublicContent } from '@/context/PublicContentContext';
import { useSectionContent } from '@/hooks/useSectionContent';
import { getCertificateForAchievement, type CertificateItem } from '@/data/certificates';
import CertificateViewerModal from './CertificateViewerModal';

const categoryIcon: Record<string, typeof Award> = {
  Academic: Trophy,
  Professional: Award,
  Fellowship: BadgeCheck,
  Leadership: Star,
  Certifications: Medal,
  Recognition: Star,
};

export default function AchievementCard() {
  const { achievements } = usePublicContent();
  const { sections } = useSectionContent();
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <section id="achievements" className="section-padding py-20 lg:py-28 bg-parchment-100/40">
      <div className="site-container">
        <div className="reveal">
          <SectionHeading
            eyebrow={sections.achievements.eyebrow}
            title={sections.achievements.title}
            description={sections.achievements.description}
            align="center"
          />
        </div>

        <div className="mt-14 space-y-4">
          {achievements.map((achievement, index) => {
            const Icon = categoryIcon[achievement.category] || Award;
            const cert = getCertificateForAchievement(achievement.title, achievement.organization);

            return (
              <div
                key={achievement.id}
                className="reveal flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-parchment-300 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gold-400"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-700 border border-gold-200">
                    <Icon size={24} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-navy-100 px-3 py-0.5 text-xs font-mono font-semibold text-navy-800">
                        {achievement.category}
                      </span>
                      {achievement.year && (
                        <span className="text-xs font-mono font-medium text-navy-500">
                          {achievement.year}
                        </span>
                      )}
                      {(achievement.verified || cert) && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-700">
                          <BadgeCheck size={14} />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 font-serif text-xl font-bold text-navy-950">
                      {achievement.title}
                    </h3>
                    <p className="text-sm font-semibold text-gold-800">{achievement.organization}</p>
                    {achievement.description && (
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-navy-700 font-sans">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Attached Credential Action Button */}
                {cert && (
                  <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-parchment-200">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gold-400 bg-gold-50/80 px-3.5 py-2 text-xs font-bold text-gold-950 hover:bg-gold-500 hover:text-navy-950 transition-colors shadow-xs"
                    >
                      <ShieldCheck size={14} className="text-gold-700" />
                      <span>View Credential ({cert.format.toUpperCase()})</span>
                    </button>
                  </div>
                )}
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
