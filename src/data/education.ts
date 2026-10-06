export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  year: string | null;
  status: 'Completed' | 'In Progress';
  description: string;
}

export const education: EducationItem[] = [
  {
    institution: 'United Methodist University',
    degree: 'Bachelor of Business Administration',
    field: 'Management',
    year: '2021',
    status: 'Completed',
    description:
      'Undergraduate studies focused on organizational management, business strategy, and administrative leadership — establishing the professional foundation for a career bridging enterprise and public service.',
  },
  {
    institution: 'Louis Arthur Grimes School of Law',
    degree: 'Legal Studies',
    field: 'Law',
    year: null,
    status: 'In Progress',
    description:
      'Legal education at the Louis Arthur Grimes School of Law, the University of Liberia\'s faculty of law. Professional interests include legal research, equal justice, and the rule of law.',
  },
];
