'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ScaleIn } from '@/components/motion/scale-in';
import { NewsletterSignup } from '@/components/forms/newsletter-signup';
import { FEATURES } from '@/lib/features';

export default function HomePage() {
  const handleNewsletterSubmit = async (email: string) => {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'newsletter', email }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Golden Hour Hero Background - slow drift animation */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/bg-option-orange-2.png"
          alt=""
          fill
          priority
          className="object-cover object-center animate-slow-drift"
          aria-hidden="true"
        />
      </div>
      {/* Layered gradient overlays - elegant & sexy */}
      <div className="absolute inset-0 bg-gradient-to-t from-sun-plum/70 via-sun-plum/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-sun-coral/40 via-transparent to-sun-gold/30" />
      {/* Glowing orbs */}
      <div className="absolute -bottom-32 left-1/4 w-[700px] h-[400px] rounded-full bg-sun-coral/40 blur-[100px]" />
      <div className="absolute -bottom-20 right-1/4 w-[500px] h-[300px] rounded-full bg-sun-gold/30 blur-[80px]" />
      <div className="absolute top-1/4 -left-20 w-[300px] h-[300px] rounded-full bg-sun-plum/30 blur-[60px]" />
      <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] rounded-full bg-sun-sky/20 blur-[60px]" />

      {/* Main content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 relative z-10">

        {/* Bold headline */}
        <div className="space-y-4">
          <FadeInView delay={0} duration={0.7}>
            <h1 className="font-headline text-[clamp(2.5rem,8vw,5.5rem)] uppercase leading-[0.85] tracking-tight text-white font-bold drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              Welcome —<br />so glad you&apos;re here.
            </h1>
          </FadeInView>
          <FadeInView delay={0.15} duration={0.6}>
            <p className="font-headline text-[clamp(1.5rem,4vw,2.8rem)] uppercase leading-[0.9] tracking-tight text-sun-plum drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
              The Sunshine Effect welcomes you
            </p>
          </FadeInView>
          <FadeInView delay={0.25} duration={0.6}>
            <p className="font-body text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Wellness + community for the ambitious and the tired.
            </p>
          </FadeInView>
        </div>

        {/* In My Orbit Newsletter */}
        <FadeInView delay={0.35} duration={0.6}>
          <div className="max-w-xl mx-auto bg-sun-paper/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border-2 border-sun-sky/30">
            <p className="font-headline text-3xl md:text-4xl text-sun-plum uppercase mb-2">
              Be in my orbit ✨
            </p>
            <p className="font-body text-sun-cocoa/80 mb-6">
              What I&apos;m building, what I&apos;m hosting, and what I&apos;m into right now—events, updates, and inspo.
            </p>
            <NewsletterSignup
              variant="white"
              placeholder="Your email"
              buttonText="Join the orbit"
              successMessage="You're in the orbit. Welcome."
              onSubmit={handleNewsletterSubmit}
            />
          </div>
        </FadeInView>

        {/* Secondary CTA */}
        {!FEATURES.landingPageMode && (
          <div className="pt-2">
            <ScaleIn delay={0.5} duration={0.4} initialScale={0.9}>
              <Link
                href="/events"
                className="inline-block text-sun-plum font-subhead font-bold text-lg uppercase hover:text-sun-coral transition-colors duration-200 underline underline-offset-4 decoration-sun-gold decoration-2 hover:decoration-sun-coral"
              >
                See upcoming events →
              </Link>
            </ScaleIn>
          </div>
        )}
      </div>
    </div>
  );
}
