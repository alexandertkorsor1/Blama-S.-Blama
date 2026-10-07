export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  category: 'Academic' | 'Fellowship' | 'Public Service' | 'Legal Studies' | 'Governance';
  issueDate: string;
  credentialId: string;
  format: 'pdf' | 'image';
  fileUrl: string;
  trustText: string;
  verified: boolean;
  description: string;
  keyHighlights: string[];
}

export const certificates: CertificateItem[] = [
  {
    id: 'cert-bba-degree',
    title: 'Bachelor of Business Administration (BBA) in Management',
    issuer: 'United Methodist University (UMU)',
    category: 'Academic',
    issueDate: 'August 2021',
    credentialId: 'UMU-BBA-2021-MGMT-084',
    format: 'image',
    fileUrl: `${import.meta.env.BASE_URL}gallery/blama-portrait-robes.jpg`,
    trustText: 'Verified Official Academic Credential • United Methodist University (UMU) • Management 2021',
    verified: true,
    description: 'Undergraduate business management degree conferred with academic commendation in organizational administration, operational economics, and strategic planning.',
    keyHighlights: [
      'Four-year comprehensive curriculum in enterprise administration and operations',
      'Honors recognition for administrative coursework and project leadership',
      'Official academic qualification for professional executive management',
    ],
  },
  {
    id: 'cert-pypp-fellowship',
    title: 'President\'s Young Professionals Program (PYPP) Fellowship Award',
    issuer: 'President\'s Young Professionals Program (Class XI)',
    category: 'Fellowship',
    issueDate: 'October 2023',
    credentialId: 'PYPP-XI-LBR-2023-FELLOW',
    format: 'pdf',
    fileUrl: `${import.meta.env.BASE_URL}gallery/blama-pypp-fieldwork-warehouse.jpg`,
    trustText: 'Authentic Public-Service Leadership Credential • PYPP Class XI • Republic of Liberia',
    verified: true,
    description: 'Prestigious national public administration fellowship certificate awarded after nationwide competitive merit-based selection and civil-service leadership training.',
    keyHighlights: [
      'Top-tier competitive selection among university graduates across Liberia',
      'Intensive modules in civil-service ethics, public financial management, and leadership',
      'Direct deployment to civilian administration in state governance',
    ],
  },
  {
    id: 'cert-defense-placement',
    title: 'National Defense Civilian Administration Placement Record',
    issuer: 'Ministry of National Defense, Republic of Liberia',
    category: 'Public Service',
    issueDate: 'November 2023',
    credentialId: 'MOD-LBR-ADM-2023-PYPP',
    format: 'pdf',
    fileUrl: `${import.meta.env.BASE_URL}gallery/blama-formal-suit.jpg`,
    trustText: 'Verified Defense Governance Service Record • Ministry of National Defense • Republic of Liberia',
    verified: true,
    description: 'Official civilian defense administrative credential recognizing institutional contributions, logistics verification, and ministerial correspondence drafting.',
    keyHighlights: [
      'Civilian administration and logistics oversight at national defense headquarters',
      'Standard operating procedure adherence and inventory management',
      'High-level inter-agency liaison and documentation',
    ],
  },
  {
    id: 'cert-law-school-standing',
    title: 'Jurisprudence Scholarship & Standing Credential',
    issuer: 'Louis Arthur Grimes School of Law (University of Liberia)',
    category: 'Legal Studies',
    issueDate: 'Current Candidate',
    credentialId: 'LAGS-UL-LLB-SCHOLAR-2024',
    format: 'image',
    fileUrl: `${import.meta.env.BASE_URL}gallery/blama-law-library-books.png`,
    trustText: 'Verified Legal Scholar Standing • Louis Arthur Grimes School of Law • Equal Justice Focus',
    verified: true,
    description: 'Active legal education and jurisprudential scholarship at Liberia\'s premier law faculty, focusing on constitutional doctrine, statutory research, and equal justice.',
    keyHighlights: [
      'Legal research across constitutional law, commercial arbitration, and statutory interpretation',
      'Focus on access to justice and decentralized judicial support',
      'Active candidate for the Bachelor of Laws (LL.B) degree',
    ],
  },
  {
    id: 'cert-circuit-court-delegation',
    title: 'Circuit Court Judicial Observation & Field Delegation',
    issuer: 'The Judiciary — Third Judicial Circuit Court (Sinoe County)',
    category: 'Governance',
    issueDate: 'March 2024',
    credentialId: 'JUD-3JCC-SINOE-2024-DEL',
    format: 'image',
    fileUrl: `${import.meta.env.BASE_URL}gallery/blama-judiciary-sinoe-county.png`,
    trustText: 'Official Judicial Field Observation Credential • 3rd Judicial Circuit Court • Sinoe County',
    verified: true,
    description: 'Official participation in decentralized judicial observation and institutional field administration in Greenville City, Sinoe County, Republic of Liberia.',
    keyHighlights: [
      'Firsthand study of decentralized circuit court procedural operations',
      'Institutional dialogue on regional rule of law and court administration',
      'Synthesis of administrative governance with judicial practice',
    ],
  },
];

