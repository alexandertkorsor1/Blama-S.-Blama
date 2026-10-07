export interface Achievement {
  id: string;
  category: 'Fellowship' | 'Academic' | 'Professional' | 'Leadership' | 'Recognition';
  title: string;
  organization: string;
  year: string;
  description: string;
  verified: boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'ach-pypp',
    category: 'Fellowship',
    title: "President's Young Professionals Program (PYPP) Fellow — Class XI",
    organization: "President's Young Professionals Program",
    year: '2023',
    description:
      'Inducted into Class XI of Liberia\'s premier public-service leadership fellowship following a nationwide competitive merit-based selection process.',
    verified: true,
  },
  {
    id: 'ach-bba',
    category: 'Academic',
    title: 'Bachelor of Business Administration (BBA) in Management',
    organization: 'United Methodist University (UMU)',
    year: '2021',
    description:
      'Awarded undergraduate degree with concentration in strategic business administration, operations planning, and managerial economics.',
    verified: true,
  },
  {
    id: 'ach-defense',
    category: 'Professional',
    title: 'National Defense Public Administration Placement',
    organization: 'Ministry of National Defense, Republic of Liberia',
    year: '2023 – Present',
    description:
      'Entrusted with key administrative responsibilities and civilian governance tasks at the national defense headquarters.',
    verified: true,
  },
  {
    id: 'ach-law',
    category: 'Leadership',
    title: 'Legal Jurisprudence Scholar',
    organization: 'Louis Arthur Grimes School of Law (University of Liberia)',
    year: 'Current',
    description:
      'Active legal scholarship candidate focusing on constitutional doctrine, commercial transactions, statutory research, and equal justice.',
    verified: true,
  },
  {
    id: 'ach-judiciary',
    category: 'Recognition',
    title: 'Circuit Court & Judicial Institutions Delegation',
    organization: 'The Judiciary — 3rd Judicial Circuit Court, Sinoe County',
    year: '2024',
    description:
      'Selected for institutional field engagements and judicial observation in Greenville City, reinforcing understanding of decentralized rule of law.',
    verified: true,
  },
];
