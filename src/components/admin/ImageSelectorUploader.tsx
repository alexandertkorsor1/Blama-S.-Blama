import { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Sparkles,
  FolderOpen,
  ShieldCheck,
  AlignLeft,
  Eye,
  Sliders,
} from 'lucide-react';

export interface PresavedImageOption {
  url: string;
  label: string;
  category: string;
}

export const defaultArchivalImages: PresavedImageOption[] = [
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-formal-suit.jpg`,
    label: 'Executive Formal Portrait (Suit)',
    category: 'Portrait',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-portrait-robes.jpg`,
    label: 'Formal Academic Robes Portrait',
    category: 'Academic',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-law-library-books.png`,
    label: 'Louis Arthur Grimes Law Library',
    category: 'Legal Studies',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-judiciary-sinoe-county.png`,
    label: 'The Judiciary — 3rd Circuit Court (Sinoe)',
    category: 'Judiciary',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-pypp-fieldwork-warehouse.jpg`,
    label: 'PYPP National Supply & Logistics',
    category: 'Public Service',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-teaching-classroom.jpg`,
    label: 'Classroom & Community Leadership',
    category: 'Community',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-fellows-mentorship-session.jpg`,
    label: 'PYPP Class XI Fellows Mentorship',
    category: 'Fellowship',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-office-desk-working.jpg`,
    label: 'Ministry of Defense Administrative Desk',
    category: 'Public Service',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-outdoor-portrait-trees.jpg`,
    label: 'Field Delegation Portrait',
    category: 'Portrait',
  },
  {
    url: `${import.meta.env.BASE_URL}gallery/blama-courthouse-facade.png`,
    label: 'Republic of Liberia Courthouse Grounds',
    category: 'Judiciary',
  },
];

const defaultTrustPresets = [
  'Verified Official Portrait • Republic of Liberia',
  'Academic Degree Verified • United Methodist University',
  'Authentic Public Service Record • PYPP Class XI',
  'Official Defense Administration • Ministry of National Defense',
  'Jurisprudence Scholar • Louis Arthur Grimes School of Law',
  'Decentralized Judicial Governance • Sinoe County',
];

interface ImageSelectorUploaderProps {
  value: string;
  onChange: (newImageUrl: string) => void;
  caption?: string;
  onCaptionChange?: (newCaption: string) => void;
  trustText?: string;
  onTrustTextChange?: (newTrustText: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
}

export default function ImageSelectorUploader({
  value,
  onChange,
  caption,
  onCaptionChange,
  trustText: externalTrustText,
  onTrustTextChange,
  label = 'Select or Upload Photo',
  description = 'Choose from the curated archival photos or upload a file directly from your device. You can also add custom descriptions and official Text of Trust seals.',
  required = false,
}: ImageSelectorUploaderProps) {
  const [activeTab, setActiveTab] = useState<'archive' | 'upload'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [localCaption, setLocalCaption] = useState<string>('');
  const [localTrustText, setLocalTrustText] = useState<string>('Verified Official Portrait • Republic of Liberia');
  const [showTrustSeal, setShowTrustSeal] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCaption = caption !== undefined ? caption : localCaption;
  const setEffectiveCaption = (val: string) => {
    setLocalCaption(val);
    onCaptionChange?.(val);
  };

  const activeTrustText = externalTrustText !== undefined ? externalTrustText : localTrustText;
  const setEffectiveTrustText = (val: string) => {
    setLocalTrustText(val);
    onTrustTextChange?.(val);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    if (!activeCaption) {
      setEffectiveCaption(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectArchive = (item: PresavedImageOption) => {
    onChange(item.url);
    setUploadedFileName(item.label);
    if (!activeCaption) {
      setEffectiveCaption(item.label);
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadedFileName('');
    setEffectiveCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-navy-200 bg-navy-50/60 p-5 sm:p-7 shadow-xs">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-200/80 pb-4">
        <div>
          <label className="block font-serif text-lg font-bold text-navy-950 flex items-center gap-2">
            <ImageIcon size={20} className="text-gold-600" />
            <span>{label}</span>
            {required && <span className="text-gold-700">*</span>}
          </label>
          {description && <p className="mt-0.5 text-xs text-navy-600 leading-relaxed">{description}</p>}
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 rounded-xl bg-navy-100 p-1 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-navy-950 shadow-xs font-bold'
                : 'text-navy-700 hover:text-navy-950'
            }`}
          >
            <Upload size={13} className="text-gold-600" />
            <span>Upload from Device</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'archive'
                ? 'bg-white text-navy-950 shadow-xs font-bold'
                : 'text-navy-700 hover:text-navy-950'
            }`}
          >
            <FolderOpen size={13} className="text-gold-600" />
            <span>Select from Archive</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Upload Directly from Device */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-300 bg-white p-7 text-center cursor-pointer transition-all hover:border-gold-500 hover:bg-gold-50/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 group-hover:scale-105 transition-transform shadow-xs">
              <Upload size={22} />
            </div>
            <p className="mt-3 text-sm font-bold text-navy-950">
              {uploadedFileName ? uploadedFileName : 'Click to Browse & Select Photo from your Device'}
            </p>
            <p className="mt-1 text-xs text-navy-500">
              Supports PNG, JPG, JPEG, and WebP image formats (High-resolution ready)
            </p>
          </div>
        </div>
      )}

      {/* Mode 2: Select from Curated Archive Photos */}
      {activeTab === 'archive' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-600">
              Click any authentic photo from archive to select:
            </span>
            <span className="text-xs text-gold-800 font-bold font-mono">
              {defaultArchivalImages.length} Curated Photos Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto p-1">
            {defaultArchivalImages.map((item) => {
              const isSelected = value === item.url;
              return (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => handleSelectArchive(item)}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 text-left transition-all ${
                    isSelected
                      ? 'border-gold-500 ring-2 ring-gold-400 shadow-md scale-[1.02]'
                      : 'border-navy-200 hover:border-gold-400 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`Select ${item.label}`}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-90" />
                  
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-white shadow">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <p className="text-[10px] font-mono font-bold text-white line-clamp-1">
                      {item.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* When Photo is Selected: Photo Preview + Description / Text of Trust Form */}
      {value && (
        <div className="mt-4 rounded-2xl border border-gold-400 bg-white p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check size={14} />
              </span>
              <span className="font-serif text-sm font-bold text-navy-950">
                Photo Selected & Ready
              </span>
              <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-gold-900">
                Active Asset
              </span>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={13} />
              <span>Remove Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Live Visual Preview with Stamped Seal (5 cols) */}
            <div className="md:col-span-5 space-y-2">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-600">
                Live Photo Preview:
              </p>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-navy-900 bg-navy-950 shadow-md">
                <img
                  src={value}
                  alt={activeCaption || 'Selected photo preview'}
                  className="h-full w-full object-cover"
                />

                {/* Optional Stamped Trust Text Overlay */}
                {showTrustSeal && activeTrustText && (
                  <div className="absolute bottom-0 left-0 right-0 bg-navy-950/90 backdrop-blur-xs border-t border-gold-400 px-3 py-1.5 text-center shadow-lg">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-gold-300 flex items-center justify-center gap-1 truncate">
                      <ShieldCheck size={11} className="text-gold-400 shrink-0" />
                      <span className="truncate">{activeTrustText}</span>
                    </p>
                  </div>
                )}
              </div>
              <p className="text-[11px] font-mono text-navy-500 truncate">
                File: {uploadedFileName || value.split('/').pop() || 'Selected image'}
              </p>
            </div>

            {/* Description & Text of Trust Controls (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              {/* 1. Description / Caption Input */}
              <div>
                <label className="block text-xs font-bold text-navy-900 flex items-center gap-1.5 mb-1.5">
                  <AlignLeft size={14} className="text-gold-700" />
                  <span>Photo Description / Caption:</span>
                </label>
                <input
                  type="text"
                  value={activeCaption}
                  onChange={(e) => setEffectiveCaption(e.target.value)}
                  placeholder="e.g. Executive Formal Portrait in Monrovia, Liberia"
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/40 px-3.5 py-2 text-xs font-medium text-navy-950 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
                <p className="mt-1 text-[10px] text-navy-500">
                  Descriptive text for accessibility, captions, and context.
                </p>
              </div>

              {/* 2. Custom "Text of Trust" / Provenance Stamp */}
              <div className="rounded-xl border border-parchment-200 bg-parchment-50 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-gold-700" />
                    <span>"Text of Trust" Watermark Seal:</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTrustSeal}
                      onChange={(e) => setShowTrustSeal(e.target.checked)}
                      className="rounded border-navy-300 text-gold-600 focus:ring-gold-500"
                    />
                    <span>Show on preview</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={activeTrustText}
                  onChange={(e) => setEffectiveTrustText(e.target.value)}
                  placeholder="e.g. Verified Official Portrait • Republic of Liberia"
                  className="w-full rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-950 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />

                {/* Quick Trust Text Presets */}
                <div className="space-y-1">
                  <p className="text-[10px] font-mono font-semibold uppercase text-navy-500">
                    Quick Trust Presets:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {defaultTrustPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEffectiveTrustText(preset)}
                        className="rounded-md border border-parchment-300 bg-white px-2 py-0.5 text-[10px] text-navy-700 hover:bg-gold-50 hover:text-gold-950 transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
