export interface ExperienceItem {
  organization: string;
  role: string;
  period: string;
  current: boolean;
  responsibilities: string[];
  skillsDeveloped: string[];
  achievements: string[] | null;
}

export const experiences: ExperienceItem[] = [
  {
    organization: 'Fassah Business Center',
    role: 'Operations Manager',
    period: '',
    current: false,
    responsibilities: [
      'Managing daily business operations and organizational coordination',
      'Overseeing operational workflows and process optimization',
    ],
    skillsDeveloped: ['Operations', 'Organizational Management', 'Business Communication'],
    achievements: null,
  },
  {
    organization: 'Block 3-Self Help Community Initiative',
    role: 'Administrative Assistant',
    period: '',
    current: false,
    responsibilities: [
      'Providing administrative support to a community-driven development initiative',
      'Coordinating organizational and community-focused activities',
    ],
    skillsDeveloped: ['Administration', 'Collaboration', 'Problem Solving'],
    achievements: null,
  },
  {
    organization: 'Ministry of National Defense, Republic of Liberia',
    role: 'PYPP Professional Placement',
    period: 'PYPP Class XI',
    current: false,
    responsibilities: [
      'Professional placement through the President\'s Young Professionals Program',
      'Gaining direct exposure to public-sector governance and institutional operations at a national ministry',
    ],
    skillsDeveloped: ['Public Administration', 'Professional Development', 'Documentation'],
    achievements: null,
  },
];
