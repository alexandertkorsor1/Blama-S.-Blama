import { useState } from 'react';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { articles, type Article } from '@/data/articles';

function ArticleCard({ article, onRead }: { article: Article; onRead: () => void }) {
  return (
    <article className="reveal card card-hover overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gradient-to-br from-navy-800 to-navy-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen size={40} className="text-gold-400/40" />
        </div>
        <span className="absolute top-4 left-4 rounded-md bg-gold-600 px-3 py-1 text-xs font-semibold text-white">
          {article.category}
        </span>
        {article.status === 'upcoming' && (
          <span className="absolute top-4 right-4 rounded-md border border-navy-500 bg-navy-900/80 px-2.5 py-1 text-xs font-medium text-navy-200 backdrop-blur-sm">
            Upcoming
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg font-bold text-navy-900 leading-snug">{article.title}</h3>

        <div className="mt-3 flex items-center gap-4 text-xs text-navy-400">
          {article.date && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {article.date}
            </span>
          )}
          {article.readTime && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {article.readTime}
            </span>
          )}
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">{article.excerpt}</p>

        <button
          onClick={onRead}
          disabled={article.status === 'upcoming'}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition-colors hover:text-gold-700 disabled:text-navy-300 disabled:cursor-not-allowed"
        >
          Read More
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

export default function ArticleCardList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleRead = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article && article.content && article.status === 'published') {
      setExpanded(expanded === id ? null : id);
    }
  };

  return (
    <section id="insights" className="section-padding py-20 lg:py-28 bg-cream-200">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Insights & Perspectives"
            title="Professional reflections and research"
            description="Original perspectives on business management, leadership, law, governance, public administration, and youth development. Articles will be added as they are published."
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onRead={() => handleRead(article.id)}
            />
          ))}
        </div>

        {expanded && (
          <div className="mt-8 reveal is-visible">
            <div className="rounded-xl border border-navy-100 bg-white p-6 sm:p-8">
              {(() => {
                const article = articles.find((a) => a.id === expanded);
                return article?.content ? (
                  <div className="prose prose-sm max-w-none text-navy-700">
                    {article.content}
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
