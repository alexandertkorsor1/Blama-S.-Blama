export interface TimelineEntry {
  id: string;
  year: string;
  category: 'Education' | 'Professional' | 'PYPP' | 'Public Service' | 'Legal Studies' | 'Future';
  title: string;
  organization: string;
  description: string;
  location?: string;
}

export const timelineEntries: TimelineEntry[] = [
  {
    id: 'tl-1',
    year: '2018 – 2021',
    category: 'Education',
    title: 'Bachelor of Business Administration (BBA) in Management',
    organization: 'United Methodist University (UMU)',
    description:
      'Completed comprehensive undergraduate management degree with deep focus on organizational stewardship, administrative frameworks, and enterprise economics.',
    location: 'Monrovia, Liberia',
  },
  {
    id: 'tl-2',
    year: '2019 – 2021',
    category: 'Professional',
    title: 'Administrative Assistant & Civic Coordinator',
    organization: 'Block 3-Self Help Community Initiative',
    description:
      'Coordinated local community action projects, maintained official administrative logs, and managed civic stakeholder deliberations.',
    location: 'Montserrado County, Liberia',
  },
  {
    id: 'tl-3',
    year: '2021 – 2023',
    category: 'Professional',
    title: 'Operations Manager',
    organization: 'Fassah Business Center',
    description:
      'Managed commercial operations, streamlined inventory logs, supervised staff workflows, and drove client satisfaction and operational efficiency.',
    location: 'Monrovia, Liberia',
  },
  {
    id: 'tl-4',
    year: '2023 – Present',
    category: 'PYPP',
    title: "President's Young Professionals Program (PYPP) Fellow",
    organization: 'President\'s Young Professionals Program (Class XI)',
    description:
      'Selected into Liberia\'s foremost merit-based public leadership fellowship, completing intensive civil-service ethics, policy, and executive governance modules.',
    location: 'Republic of Liberia',
  },
  {
    id: 'tl-5',
    year: '2023 – Present',
    category: 'Public Service',
    title: 'National Defense Administrative Placement',
    organization: 'Ministry of National Defense, Republic of Liberia',
    description:
      'Deployed under PYPP fellowship to support civilian defense administration, official documentation, logistics coordination, and inter-agency state missions.',
    location: 'Barclay Training Center / Monrovia, Liberia',
  },
  {
    id: 'tl-6',
    year: '2024 – Present',
    category: 'Legal Studies',
    title: 'Legal Scholar & LL.B Candidate',
    organization: 'Louis Arthur Grimes School of Law (University of Liberia)',
    description:
      'Pursuing formal legal education at Liberia\'s premier faculty of law, concentrating on statutory research, commercial arbitration, constitutional doctrine, and equal justice.',
    location: 'University of Liberia Capitol Hill Campus',
  },
  {
    id: 'tl-7',
    year: 'Strategic Horizon',
    category: 'Future',
    title: 'Executive Leadership & National Governance Impact',
    organization: 'Republic of Liberia',
    description:
      'Synthesizing enterprise management, public administration, and statutory legal mastery to serve Liberia at the highest levels of governance, commerce, and judicial reform.',
    location: 'Liberia & International Platforms',
  },
];
