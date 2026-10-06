export interface GalleryImage {
  src: string;
  alt: string;
  category: 'Education' | 'Professional' | 'PYPP' | 'Public Service' | 'Events';
}

export const galleryImages: GalleryImage[] = [
  {
    src: '/gallery/blama-portrait-robes.jpg',
    alt: 'Blama S. Blama — Professional portrait in academic & legal honors regalia',
    category: 'Education',
  },
  {
    src: '/gallery/blama-formal-suit.jpg',
    alt: 'Blama S. Blama — Executive formal portrait in tailored navy suit & gold tie',
    category: 'Professional',
  },
  {
    src: '/gallery/blama-law-library-books.png',
    alt: 'Legal Studies & Research — With Federal Supplement law volumes in the library',
    category: 'Education',
  },
  {
    src: '/gallery/blama-judiciary-sinoe-county.png',
    alt: 'Public Service & Governance — The Judiciary, 3rd Judicial Circuit Court, Greenville City, Sinoe County',
    category: 'PYPP',
  },
  {
    src: '/gallery/blama-pypp-fieldwork-warehouse.jpg',
    alt: 'PYPP Field Operations — President\'s Young Professionals Program logistics & administration',
    category: 'PYPP',
  },
  {
    src: '/gallery/blama-law-celebration-family.jpg',
    alt: 'Louis Arthur Grimes School of Law — Graduation celebration banner with family',
    category: 'Education',
  },
  {
    src: '/gallery/blama-law-graduation-ceremony.jpg',
    alt: 'Law School Graduation Ceremony — Academic recognition and celebration',
    category: 'Events',
  },
  {
    src: '/gallery/blama-campus-graduation-family.png',
    alt: 'Campus Graduation Milestone — Celebrating with family on university grounds',
    category: 'Events',
  },
  {
    src: '/gallery/blama-academic-remarks-family.jpg',
    alt: 'Delivering formal remarks during academic graduation milestone celebration',
    category: 'Events',
  },
  {
    src: '/gallery/blama-graduation-celebration.jpg',
    alt: 'Celebrating graduation milestone achievements with family and supporters',
    category: 'Education',
  },
  {
    src: '/gallery/blama-judiciary-sinoe-county.png',
    alt: 'Liberian Public Service & Legal Institutions — Field delegation in Sinoe County',
    category: 'Public Service',
  },
  {
    src: 'https://images.pexels.com/photos/27848721/pexels-photo-27848721.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Monrovia, Republic of Liberia — Urban coastline and national landscape',
    category: 'Public Service',
  },
];
