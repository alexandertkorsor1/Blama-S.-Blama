export interface Profile {
  fullName: string;
  professionalName: string;
  title: string;
  tagline: string;
  country: string;
  email: string;
  linkedin: string;
  location: string;
  statement: string;
  photo?: string;
}

export const profile: Profile = {
  fullName: 'Blama S. Blama',
  professionalName: 'Saah Blama',
  title: 'Business Management Professional | Law Scholar | Public Administration & PYPP Fellow',
  tagline: 'Bridging Enterprise Acumen, Public Service Stewardship & Equal Justice',
  country: 'Republic of Liberia',
  email: 'blama.s.blama@alumni.umu.edu.lr',
  linkedin: 'https://www.linkedin.com/in/saahblama',
  location: 'Monrovia, Republic of Liberia',
  statement:
    'A Liberian professional grounded in enterprise management and dedicated to public service, ethical leadership, and statutory jurisprudence. My career unites operational discipline with legal scholarship at the Louis Arthur Grimes School of Law — actively building toward a future where national institutions, commercial frameworks, and governance serve all citizens with equity and integrity.',
  photo: `${import.meta.env.BASE_URL}profile.jpg`,
};
