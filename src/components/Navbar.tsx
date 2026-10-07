import { useState, useEffect } from 'react';
import { Menu, X, Download, FileText, LayoutGrid } from 'lucide-react';
import { useActiveSection } from '@/hooks/useActiveSection';

interface NavbarProps {
  isTextView?: boolean;
  onToggleTextView?: () => void;
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'pypp', label: 'PYPP' },
  { id: 'insights', label: 'Insights & Papers' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'certificates', label: 'Certificates & Vault' },
  { id: 'gallery', label: 'Media' },
  { id: 'contact', label: 'Contact' },
];

const sectionIds = navLinks.map((l) => l.id);

export default function Navbar({ isTextView = false, onToggleTextView }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    if (isTextView && onToggleTextView) {
      onToggleTextView();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-parchment-300 py-2.5'
          : 'bg-white/95 backdrop-blur-md shadow-xs border-b border-parchment-200 py-3.5'
      }`}
    >
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-navy-900 text-gold-300 font-serif text-sm font-bold shadow-xs ring-1 ring-gold-500/30">
            BSB
          </div>
          <div>
            <span className="font-serif text-base font-bold text-navy-950 group-hover:text-gold-700 transition-colors block leading-none">
              Blama S. Blama
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gold-700 block mt-0.5 leading-none">
              Executive Dossier
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {!isTextView &&
            navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`nav-link text-xs font-bold uppercase tracking-wider ${
                  active === link.id ? 'is-active text-navy-950 font-extrabold' : 'text-navy-800'
                }`}
              >
                {link.label}
              </button>
            ))}

          {/* Mode Switcher Button */}
          {onToggleTextView && (
            <button
              onClick={onToggleTextView}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                isTextView
                  ? 'border-navy-900 bg-navy-900 text-white hover:bg-gold-600 hover:border-gold-600'
                  : 'border-gold-500/80 bg-gold-50 text-gold-900 hover:bg-gold-600 hover:text-white hover:border-gold-600 shadow-xs'
              }`}
            >
              {isTextView ? <LayoutGrid size={13} /> : <FileText size={13} />}
              <span>{isTextView ? 'Visual Showcase' : 'Executive Text View'}</span>
            </button>
          )}

          <a
            href="#resume"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('resume');
            }}
            className="btn-primary !py-2 !px-4 text-xs font-bold"
          >
            <Download size={13} />
            Download CV
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {onToggleTextView && (
            <button
              onClick={onToggleTextView}
              className="inline-flex items-center gap-1 rounded-md border border-gold-500/60 bg-gold-50 px-2.5 py-1 text-[11px] font-semibold text-gold-900"
            >
              {isTextView ? <LayoutGrid size={12} /> : <FileText size={12} />}
              <span>{isTextView ? 'Visual' : 'Text View'}</span>
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-navy-900 focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-cream-50/98 border-t border-navy-100 shadow-xl backdrop-blur-md">
          <div className="flex flex-col px-5 py-4 sm:px-8 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-2.5 text-left text-sm font-semibold border-b border-navy-50 transition-colors hover:text-gold-700 ${
                  active === link.id ? 'text-gold-700 font-bold' : 'text-navy-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <a
                href="#resume"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('resume');
                }}
                className="btn-primary justify-center text-xs"
              >
                <Download size={14} />
                Download CV
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
