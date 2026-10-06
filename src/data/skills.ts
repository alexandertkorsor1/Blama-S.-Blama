export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Business & Management',
    icon: 'Briefcase',
    skills: ['Operations', 'Administration', 'Organizational Management', 'Business Communication'],
  },
  {
    category: 'Professional',
    icon: 'Users',
    skills: ['Research', 'Documentation', 'Communication', 'Problem Solving', 'Collaboration'],
  },
  {
    category: 'Legal & Policy Interests',
    icon: 'Scale',
    skills: ['Legal Research', 'Rule of Law', 'Equal Justice', 'Public Administration'],
  },
];
