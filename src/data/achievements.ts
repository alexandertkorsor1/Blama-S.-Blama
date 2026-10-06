export interface Achievement {
  category: 'Academic' | 'Professional' | 'Fellowship' | 'Leadership' | 'Certifications' | 'Recognition';
  title: string;
  organization: string;
  year: string | null;
  description: string;
  verified: boolean;
}

export const achievements: Achievement[] = [
  {
    category: 'Fellowship',
    title: "President's Young Professionals Program — Class XI",
    organization: 'PYPP',
    year: null,
    description:
      'Selected for a competitive professional development and public-service fellowship program for emerging Liberian leaders.',
    verified: true,
  },
  {
    category: 'Academic',
    title: 'Bachelor of Business Administration in Management',
    organization: 'United Methodist University',
    year: '2021',
    description: 'Completed undergraduate studies in business management.',
    verified: true,
  },
  {
    category: 'Professional',
    title: 'Public-Service Placement',
    organization: 'Ministry of National Defense, Republic of Liberia',
    year: null,
    description: 'Professional fellowship placement at a national ministry through the PYPP program.',
    verified: true,
  },
];
