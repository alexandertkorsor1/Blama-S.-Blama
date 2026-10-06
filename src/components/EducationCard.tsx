import { GraduationCap, BookOpen, CheckCircle, Clock } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { education } from '@/data/education';

export default function EducationCard() {
  return (
    <section id="education" className="section-padding py-20 lg:py-28 bg-cream-200">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Education"
            title="Academic foundations"
            description="A progression from business management to legal studies — building complementary expertise for leadership and public service."
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {education.map((edu, index) => (
            <div
              key={edu.institution}
              className="reveal card card-hover overflow-hidden"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="h-2 bg-gradient-to-r from-navy-900 to-gold-600" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
                    <GraduationCap size={24} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      edu.status === 'Completed'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {edu.status === 'Completed' ? (
                      <CheckCircle size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    {edu.status}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-xl font-bold text-navy-900">
                  {edu.institution}
                </h3>
                <p className="mt-1 text-base font-semibold text-gold-700">{edu.degree}</p>
                <p className="text-sm font-medium text-navy-500">{edu.field}</p>

                {edu.year && (
                  <p className="mt-3 text-sm text-navy-600">
                    <span className="font-semibold">Graduated:</span> {edu.year}
                  </p>
                )}

                <div className="mt-4 flex items-start gap-2">
                  <BookOpen size={16} className="mt-0.5 shrink-0 text-navy-400" />
                  <p className="text-sm leading-relaxed text-navy-600">{edu.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
