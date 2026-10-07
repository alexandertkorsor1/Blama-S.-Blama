export interface HubDocumentItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  pageCount: string;
  targetDossierSection: string;
  format: 'pdf' | 'text' | 'docx';
  fileUrl?: string;
  fileName?: string;
  attestationText?: string;
  publishedDate?: string;
  citationText?: string;
  customBody?: string;
}

export const initialHubDocuments: HubDocumentItem[] = [
  {
    id: 'executive-cv',
    title: 'Official Executive Curriculum Vitae (CV)',
    category: 'Executive Summary',
    badge: 'Standard 2-Page Brief',
    description: 'Comprehensive executive summary of enterprise management, defense public service (PYPP Class XI), and legal scholarship at Louis Arthur Grimes School of Law.',
    pageCount: '2 Pages',
    targetDossierSection: 'cv',
    format: 'pdf',
    attestationText: 'Authenticated at Monrovia, Republic of Liberia • President\'s Young Professionals Program Class XI.',
    publishedDate: '2026',
    citationText: 'Blama, S. B. (2026). Official Executive Curriculum Vitae (CV). Executive Compendium. Monrovia: Republic of Liberia.',
  },
  {
    id: 'legal-academic-dossier',
    title: 'Comprehensive Legal & Academic Monograph',
    category: 'Full Compendium',
    badge: 'Official Compendium',
    description: 'Complete academic and jurisprudence compendium including degree coursework, constitutional research doctrine, equal justice focus, and full biographical treatises.',
    pageCount: '6 Pages',
    targetDossierSection: 'education',
    format: 'pdf',
    attestationText: 'Official Academic & Legal Treatise • United Methodist University & Louis Arthur Grimes School of Law.',
    publishedDate: '2026',
    citationText: 'Blama, S. B. (2026). Comprehensive Legal & Academic Monograph. Jurisprudence Archives. Monrovia: Republic of Liberia.',
  },
  {
    id: 'pypp-defense-brief',
    title: 'Public Administration & Defense Fellowship Report',
    category: 'Public Service',
    badge: 'PYPP Class XI',
    description: 'Specialized public-service briefing detailing Ministry of National Defense deployment, administrative directives, and judicial circuit delegations in Sinoe County.',
    pageCount: '3 Pages',
    targetDossierSection: 'public-service',
    format: 'pdf',
    attestationText: 'Official Civilian Defense Service Brief • Ministry of National Defense & PYPP.',
    publishedDate: '2023 - 2025',
    citationText: 'Blama, S. B. (2025). Public Administration & Defense Fellowship Report (PYPP Class XI). Monrovia: Ministry of National Defense.',
  },
  {
    id: 'paper-defense-governance',
    title: 'Policy Treatise: Statutory Governance & Defense Administration',
    category: 'Policy White Paper',
    badge: 'Scholarly Paper',
    description: 'Full published paper analyzing civilian oversight, standard operating procedures, and fiscal transparency in post-reform Liberian defense administration.',
    pageCount: '4 Pages',
    targetDossierSection: 'articles',
    format: 'pdf',
    attestationText: 'Scholarly Policy Treatise • Liberian Public Sector Governance Series.',
    publishedDate: '2024',
    citationText: 'Blama, S. B. (2024). Statutory Governance & Defense Administration in Post-Reform Liberia. Policy Monograph Series.',
  },
  {
    id: 'paper-equal-justice',
    title: 'Policy Treatise: Commercial Acumen & Equal Justice Jurisprudence',
    category: 'Legal Jurisprudence',
    badge: 'Scholarly Paper',
    description: 'Scholarly treatise examining the synergy between enterprise operations and constitutional commercial law to advance accessible justice for Liberian citizens.',
    pageCount: '5 Pages',
    targetDossierSection: 'articles',
    format: 'pdf',
    attestationText: 'Legal Jurisprudence Treatise • Commercial Law & Social Justice Analysis.',
    publishedDate: '2025',
    citationText: 'Blama, S. B. (2025). Commercial Acumen & Equal Justice: Bridging Corporate Governance and Constitutional Equity. Legal Scholar Review.',
  },
  {
    id: 'paper-civil-service',
    title: 'Policy Treatise: Cultivating Civil Service Integrity (PYPP Reflections)',
    category: 'Leadership Briefing',
    badge: 'Scholarly Paper',
    description: 'Analytical reflections on merit-based leadership development, ethical civil-service culture, and institutional capacity building in West Africa.',
    pageCount: '3 Pages',
    targetDossierSection: 'articles',
    format: 'pdf',
    attestationText: 'President\'s Young Professionals Program Leadership Monograph.',
    publishedDate: '2024',
    citationText: 'Blama, S. B. (2024). Cultivating Civil Service Integrity: Lessons from the Frontlines of Public Administration. Monrovia.',
  },
];
