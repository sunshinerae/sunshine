'use client';

import Link from 'next/link';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ScaleIn } from '@/components/motion/scale-in';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sun-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Main content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 relative z-10">

        {/* Bold headline */}
        <div className="space-y-4">
          <FadeInView delay={0} duration={0.7}>
            <h1 className="font-headline text-[clamp(3rem,10vw,7rem)] uppercase leading-[0.85] tracking-tight text-sun-cocoa font-bold">
              Building<br />Something<br />Radiant
            </h1>
          </FadeInView>
          <FadeInView delay={0.2} duration={0.6}>
            <p className="font-subhead text-2xl md:text-3xl text-sun-plum font-bold uppercase">
              The Sunshine Effect
            </p>
          </FadeInView>
        </div>

        {/* Body copy */}
        <div className="max-w-2xl mx-auto space-y-6">
          <FadeInView delay={0.3} duration={0.6}>
            <p className="font-body text-xl md:text-2xl text-sun-cocoa leading-relaxed">
              We&apos;re creating a space for women to move from burnout to alignment through simple rituals that build confidence, clarity, and momentum.
            </p>
          </FadeInView>
          <FadeInView delay={0.4} duration={0.6}>
            <p className="font-body text-lg md:text-xl text-sun-cocoa/80 leading-relaxed">
              Something beautiful is coming. Stay connected to the fire.
            </p>
          </FadeInView>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <ScaleIn delay={0.5} duration={0.4} initialScale={0.9}>
            <Link
              href="/launch"
              className="inline-block bg-sun-plum text-sun-cream font-subhead font-bold py-5 px-12 md:py-6 md:px-16 rounded-[14px] text-xl md:text-2xl uppercase hover:bg-sun-gold hover:text-sun-cocoa hover:scale-105 transition-all duration-300 shadow-soft"
            >
              Get Early Access
            </Link>
          </ScaleIn>
          <FadeInView delay={0.6} direction="none" duration={0.5}>
            <p className="font-body text-sm md:text-base text-sun-cocoa/70 mt-6">
              Join the list to be first in line for events, offerings, and rituals
            </p>
          </FadeInView>
        </div>
      </div>
    </div>
  );
}
