export interface GalleryImage {
  src: string;
  title: string;
  alt: string;
  category: 'Education' | 'Professional' | 'PYPP' | 'Public Service' | 'Events';
  location?: string;
  date?: string;
}

export const galleryImages: GalleryImage[] = [
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-portrait-robes.jpg`,
    title: 'Academic & Legal Honors Regalia',
    alt: 'Blama S. Blama in academic and legal honors regalia — University of Liberia & UMU',
    category: 'Education',
    location: 'Monrovia, Liberia',
    date: '2021',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-formal-suit.jpg`,
    title: 'Executive Leadership Formal Portrait',
    alt: 'Blama S. Blama in tailored executive formal suit — Public Administration & Management',
    category: 'Professional',
    location: 'Monrovia, Liberia',
    date: '2023',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-law-library-books.png`,
    title: 'Statutory Research & Jurisprudence',
    alt: 'Legal Studies & Research with Federal Supplement and Liberian Law volumes',
    category: 'Education',
    location: 'Louis Arthur Grimes Law Library',
    date: '2024',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-judiciary-sinoe-county.png`,
    title: 'The Judiciary — 3rd Judicial Circuit Court',
    alt: 'Public service and governance mission at the 3rd Judicial Circuit Court in Greenville City, Sinoe County',
    category: 'PYPP',
    location: 'Greenville City, Sinoe County',
    date: '2024',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-pypp-fieldwork-warehouse.jpg`,
    title: 'Field Logistics & Defense Administration',
    alt: 'President\'s Young Professionals Program field operations and public-sector logistics',
    category: 'PYPP',
    location: 'Ministry of National Defense Facilities',
    date: '2023',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-law-celebration-family.jpg`,
    title: 'Law School Milestone Celebration',
    alt: 'Louis Arthur Grimes School of Law celebration banner with family and supporters',
    category: 'Education',
    location: 'Monrovia, Liberia',
    date: '2024',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-law-graduation-ceremony.jpg`,
    title: 'Academic Recognition & Ceremony',
    alt: 'Law school academic recognition and formal milestone ceremony',
    category: 'Events',
    location: 'University Auditorium',
    date: '2024',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-campus-graduation-family.png`,
    title: 'University Campus Graduation',
    alt: 'Celebrating graduation milestone with family on university grounds',
    category: 'Events',
    location: 'University Campus',
    date: '2021',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-academic-remarks-family.jpg`,
    title: 'Formal Academic Remarks',
    alt: 'Delivering formal remarks during milestone academic celebration',
    category: 'Events',
    location: 'Monrovia, Liberia',
    date: '2021',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-graduation-celebration.jpg`,
    title: 'Milestone Honors Celebration',
    alt: 'Celebrating academic milestones with mentors and peers',
    category: 'Education',
    location: 'Monrovia, Liberia',
    date: '2021',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-judiciary-sinoe-county.png`,
    title: 'Decentralized Judicial Governance Delegation',
    alt: 'Official judicial delegation and field administration mission in Sinoe County',
    category: 'Public Service',
    location: 'Sinoe County, Liberia',
    date: '2024',
  },
  {
    src: `${import.meta.env.BASE_URL}gallery/blama-formal-suit.jpg`,
    title: 'Civil Service Public Administration',
    alt: 'Ministry of National Defense administrative leadership and governance representation',
    category: 'Public Service',
    location: 'Republic of Liberia',
    date: '2024',
  },
];
