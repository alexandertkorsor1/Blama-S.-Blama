export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
  status: 'Completed' | 'In Progress';
  description: string;
  honors?: string;
  location: string;
}

export const education: EducationItem[] = [
  {
    id: 'edu-law',
    institution: 'Louis Arthur Grimes School of Law — University of Liberia',
    degree: 'Bachelor of Laws (LL.B) Candidate',
    field: 'Jurisprudence, Legal Research & Equal Justice',
    year: 'Expected 2027',
    status: 'In Progress',
    location: 'Monrovia, Republic of Liberia',
    honors: 'Premier Faculty of Law in Liberia',
    description:
      'Rigorous legal education focusing on constitutional law, statutory interpretation, commercial arbitration, civil procedure, and judicial doctrine. Scholar focusing on expanding equal protection, procedural fairness, and institutional integrity across Liberian legal and commercial ecosystems.',
  },
  {
    id: 'edu-bba',
    institution: 'United Methodist University (UMU)',
    degree: 'Bachelor of Business Administration (BBA)',
    field: 'Management & Organizational Strategy',
    year: '2021',
    status: 'Completed',
    location: 'Monrovia, Republic of Liberia',
    honors: 'Graduated with Academic Commendation in Management',
    description:
      'Comprehensive undergraduate curriculum covering strategic planning, financial management, operations analysis, human resources, and organizational governance — creating a solid analytical foundation for bridging private enterprise with public administration.',
  },
];
