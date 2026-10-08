import { Linkedin, Mail, ArrowUp, FileText } from 'lucide-react';
import { usePublicContent } from '@/context/PublicContentContext';

interface FooterProps {
  onOpenTextView?: () => void;
}

const footerLinks = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'pypp', label: 'PYPP Fellowship' },
  { id: 'insights', label: 'Insights & Papers' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer({ onOpenTextView }: FooterProps) {
  const { profile } = usePublicContent();
  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy-950 text-slate-100 border-t border-navy-800">
      <div className="site-container px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-600 text-white font-serif font-bold text-xs shadow-md">
                BSB
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">{profile?.full_name ?? 'Blama S. Blama'}</h3>
            </div>
            <p className="mt-3 text-sm text-gold-300 max-w-xs font-serif italic">
              {profile?.tagline ?? 'Bridging Enterprise Acumen, Public Service Stewardship & Equal Justice'}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-700 bg-navy-900/80 text-slate-200 transition-all hover:border-gold-400 hover:text-gold-300"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-700 bg-navy-900/80 text-slate-200 transition-all hover:border-gold-400 hover:text-gold-300"
                  aria-label="Email contact"
                >
                  <Mail size={16} />
                </a>
              )}
              {onOpenTextView && (
                <button
                  onClick={onOpenTextView}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gold-400/50 bg-gold-500/15 px-3 py-1.5 text-xs font-mono font-bold text-gold-300 transition-all hover:bg-gold-500 hover:text-white"
                >
                  <FileText size={13} />
                  <span>Text Dossier</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gold-300">
              Executive Sections
            </h4>
            <nav className="mt-4 grid grid-cols-2 gap-2.5">
              {footerLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="text-left text-sm font-medium text-slate-200 transition-colors hover:text-gold-300"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gold-300">
              Professional Credentials
            </h4>
            <p className="mt-4 text-xs font-mono text-slate-200 leading-relaxed font-semibold">{profile?.title ?? ''}</p>
            <p className="mt-2 text-xs font-mono text-gold-300">{profile?.location ?? 'Monrovia, Republic of Liberia'}</p>
            <button
              onClick={() => handleNavClick('home')}
              className="mt-5 inline-flex items-center gap-2 text-xs font-mono font-bold text-gold-300 transition-colors hover:text-gold-200 hover:underline"
            >
              <ArrowUp size={13} />
              Return to Top
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 sm:flex-row text-xs font-mono text-slate-300">
          <p>
            &copy; {new Date().getFullYear()} {profile?.full_name ?? 'Blama S. Blama'}. Official Portfolio & Legal Studies Dossier.
          </p>
          <p className="text-gold-300 font-semibold">
            Republic of Liberia • PYPP Class XI • Louis Arthur Grimes School of Law
          </p>
        </div>
      </div>
    </footer>
  );
}
