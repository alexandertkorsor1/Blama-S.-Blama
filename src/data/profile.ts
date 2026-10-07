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
  title: 'Business Management Professional | Law Student | Public-Service & Leadership Professional',
  tagline: 'Built with purpose. Driven by impact.',
  country: 'Liberia',
  email: 'blama.s.blama@example.com',
  linkedin: 'https://www.linkedin.com/in/saahblama',
  location: 'Monrovia, Republic of Liberia',
  statement:
    'A Liberian professional grounded in business management and driven by a commitment to public service, leadership, and the rule of law. My journey bridges organizational excellence with a deepening pursuit of legal research and equal justice — building toward a future where governance and enterprise serve all citizens equitably.',
  photo: `${import.meta.env.BASE_URL}profile.jpg`, // Place your image in public/profile.jpg or use an external URL
};
