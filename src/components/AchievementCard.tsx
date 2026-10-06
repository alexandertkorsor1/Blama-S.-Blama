import { Award, Trophy, Medal, BadgeCheck, Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { achievements, type Achievement } from '@/data/achievements';

const categoryIcon: Record<Achievement['category'], typeof Award> = {
  Academic: Trophy,
  Professional: Award,
  Fellowship: BadgeCheck,
  Leadership: Star,
  Certifications: Medal,
  Recognition: Star,
};

export default function AchievementCard() {
  return (
    <section id="achievements" className="section-padding py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Achievements"
            title="Verified milestones"
            description="Documented accomplishments across education, fellowship, and public service. Only verified achievements are displayed."
            align="center"
          />
        </div>

        <div className="mt-14 space-y-4">
          {achievements.map((achievement, index) => {
            const Icon = categoryIcon[achievement.category] || Award;
            return (
              <div
                key={`${achievement.title}-${index}`}
                className="reveal flex items-start gap-5 rounded-xl border border-navy-100 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gold-300"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <Icon size={24} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-navy-50 px-3 py-0.5 text-xs font-semibold text-navy-700">
                      {achievement.category}
                    </span>
                    {achievement.year && (
                      <span className="text-xs font-medium text-navy-400">{achievement.year}</span>
                    )}
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-bold text-navy-900">
                    {achievement.title}
                  </h3>
                  <p className="text-sm font-medium text-gold-700">{achievement.organization}</p>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">
                    {achievement.description}
                  </p>
                </div>

                {achievement.verified && (
                  <span className="hidden sm:flex shrink-0 items-center gap-1 text-xs font-semibold text-green-600">
                    <BadgeCheck size={14} />
                    Verified
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
