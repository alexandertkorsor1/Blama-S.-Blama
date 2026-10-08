import { Film, PlayCircle } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePublicContent } from '@/context/PublicContentContext';

export default function VideoShowcase() {
  const { portfolioVideos } = usePublicContent();

  if (portfolioVideos.length === 0) return null;

  return (
    <section id="videos" className="section-padding border-t border-parchment-200 bg-navy-950 py-20 text-white lg:py-28">
      <div className="site-container">
        <div className="reveal">
          <SectionHeading
            eyebrow="Selected Recordings"
            title="In Conversation & In Service"
            description="A considered selection of recorded addresses, public engagements, and professional presentations."
            isDark
          />
        </div>
        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {portfolioVideos.map((video) => (
            <article key={video.id} className="reveal overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20">
              <div className="aspect-video bg-black">
                <video controls preload="metadata" poster={video.poster_url ?? undefined} className="h-full w-full" aria-label={video.title}>
                  <source src={video.publicUrl} />
                  Your browser does not support video playback.
                </video>
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300"><Film size={14} /> Portfolio recording</div>
                <h3 className="mt-3 font-serif text-2xl font-bold text-white">{video.title}</h3>
                {video.description && <p className="mt-3 max-w-prose text-sm leading-relaxed text-navy-200">{video.description}</p>}
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300"><PlayCircle size={15} /> Watch presentation</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
