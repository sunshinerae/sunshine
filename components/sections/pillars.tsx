import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const pillars = [
  {
    title: 'Flawless Project & Event Production',
    promise: 'For when you have a million moving parts.',
    highlights: [
      'Mapping out your entire project, from start to finish',
      'Coordinating with venues, agents, and other partners',
      'Managing budgets to keep you on track',
      'Handling the nitty-gritty of touring and events'
    ],
    href: '/services/logistics'
  },
  {
    title: 'A Beautiful Website That Wins You Clients',
    promise: 'Your digital home base, built to perform.',
    highlights: [
      'A gorgeous, fast website that reflects your unique brand',
      'Guidance on what to write so people find you on Google',
      'A clear way for visitors to hire you or buy from you',
      'Simple analytics so you can see what\'s working'
    ],
    href: '/services/web-seo-sprint'
  },
  {
    title: 'Smart Growth & Automation',
    promise: 'Ready to grow, but hate the admin work?',
    highlights: [
      'Targeted ad campaigns that reach the right people',
      'Automating repetitive tasks to free up your schedule',
      'Clear, easy-to-read reports on your growth',
      'Creating simple templates and guides for your team'
    ],
    href: '/services/ppc-campaigns'
  },
  {
    title: 'Coaching & Personal Development',
    promise: 'Navigate change with clarity and confidence.',
    highlights: [
      'Bi-weekly coaching sessions focused on your goals',
      'Accountability and progress tracking',
      'Strategic planning for career transitions',
      'Tools for stress management and sustainable growth'
    ],
    href: '/services/coaching'
  }
];

export function Pillars() {
  return (
    <section id="services" className="py-20 px-6 bg-sun-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 text-center text-sun-cocoa">
          What We Do
        </h2>
        <p className="text-center text-sun-cocoa/70 mb-16 max-w-2xl mx-auto">
          Four core services to handle the logistics, growth, systems, and personal development
          that keep creative work moving.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => (
            <Card
              key={pillar.title}
              className="group p-8 hover:border-sun-plum transition-transform hover:scale-[1.02] bg-sun-paper border border-sun-sand shadow-soft"
            >
              <h3 className="font-display text-2xl font-semibold mb-2 text-sun-cocoa">
                {pillar.title}
              </h3>
              <p className="text-sun-plum text-sm font-medium mb-6 italic">
                {pillar.promise}
              </p>
              <ul className="space-y-3 mb-8">
                {pillar.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-sun-cocoa/70">
                    <span className="text-sun-gold mt-0.5">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={pillar.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-sun-plum hover:text-sun-plum/80 hover:gap-3 transition-all"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
