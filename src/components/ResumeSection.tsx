import { Download, FileText, Printer } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { profile } from '@/data/profile';
import { education } from '@/data/education';
import { experiences } from '@/data/experience';
import { skillGroups } from '@/data/skills';

function buildResumeText(): string {
  const lines: string[] = [];
  lines.push(profile.fullName);
  lines.push(`Also known as ${profile.professionalName}`);
  lines.push(profile.title);
  lines.push(`${profile.location} | ${profile.email}`);
  lines.push(profile.linkedin);
  lines.push('');
  lines.push('PROFESSIONAL STATEMENT');
  lines.push(profile.statement);
  lines.push('');
  lines.push('EDUCATION');
  education.forEach((e) => {
    lines.push(`  ${e.institution}`);
    lines.push(`  ${e.degree} — ${e.field}`);
    if (e.year) lines.push(`  Graduated: ${e.year}`);
    lines.push(`  Status: ${e.status}`);
    lines.push('');
  });
  lines.push('PROFESSIONAL EXPERIENCE');
  experiences.forEach((exp) => {
    lines.push(`  ${exp.role} — ${exp.organization}`);
    if (exp.period) lines.push(`  ${exp.period}`);
    lines.push('  Responsibilities:');
    exp.responsibilities.forEach((r) => lines.push(`    - ${r}`));
    lines.push('  Skills Developed:');
    lines.push(`    ${exp.skillsDeveloped.join(', ')}`);
    lines.push('');
  });
  lines.push('SKILLS');
  skillGroups.forEach((g) => {
    lines.push(`  ${g.category}: ${g.skills.join(', ')}`);
  });
  lines.push('');
  lines.push('PROFESSIONAL INTERESTS');
  lines.push('  Equal justice, Rule of law, Legal research, Public service,');
  lines.push('  Professional development, Leadership');
  lines.push('');
  return lines.join('\n');
}

export default function ResumeSection() {
  const handleDownload = () => {
    const text = buildResumeText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Blama_S_Blama_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="resume" className="section-padding py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Résumé"
            title="Curriculum Vitae"
            description="A professional summary of education, experience, skills, and interests. Download for offline reference."
          />
        </div>

        <div className="reveal mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="card overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-navy-900 to-gold-600" />
              <div className="p-6 sm:p-8">
                <div className="border-b border-navy-100 pb-6">
                  <h3 className="font-serif text-2xl font-bold text-navy-900">{profile.fullName}</h3>
                  <p className="mt-1 text-sm font-medium text-gold-700">
                    Also known as {profile.professionalName}
                  </p>
                  <p className="mt-2 text-sm text-navy-600">{profile.title}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500">
                    <span>{profile.location}</span>
                    <span>{profile.email}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Education
                  </h4>
                  <div className="mt-3 space-y-3">
                    {education.map((edu) => (
                      <div key={edu.institution} className="text-sm">
                        <p className="font-semibold text-navy-900">{edu.institution}</p>
                        <p className="text-navy-600">
                          {edu.degree} — {edu.field}
                          {edu.year && ` (${edu.year})`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Experience
                  </h4>
                  <div className="mt-3 space-y-3">
                    {experiences.map((exp) => (
                      <div key={exp.organization} className="text-sm">
                        <p className="font-semibold text-navy-900">
                          {exp.role} — {exp.organization}
                        </p>
                        {exp.period && <p className="text-navy-500 text-xs">{exp.period}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Skills
                  </h4>
                  <div className="mt-3 space-y-2">
                    {skillGroups.map((g) => (
                      <p key={g.category} className="text-sm text-navy-600">
                        <span className="font-semibold text-navy-900">{g.category}:</span>{' '}
                        {g.skills.join(', ')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
                <FileText size={28} />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-navy-900">Download Résumé</h3>
              <p className="mt-2 text-sm text-navy-600">
                Get a formatted copy of the full CV for professional reference.
              </p>
              <button onClick={handleDownload} className="btn-primary mt-5 w-full justify-center">
                <Download size={16} />
                Download CV
              </button>
            </div>

            <div className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                <Printer size={28} />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-navy-900">Print Résumé</h3>
              <p className="mt-2 text-sm text-navy-600">
                Print a clean copy directly from your browser.
              </p>
              <button onClick={handlePrint} className="btn-secondary mt-5 w-full justify-center">
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
