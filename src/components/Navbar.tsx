import { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { useActiveSection } from '@/hooks/useActiveSection';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'pypp', label: 'PYPP' },
  { id: 'insights', label: 'Insights' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

const sectionIds = navLinks.map((l) => l.id);

export default function Navbar() {
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
          ? 'bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-navy-100'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <button
          onClick={() => handleNavClick('home')}
          className="font-serif text-lg font-bold text-navy-900 transition-colors hover:text-gold-600"
        >
          Blama S. Blama
        </button>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`nav-link ${active === link.id ? 'is-active' : ''}`}
            >
              {link.label}
            </button>
          ))}
          <a
            href="#resume"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('resume');
            }}
            className="btn-primary !py-2 !px-4 text-xs"
          >
            <Download size={14} />
            Download CV
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-navy-900"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="lg:hidden bg-cream-50 border-t border-navy-100 shadow-lg">
          <div className="flex flex-col px-5 py-4 sm:px-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-3 text-left text-base font-medium border-b border-navy-50 transition-colors hover:text-gold-600 ${
                  active === link.id ? 'text-gold-600' : 'text-navy-700'
                }`}
              >
                {link.label}
              </button>
            ))}
            <a
              href="#resume"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('resume');
              }}
              className="btn-primary mt-4 justify-center"
            >
              <Download size={16} />
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
