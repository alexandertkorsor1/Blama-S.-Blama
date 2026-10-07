export interface SkillGroup {
  id: string;
  category: string;
  icon: string;
  description: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'grp-business',
    category: 'Business Management & Operations',
    icon: 'Briefcase',
    description: 'Enterprise workflows, strategic operational planning, and administrative systems optimization.',
    skills: [
      'Operations Management',
      'Strategic Planning & Execution',
      'Financial Record-Keeping & Budgeting',
      'Process & Workflow Optimization',
      'Team Leadership & Supervision',
      'Executive Commercial Communications',
    ],
  },
  {
    id: 'grp-public',
    category: 'Public Administration & Governance',
    icon: 'Users',
    description: 'National ministerial coordination, civil service leadership, and inter-agency state liaison.',
    skills: [
      'Civil-Military Administrative Liaison',
      'Inter-Agency Government Relations',
      'Policy Documentation & Briefings',
      'Public Procurement Compliance',
      'Civil Service Ethics & Accountability',
      'Logistics Verification & Inventory Control',
    ],
  },
  {
    id: 'grp-legal',
    category: 'Legal Jurisprudence & Research',
    icon: 'Scale',
    description: 'Statutory interpretation, legal research, constitutional doctrine, and equal justice advocacy.',
    skills: [
      'Statutory & Constitutional Analysis',
      'Legal Research & Case Briefing',
      'Equal Justice & Rule of Law Advocacy',
      'Commercial Law & Contract Principles',
      'Judicial & Circuit Court Field Observation',
      'Legal Memoranda Drafting',
    ],
  },
];