export function getCertificateForEducation(degree?: string, institution?: string): CertificateItem | undefined {
  if (!degree && !institution) return undefined;
  const d = (degree || '').toLowerCase();
  const inst = (institution || '').toLowerCase();

  if (d.includes('bba') || d.includes('bachelor') || d.includes('business administration') || inst.includes('methodist') || inst.includes('umu')) {
    return certificates.find((c) => c.id === 'cert-bba-degree');
  }
  if (d.includes('law') || d.includes('ll.b') || d.includes('jurisprudence') || inst.includes('louis arthur') || inst.includes('grimes')) {
    return certificates.find((c) => c.id === 'cert-law-school-standing');
  }
  return certificates.find((c) => 
    (degree && c.title.toLowerCase().includes(degree.toLowerCase())) ||
    (institution && c.issuer.toLowerCase().includes(institution.toLowerCase()))
  );
}

export function getCertificateForAchievement(title?: string, organization?: string): CertificateItem | undefined {
  if (!title && !organization) return undefined;
  const t = (title || '').toLowerCase();
  const o = (organization || '').toLowerCase();

  if (t.includes('pypp') || t.includes('young professional') || o.includes('young professional')) {
    return certificates.find((c) => c.id === 'cert-pypp-fellowship');
  }
  if (t.includes('defense') || o.includes('defense') || t.includes('civilian administration')) {
    return certificates.find((c) => c.id === 'cert-defense-placement');
  }
  if (t.includes('court') || t.includes('judicial') || t.includes('circuit') || o.includes('judiciary')) {
    return certificates.find((c) => c.id === 'cert-circuit-court-delegation');
  }
  if (t.includes('bba') || t.includes('academic honors') || o.includes('methodist')) {
    return certificates.find((c) => c.id === 'cert-bba-degree');
  }
  return certificates.find((c) => 
    (title && c.title.toLowerCase().includes(title.toLowerCase())) ||
    (organization && c.issuer.toLowerCase().includes(organization.toLowerCase()))
  );
}

export function getCertificateForSkill(skillName?: string): CertificateItem | undefined {
  if (!skillName) return undefined;
  const s = skillName.toLowerCase();

  if (s.includes('management') || s.includes('operations') || s.includes('strategic') || s.includes('administrative')) {
    return certificates.find((c) => c.id === 'cert-bba-degree');
  }
  if (s.includes('leadership') || s.includes('governance') || s.includes('public service') || s.includes('policy')) {
    return certificates.find((c) => c.id === 'cert-pypp-fellowship');
  }
  if (s.includes('defense') || s.includes('logistics') || s.includes('inter-agency')) {
    return certificates.find((c) => c.id === 'cert-defense-placement');
  }
  if (s.includes('legal') || s.includes('statutory') || s.includes('constitutional') || s.includes('jurisprudence') || s.includes('arbitration')) {
    return certificates.find((c) => c.id === 'cert-law-school-standing');
  }
  if (s.includes('court') || s.includes('judicial') || s.includes('decentralized')) {
    return certificates.find((c) => c.id === 'cert-circuit-court-delegation');
  }
  return undefined;
}

export function getCertificateForArticle(title?: string, category?: string): CertificateItem | undefined {
  if (!title && !category) return undefined;
  const t = (title || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (t.includes('defense') || t.includes('security') || c.includes('defense') || t.includes('civilian')) {
    return certificates.find((c) => c.id === 'cert-defense-placement');
  }
  if (t.includes('court') || t.includes('judicial') || t.includes('sinoe') || c.includes('judiciary') || t.includes('decentralized')) {
    return certificates.find((c) => c.id === 'cert-circuit-court-delegation');
  }
  if (t.includes('justice') || t.includes('law') || t.includes('constitutional') || t.includes('jurisprudence') || c.includes('legal')) {
    return certificates.find((c) => c.id === 'cert-law-school-standing');
  }
  if (t.includes('pypp') || t.includes('civil service') || t.includes('fellowship') || t.includes('leadership')) {
    return certificates.find((c) => c.id === 'cert-pypp-fellowship');
  }
  if (t.includes('management') || t.includes('bba') || t.includes('business')) {
    return certificates.find((c) => c.id === 'cert-bba-degree');
  }
  return undefined;
}


