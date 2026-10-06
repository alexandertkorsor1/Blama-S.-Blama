import { Linkedin, Mail, ArrowUp } from 'lucide-react';
import { profile } from '@/data/profile';

const footerLinks = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'pypp', label: 'PYPP' },
  { id: 'insights', label: 'Insights' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer() {
  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="mx-auto max-w-8xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">{profile.fullName}</h3>
            <p className="mt-3 text-sm text-navy-300 max-w-xs">
              {profile.tagline}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-700 text-navy-300 transition-all hover:border-gold-500 hover:text-gold-400"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-700 text-navy-300 transition-all hover:border-gold-500 hover:text-gold-400"
                aria-label="Email contact"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Navigation
            </h4>
            <nav className="mt-4 grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="text-left text-sm text-navy-300 transition-colors hover:text-gold-400"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Professional
            </h4>
            <p className="mt-4 text-sm text-navy-300">{profile.title}</p>
            <p className="mt-2 text-sm text-navy-400">{profile.location}</p>
            <button
              onClick={() => handleNavClick('home')}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
            >
              <ArrowUp size={14} />
              Back to top
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 sm:flex-row">
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} {profile.fullName}. All rights reserved.
          </p>
          <p className="text-xs text-navy-500">
            Built with purpose. Driven by impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
