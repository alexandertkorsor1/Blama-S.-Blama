export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string | null;
  status: 'published' | 'upcoming';
}

export const articles: Article[] = [
  {
    id: 'placeholder-1',
    title: 'Article coming soon',
    category: 'Professional Development',
    date: '',
    readTime: '',
    excerpt: 'This area will feature original perspectives on business management, leadership, law, governance, and public administration. Please check back for upcoming articles.',
    content: null,
    status: 'upcoming',
  },
];
