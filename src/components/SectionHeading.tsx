import { FileText } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  actionLabel?: string;
  onAction?: () => void;
  isDark?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  actionLabel,
  onAction,
  isDark = false,
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center text-center mx-auto max-w-3xl' : 'max-w-3xl'}`}>
      <div className="flex items-center gap-2.5">
        <span className={`h-[2px] w-7 ${isDark ? 'bg-gold-400' : 'bg-gold-600'}`} />
        <span className={`font-mono text-xs font-bold uppercase tracking-[0.24em] ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>
          {eyebrow}
        </span>
        {align === 'center' && <span className={`h-[2px] w-7 ${isDark ? 'bg-gold-400' : 'bg-gold-600'}`} />}
      </div>

      <div className="mt-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 w-full">
        <h2 className={`font-serif text-3xl font-extrabold sm:text-4xl lg:text-5xl leading-tight ${isDark ? 'text-white' : 'text-navy-950'}`}>
          {title}
        </h2>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className={`self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors shrink-0 ${
              isDark
                ? 'border-gold-400/40 bg-navy-900/80 text-gold-300 hover:bg-gold-600 hover:text-white hover:border-gold-600'
                : 'border-parchment-300 bg-white text-navy-900 hover:bg-gold-50 hover:text-gold-900 hover:border-gold-400'
            }`}
          >
            <FileText size={13} className={isDark ? 'text-gold-300' : 'text-gold-700'} />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>

      {description && (
        <p className={`mt-3.5 text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-100 font-sans' : 'text-navy-800'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
