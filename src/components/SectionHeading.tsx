interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}>
      <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-gold-500" />
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-navy-600 leading-relaxed sm:text-lg">{description}</p>
      )}
    </div>
  );
}
