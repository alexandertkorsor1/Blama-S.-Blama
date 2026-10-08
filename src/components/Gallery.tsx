import { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Image as ImageIcon,
  Check,
  MapPin,
  Calendar,
  Maximize2,
  Tag,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePublicContent } from '@/context/PublicContentContext';

export default function Gallery() {
  const { galleryImages } = usePublicContent();
  const [filter, setFilter] = useState<string | 'All'>('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const categories = [...new Set(galleryImages.map((image) => image.category))];

  const filtered =
    filter === 'All' ? galleryImages : galleryImages.filter((img) => img.category === filter);

  useEffect(() => {
    if (filter !== 'All' && !categories.includes(filter)) setFilter('All');
  }, [categories, filter]);

  // Ensure selected index remains in bounds when filtering
  useEffect(() => {
    if (selectedImageIndex !== null && selectedImageIndex >= filtered.length) {
      setSelectedImageIndex(filtered.length > 0 ? 0 : null);
    }
  }, [filtered.length, selectedImageIndex]);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % filtered.length;
    });
  }, [filtered.length]);

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  // Keyboard controls
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  const activeImage = selectedImageIndex !== null ? filtered[selectedImageIndex] : null;

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="section-padding py-20 lg:py-28 bg-parchment-100/50">
      <div className="site-container">
        <div className="reveal">
          <SectionHeading
            eyebrow="Media & Field Documentation"
            title="Curated photographic record"
            description="Select any photograph to inspect archival details, institutional locations, and field mission contexts across education, defense administration, and the judiciary."
          />
        </div>

        {/* Category Filters & Selector Bar */}
        <div className="reveal mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('All')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                filter === 'All'
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-white text-navy-800 border border-parchment-300 hover:bg-parchment-100'
              }`}
            >
              All Records ({galleryImages.length})
            </button>
            {categories.map((cat) => {
              const count = galleryImages.filter((img) => img.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    filter === cat
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-white text-navy-800 border border-parchment-300 hover:bg-parchment-100'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-navy-600 bg-white px-3 py-1.5 rounded-lg border border-parchment-200 shadow-xs w-fit">
            <ImageIcon size={13} className="text-gold-700" />
            <span>Select photograph to view archival details ({filtered.length} available)</span>
          </div>
        </div>

        {/* Selectable Gallery Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((img, index) => {
            const isSelected = selectedImageIndex === index;
            return (
              <div
                key={img.id}
                onClick={() => handleSelectImage(index)}
                className={`group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-navy-950 shadow-xs cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isSelected ? 'ring-3 ring-gold-500 shadow-md' : 'ring-1 ring-parchment-300/80 hover:ring-gold-500/60'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectImage(index);
                  }
                }}
                aria-label={`Select photograph: ${img.alt}`}
              >
                <img
                  src={img.publicUrl}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover object-[center_16%] transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

                {/* Top Category Badge & Select Indicator */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-md bg-navy-900/90 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gold-300 backdrop-blur-xs border border-gold-500/30">
                    {img.category}
                  </span>

                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900/80 text-white backdrop-blur-xs border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={12} className="text-gold-300" />
                  </div>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <p className="text-xs font-semibold text-white line-clamp-2 drop-shadow-sm font-sans">
                    {img.alt}
                  </p>
                  <p className="mt-1 text-[10px] font-mono text-gold-300/90">
                    Click to inspect record ↗
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Selectable Lightbox & Detail Viewer */}
      {lightboxOpen && activeImage && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-navy-950/98 p-4 sm:p-6 backdrop-blur-md animate-fadeIn"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar with Record Info and Close */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white border-b border-navy-800 pb-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-gold-600 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-white">
                {activeImage.category}
              </span>
              <span className="text-xs font-mono text-navy-400 hidden sm:inline">
                Record {selectedImageIndex! + 1} of {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={closeLightbox}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close photo inspector"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Inspection View Area */}
          <div
            className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute left-1 sm:left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/80 border border-white/20 text-white backdrop-blur-md transition-all hover:bg-gold-600 hover:border-gold-600"
              aria-label="Previous photograph"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-1 sm:right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/80 border border-white/20 text-white backdrop-blur-md transition-all hover:bg-gold-600 hover:border-gold-600"
              aria-label="Next photograph"
            >
              <ChevronRight size={24} />
            </button>

            {/* Selected Image with Metadata Panel */}
            <div className="flex flex-col lg:flex-row items-center gap-6 max-h-[72vh] w-full justify-center">
              <div className="relative max-h-[62vh] max-w-full overflow-hidden rounded-xl border border-gold-500/30 bg-navy-900 shadow-2xl">
                <img
                  src={activeImage.publicUrl}
                  alt={activeImage.alt}
                  className="max-h-[62vh] w-auto max-w-full object-contain rounded-xl"
                />
              </div>

              {/* Inspector Metadata Card */}
              <div className="w-full lg:w-80 rounded-xl border border-navy-800 bg-navy-900/90 p-5 text-left text-white shadow-xl">
                <div className="flex items-center gap-2 text-gold-400 font-mono text-[11px] uppercase tracking-wider">
                  <Tag size={13} />
                  <span>Verified Archival Entry</span>
                </div>

                <h4 className="mt-2 font-serif text-lg font-bold text-white">
                  {activeImage.alt}
                </h4>

                <div className="mt-4 space-y-2 text-xs font-mono text-navy-300 border-t border-navy-800 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-gold-400 shrink-0" />
                    <span>Republic of Liberia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-gold-400 shrink-0" />
                    <span>Classification: {activeImage.category}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-navy-400 font-sans leading-relaxed">
                  Official photographic documentation from the portfolio archives of Blama S. Blama.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Thumbnail Strip for Instant Selection */}
          <div
            className="w-full max-w-4xl border-t border-navy-800 pt-3 flex items-center justify-center gap-2 overflow-x-auto pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            {filtered.map((thumb, idx) => (
              <button
                key={thumb.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                  selectedImageIndex === idx
                    ? 'border-gold-500 scale-105 shadow-md'
                    : 'border-navy-700 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Select thumbnail ${idx + 1}`}
              >
                <img
                  src={thumb.publicUrl}
                  alt={thumb.alt}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
