export interface TimelineEntry {
  year: string;
  category: 'Education' | 'Professional' | 'PYPP' | 'Public Service' | 'Legal Studies' | 'Future';
  title: string;
  organization: string;
  description: string;
}

export const timelineEntries: TimelineEntry[] = [
  {
    year: '2018–2021',
    category: 'Education',
    title: 'Bachelor of Business Administration',
    organization: 'United Methodist University',
    description:
      'Pursued undergraduate studies in Management, building a foundation in organizational leadership, business strategy, and administrative practice.',
  },
  {
    year: '',
    category: 'Professional',
    title: 'Operations Manager',
    organization: 'Fassah Business Center',
    description:
      'Managed day-to-day operations and organizational coordination within a business environment, developing practical experience in management and administration.',
  },
  {
    year: '',
    category: 'Professional',
    title: 'Administrative Assistant',
    organization: 'Block 3-Self Help Community Initiative',
    description:
      'Supported community-driven development through administrative coordination and organizational assistance.',
  },
  {
    year: 'Class XI',
    category: 'PYPP',
    title: "President's Young Professionals Program",
    organization: 'PYPP — Class XI',
    description:
      'Selected for a prestigious professional development and public-service fellowship program designed to cultivate the next generation of Liberian public-sector leaders.',
  },
  {
    year: '',
    category: 'Public Service',
    title: 'Professional Placement',
    organization: 'Ministry of National Defense, Republic of Liberia',
    description:
      'Served through a PYPP professional placement at the Ministry of National Defense, gaining direct exposure to public-sector governance and national institutional operations.',
  },
  {
    year: '',
    category: 'Legal Studies',
    title: 'Legal Studies',
    organization: 'Louis Arthur Grimes School of Law',
    description:
      'Pursued legal education at Liberia\'s premier law school, with professional interests in legal research, equal justice, and the rule of law.',
  },
  {
    year: 'Next Chapter',
    category: 'Future',
    title: 'Continued Professional Development',
    organization: 'Forward',
    description:
      'Committed to continuous growth at the intersection of business management, public service, and legal research — advancing toward leadership roles that serve Liberia\'s development.',
  },
];
