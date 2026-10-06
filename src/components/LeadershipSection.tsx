import { Landmark, Award, Heart, TrendingUp } from 'lucide-react';
import SectionHeading from './SectionHeading';

const leadershipAreas = [
  {
    icon: Award,
    title: 'PYPP Fellowship',
    text: 'Participation in the President\'s Young Professionals Program — a structured leadership development pathway for emerging Liberian public-sector professionals.',
  },
  {
    icon: Landmark,
    title: 'Ministry Experience',
    text: 'Direct professional exposure at the Ministry of National Defense, providing insight into national governance and institutional operations.',
  },
  {
    icon: Heart,
    title: 'Community Involvement',
    text: 'Administrative support for the Block 3-Self Help Community Initiative, contributing to community-driven development at the local level.',
  },
  {
    icon: TrendingUp,
    title: 'Leadership Interests',
    text: 'A demonstrated interest in leadership, professional development, and public service — committed to continuous growth and ethical governance.',
  },
];

export default function LeadershipSection() {
  return (
    <section id="leadership" className="section-padding py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Leadership & Public Service"
            title="Serving with purpose and integrity"
            description="Exposure to leadership and public service through fellowship, ministry placement, and community engagement."
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {leadershipAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="reveal group flex items-start gap-5 rounded-xl border border-navy-100 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/5"
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-800 transition-colors duration-300 group-hover:bg-gold-600 group-hover:text-white">
                  <Icon size={26} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-navy-900">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{area.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
