import { Award, Landmark, Users, TrendingUp } from 'lucide-react';

const pyppFeatures = [
  {
    icon: Award,
    title: 'Competitive Selection',
    text: 'Selected into Class XI of the President\'s Young Professionals Program — a fellowship identifying and cultivating Liberia\'s emerging public-sector talent.',
  },
  {
    icon: TrendingUp,
    title: 'Professional Development',
    text: 'Structured training and mentorship designed to build leadership, governance, and administrative capacity for effective public service.',
  },
  {
    icon: Landmark,
    title: 'Public-Service Placement',
    text: 'Professional placement at the Ministry of National Defense, providing direct exposure to national institutional operations and governance.',
  },
  {
    icon: Users,
    title: 'Leadership Network',
    text: 'Joining a community of PYPP fellows dedicated to advancing Liberia\'s public sector through professional excellence and ethical leadership.',
  },
];

export default function PYPPSection() {
  return (
    <section id="pypp" className="relative section-padding py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(197,165,114,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,165,114,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="reveal text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold-500" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
              PYPP
            </span>
            <span className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            President's Young Professionals Program
          </h2>
          <p className="mt-3 text-lg font-semibold text-gold-300">Class XI</p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-navy-200 sm:text-lg">
            A prestigious Liberian fellowship program dedicated to developing the next generation
            of public-sector leaders — combining professional training, mentorship, and direct
            government placement to strengthen national institutions.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pyppFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="reveal rounded-xl border border-navy-700 bg-navy-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/40 hover:bg-navy-800"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-200">{feature.text}</p>
              </div>
            );
          })}
        </div>

        {/* PYPP in Action Showcase */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="reveal group relative overflow-hidden rounded-2xl border border-navy-700/80 bg-navy-800/60 shadow-xl transition-all duration-300 hover:border-gold-500/50">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/gallery/blama-judiciary-sinoe-county.png"
                alt="Blama S. Blama at The Judiciary, 3rd Judicial Circuit Court, Greenville City, Sinoe County"
                className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="inline-block rounded-full bg-gold-500/10 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                Governance & Judicial Engagement
              </span>
              <h4 className="mt-2 font-serif text-lg font-bold text-white">
                The Judiciary — 3rd Judicial Circuit Court
              </h4>
              <p className="mt-1 text-sm text-navy-300">
                Institutional engagement and field delegation in Greenville City, Sinoe County, Republic of Liberia.
              </p>
            </div>
          </div>

          <div className="reveal group relative overflow-hidden rounded-2xl border border-navy-700/80 bg-navy-800/60 shadow-xl transition-all duration-300 hover:border-gold-500/50" style={{ transitionDelay: '0.1s' }}>
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/gallery/blama-pypp-fieldwork-warehouse.jpg"
                alt="Blama S. Blama on PYPP field operations and national supply chain coordination"
                className="h-full w-full object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="inline-block rounded-full bg-gold-500/10 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                Field Logistics & Operations
              </span>
              <h4 className="mt-2 font-serif text-lg font-bold text-white">
                Institutional Support & Supply Logistics
              </h4>
              <p className="mt-1 text-sm text-navy-300">
                Hands-on public management, warehouse oversight, and nationwide operational coordination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
