import { useState } from 'react';
import { GraduationCap, BookOpen, CheckCircle, Clock, ShieldCheck, Award, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePublicContent } from '@/context/PublicContentContext';
import { useSectionContent } from '@/hooks/useSectionContent';
import { getCertificateForEducation, type CertificateItem } from '@/data/certificates';
import CertificateViewerModal from './CertificateViewerModal';

interface EducationCardProps {
  onOpenTextView?: () => void;
}

export default function EducationCard({ onOpenTextView }: EducationCardProps) {
  const { education } = usePublicContent();
  const { sections } = useSectionContent();
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <section id="education" className="section-padding py-20 lg:py-28 bg-parchment-50">
      <div className="site-container">
        <div className="reveal">
          <SectionHeading
            eyebrow={sections.education.eyebrow}
            title={sections.education.title}
            description={sections.education.description}
            actionLabel="View in Text Dossier ↗"
            onAction={onOpenTextView}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {education.map((edu, index) => {
            const cert = getCertificateForEducation(edu.degree, edu.institution);
            return (
              <div
                key={edu.id}
                className="reveal card card-hover overflow-hidden border border-parchment-200 bg-white flex flex-col justify-between"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div>
                  <div className="h-2 bg-gradient-to-r from-navy-900 via-gold-600 to-navy-900" />
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                        <GraduationCap size={24} />
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold ${
                          edu.status === 'Completed'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-gold-50 text-gold-900 border border-gold-300'
                        }`}
                      >
                        {edu.status === 'Completed' ? (
                          <CheckCircle size={12} className="text-green-600" />
                        ) : (
                          <Clock size={12} className="text-gold-700" />
                        )}
                        {edu.status}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-2xl font-bold text-navy-950">
                      {edu.institution}
                    </h3>
                    <p className="mt-1 text-base font-semibold text-gold-800">{edu.degree}</p>
                    <p className="text-xs font-mono uppercase tracking-wider text-navy-500 mt-0.5">{edu.field}</p>

                    {edu.year && (
                      <p className="mt-3 text-xs font-mono text-navy-600">
                        <span className="font-semibold text-navy-900">Conferred / Expected:</span> {edu.year}
                      </p>
                    )}

                    <div className="mt-4 flex items-start gap-2.5 border-t border-parchment-100 pt-4">
                      <BookOpen size={16} className="mt-0.5 shrink-0 text-gold-600" />
                      {edu.description && (
                        <p className="text-sm leading-relaxed text-navy-700 font-sans">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attached Authenticated Certificate Banner */}
                {cert && (
                  <div className="border-t border-parchment-200 bg-parchment-100/70 p-4 sm:px-8 sm:py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck size={16} className="text-gold-700 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-navy-950 truncate">
                          Verified Credential Attached
                        </p>
                        <p className="text-[10px] font-mono text-gold-900 truncate">
                          {cert.format.toUpperCase()} • Ref: {cert.credentialId}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="inline-flex items-center gap-1 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-bold text-gold-300 hover:bg-gold-600 hover:text-navy-950 transition-colors shrink-0 shadow-xs"
                    >
                      <Award size={13} />
                      <span>View Certificate</span>
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
