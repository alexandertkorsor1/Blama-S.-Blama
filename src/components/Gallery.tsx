import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { galleryImages, type GalleryImage } from '@/data/gallery';

const categories: GalleryImage['category'][] = [
  'Education',
  'Professional',
  'PYPP',
  'Public Service',
  'Events',
];

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryImage['category'] | 'All'>('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === 'All' ? galleryImages : galleryImages.filter((img) => img.category === filter);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const nextImage = useCallback(() => {
    setLightbox((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % filtered.length;
    });
  }, [filtered.length]);

  const prevImage = useCallback(() => {
    setLightbox((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightbox, closeLightbox, nextImage, prevImage]);

  return (
    <section id="gallery" className="section-padding py-20 lg:py-28 bg-cream-200">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Gallery"
            title="Professional media"
            description="A curated visual showcase across education, professional work, public service, and events."
          />
        </div>

        {/* Filters and Counter Bar */}
        <div className="reveal mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('All')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                filter === 'All'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-white text-navy-700 border border-navy-200 hover:border-navy-400 hover:bg-navy-50'
              }`}
            >
              All ({galleryImages.length})
            </button>
            {categories.map((cat) => {
              const count = galleryImages.filter((img) => img.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    filter === cat
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'bg-white text-navy-700 border border-navy-200 hover:border-navy-400 hover:bg-navy-50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-navy-600 bg-white/70 px-3 py-1.5 rounded-lg border border-navy-200/80 w-fit">
            <ImageIcon size={14} className="text-gold-600" />
            <span>Showing {filtered.length} {filtered.length === 1 ? 'photo' : 'photos'}</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((img, index) => (
            <button
              key={`${img.src}-${index}`}
              onClick={() => setLightbox(index)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-navy-900 shadow-md ring-1 ring-navy-200/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-gold-500/60 text-left cursor-pointer animate-fadeIn"
              style={{ animationDelay: `${(index % 8) * 0.04}s` }}
              aria-label={`View photo: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hover Dark Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Top Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="rounded-md bg-navy-900/80 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gold-300 backdrop-blur-md border border-gold-500/30 shadow-sm">
                  {img.category}
                </span>
              </div>

              {/* Center Zoom Icon on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-white shadow-lg transform transition-transform group-hover:scale-110">
                  <ZoomIn size={20} />
                </div>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 backdrop-blur-[2px]">
                <p className="text-xs font-medium text-white line-clamp-2 drop-shadow-md">
                  {img.alt}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 backdrop-blur-md p-4 animate-fadeIn"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus:outline-none"
            aria-label="Close lightbox"
          >
            <X size={26} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 sm:left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-navy-900/70 border border-white/20 text-white backdrop-blur-md transition-colors hover:bg-gold-500 focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 sm:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-navy-900/70 border border-white/20 text-white backdrop-blur-md transition-colors hover:bg-gold-500 focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          <figure
            className="max-w-4xl max-h-[90vh] flex flex-col items-center animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl border border-gold-500/20 bg-navy-900">
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
              />
            </div>
            <figcaption className="mt-4 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-gold-500/20 border border-gold-500/30 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-300 mb-1.5">
                {filtered[lightbox].category} • {lightbox + 1} of {filtered.length}
              </span>
              <p className="text-sm sm:text-base text-navy-100 font-medium leading-relaxed">
                {filtered[lightbox].alt}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
