export interface SectionMeta {
  eyebrow: string;
  title: string;
  description: string;
}

export interface PYPPFeature {
  title: string;
  text: string;
  iconName?: string;
}

export interface PYPPShowcaseCard {
  title: string;
  tag: string;
  description: string;
  imageUrl: string;
}

export interface LeadershipArea {
  title: string;
  text: string;
  iconName?: string;
}

export interface PortfolioSectionsData {
  education: SectionMeta;
  experience: SectionMeta;
  achievements: SectionMeta;
  skills: SectionMeta;
  articles: SectionMeta;
  certificates: SectionMeta;
  documents: SectionMeta;
  pypp: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    features: PYPPFeature[];
    showcase: PYPPShowcaseCard[];
  };
  leadership: {
    eyebrow: string;
    title: string;
    description: string;
    areas: LeadershipArea[];
  };
}

export const initialSectionsData: PortfolioSectionsData = {
  education: {
    eyebrow: 'Education & Academic Foundations',
    title: 'Academic excellence in management and law',
    description: 'A structured trajectory from business administration to formal legal scholarship — cultivating interdisciplinary rigor for national public leadership.',
  },
  experience: {
    eyebrow: 'Experience',
    title: 'Professional roles and public-service placements',
    description: 'Practical leadership and administrative record spanning enterprise management, community development, and national defense public administration.',
  },
  achievements: {
    eyebrow: 'Achievements & Accreditations',
    title: 'Verified Milestones & Honors',
    description: 'Documented accomplishments across academic management, national fellowship programs, and civilian public service. Each record is backed by authenticated credentials.',
  },
  skills: {
    eyebrow: 'Competencies & Accreditations',
    title: 'Professional Capabilities & Field Certifications',
    description: 'Categorized competencies honed across corporate administration, national youth fellowship training, civilian defense management, and advanced jurisprudential legal research.',
  },
  articles: {
    eyebrow: 'Insights, Treatises & Publications',
    title: 'Policy Briefs, Legal Treatises & Research Papers',
    description: 'Analytical publications and scholarly contributions addressing governance, constitutional jurisprudence, defense administration, and public sector reforms.',
  },
  certificates: {
    eyebrow: 'Credentials & Accreditations',
    title: 'Verified Certificate Vault',
    description: 'Official academic degrees, national fellowship awards, and public service commendations. Available for inspection in authenticated PDF and image formats with official trust watermarks.',
  },
  documents: {
    eyebrow: 'Official Documentation',
    title: 'Curriculum Vitae & Document Hub',
    description: 'Select and export authenticated executive CVs, specialized defense administration reports, or scholarly policy treatises formatted for institutional and academic review.',
  },
  pypp: {
    eyebrow: "PRESIDENT'S YOUNG PROFESSIONALS PROGRAM",
    title: 'National Public Service Fellowship',
    subtitle: 'Class XI Fellow • Ministry of National Defense Placement',
    description: "A prestigious Liberian fellowship program dedicated to developing the next generation of public-sector leaders — combining professional training, mentorship, and direct government placement to strengthen national institutions.",
    features: [
      {
        title: 'Competitive Selection',
        text: "Selected into Class XI of the President's Young Professionals Program — a fellowship identifying and cultivating Liberia's emerging public-sector talent.",
        iconName: 'Award',
      },
      {
        title: 'Professional Development',
        text: 'Structured training and mentorship designed to build leadership, governance, and administrative capacity for effective public service.',
        iconName: 'TrendingUp',
      },
      {
        title: 'Public-Service Placement',
        text: 'Professional placement at the Ministry of National Defense, providing direct exposure to national institutional operations and governance.',
        iconName: 'Landmark',
      },
      {
        title: 'Leadership Network',
        text: "Joining a community of PYPP fellows dedicated to advancing Liberia's public sector through professional excellence and ethical leadership.",
        iconName: 'Users',
      },
    ],
    showcase: [
      {
        title: 'The Judiciary — 3rd Judicial Circuit Court',
        tag: 'Governance & Judicial Engagement',
        description: 'Institutional engagement and field delegation in Greenville City, Sinoe County, Republic of Liberia.',
        imageUrl: `${import.meta.env.BASE_URL}gallery/blama-judiciary-sinoe-county.png`,
      },
      {
        title: 'Institutional Support & Supply Logistics',
        tag: 'Field Logistics & Operations',
        description: 'Hands-on public management, warehouse oversight, and nationwide operational coordination.',
        imageUrl: `${import.meta.env.BASE_URL}gallery/blama-pypp-fieldwork-warehouse.jpg`,
      },
    ],
  },
  leadership: {
    eyebrow: 'Leadership & Public Service',
    title: 'Serving with purpose and integrity',
    description: 'Exposure to leadership and public service through fellowship, ministry placement, and community engagement.',
    areas: [
      {
        title: 'PYPP Fellowship',
        text: "Participation in the President's Young Professionals Program — a structured leadership development pathway for emerging Liberian public-sector professionals.",
        iconName: 'Award',
      },
      {
        title: 'Ministry Experience',
        text: 'Direct professional exposure at the Ministry of National Defense, providing insight into national governance and institutional operations.',
        iconName: 'Landmark',
      },
      {
        title: 'Community Involvement',
        text: 'Administrative support for the Block 3-Self Help Community Initiative, contributing to community-driven development at the local level.',
        iconName: 'Heart',
      },
      {
        title: 'Leadership Interests',
        text: 'A demonstrated interest in leadership, professional development, and public service — committed to continuous growth and ethical governance.',
        iconName: 'TrendingUp',
      },
    ],
  },
};

export const SECTIONS_STORAGE_KEY = 'blama_portfolio_sections_content_v1';

export function getStoredSectionsData(): PortfolioSectionsData {
  try {
    const saved = localStorage.getItem(SECTIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialSectionsData,
        ...parsed,
        education: { ...initialSectionsData.education, ...parsed.education },
        experience: { ...initialSectionsData.experience, ...parsed.experience },
        achievements: { ...initialSectionsData.achievements, ...parsed.achievements },
        skills: { ...initialSectionsData.skills, ...parsed.skills },
        articles: { ...initialSectionsData.articles, ...parsed.articles },
        certificates: { ...initialSectionsData.certificates, ...parsed.certificates },
        documents: { ...initialSectionsData.documents, ...parsed.documents },
        pypp: {
          ...initialSectionsData.pypp,
          ...parsed.pypp,
          features: parsed.pypp?.features || initialSectionsData.pypp.features,
          showcase: parsed.pypp?.showcase || initialSectionsData.pypp.showcase,
        },
        leadership: {
          ...initialSectionsData.leadership,
          ...parsed.leadership,
          areas: parsed.leadership?.areas || initialSectionsData.leadership.areas,
        },
      };
    }
  } catch (e) {
    console.warn('Failed to parse stored sections data:', e);
  }
  return initialSectionsData;
}
