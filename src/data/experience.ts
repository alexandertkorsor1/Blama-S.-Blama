export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  current: boolean;
  responsibilities: string[];
  skillsDeveloped: string[];
  achievements: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: 'exp-pypp-mod',
    organization: 'Ministry of National Defense, Republic of Liberia',
    role: 'PYPP Professional Fellow & Administrative Placement',
    period: '2023 – Present (PYPP Class XI)',
    current: true,
    responsibilities: [
      'Serving through the prestigious President\'s Young Professionals Program (PYPP Class XI) in national public administration.',
      'Providing administrative coordination, official memoranda drafting, and inter-agency documentation for ministry operations.',
      'Participating in institutional logistics oversight, supply verification, and decentralized judicial delegation missions across counties.',
      'Engaging with senior civil service leadership on defense governance, policy compliance, and ethical administration.',
    ],
    skillsDeveloped: ['Public Sector Governance', 'Civil-Military Liaison', 'Administrative Documentation', 'Policy Implementation', 'Ethics & Integrity'],
    achievements: [
      'Selected into PYPP Class XI through highly competitive, merit-based national recruitment.',
      'Contributed to operational documentation and administrative tracking for ministry-level programs.',
      'Represented institutional delegation during official visits to circuit courts and county administrative facilities.',
    ],
  },
  {
    id: 'exp-fassah',
    organization: 'Fassah Business Center',
    role: 'Operations Manager',
    period: '2021 – 2023',
    current: false,
    responsibilities: [
      'Directed daily commercial operations, inventory control, and enterprise administrative management.',
      'Supervised frontline service delivery, client relations, and financial accounting reconciliations.',
      'Implemented structured record-keeping systems that improved workflow turnaround and reduced administrative bottlenecks.',
    ],
    skillsDeveloped: ['Operations Management', 'Financial Record-Keeping', 'Workflow Optimization', 'Commercial Communications', 'Staff Supervision'],
    achievements: [
      'Successfully restructured inventory logging, cutting reconciliation discrepancies significantly.',
      'Maintained consistent operational profitability and client satisfaction throughout tenure.',
    ],
  },
  {
    id: 'exp-block3',
    organization: 'Block 3-Self Help Community Initiative',
    role: 'Administrative Assistant & Civic Coordinator',
    period: '2019 – 2021',
    current: false,
    responsibilities: [
      'Provided administrative coordination for community-driven development initiatives and stakeholder meetings.',
      'Maintained organizational correspondence, meeting records, and local community outreach schedules.',
      'Liaised with community leaders to prioritize civic improvement projects and mobilize local volunteer participation.',
    ],
    skillsDeveloped: ['Civic Engagement', 'Grassroots Administration', 'Community Liaison', 'Problem Solving', 'Meeting Documentation'],
    achievements: [
      'Facilitated the execution of multiple neighborhood development and youth outreach programs.',
      'Instituted an organized archive for community resolutions and official correspondence.',
    ],
  },
];
