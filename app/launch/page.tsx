'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SignupModal } from '@/components/signup-modal';
import { FadeInView } from '@/components/motion/fade-in-view';
import { SlideInView } from '@/components/motion/slide-in-view';
import { ScaleIn } from '@/components/motion/scale-in';

export default function LaunchPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sun-cream via-sun-cream to-sun-gold/8 relative overflow-hidden">
        {/* Elegant floral overlays - subtle and ethereal */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none rotate-12">
          <Image
            src="/poppy.jpg"
            alt=""
            fill
            className="object-cover blur-md"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5 pointer-events-none -rotate-12">
          <Image
            src="/poppy.jpg"
            alt=""
            fill
            className="object-cover blur-sm"
          />
        </div>

        {/* Header spacing */}
        <div className="pt-16 md:pt-24"></div>

        {/* Main container - contained and centered */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24">

          {/* Hero Section - Image and Content */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* Hero Image - Contained and tasteful */}
            <SlideInView direction="right" delay={0.2} duration={0.7} className="relative order-2 md:order-1">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/ID_LOVE_THIS_PHOTO_ON_THE_SIGN_UP_PAGE.jpg"
                  alt="Woman with flame - The Sunshine Effect"
                  fill
                  className="object-cover md:opacity-100 opacity-90"
                  priority
                  quality={90}
                />
                {/* Subtle warm glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-sun-coral/20 via-transparent to-transparent"></div>
              </div>
            </SlideInView>

            {/* Content - Clean and spacious */}
            <div className="space-y-8 order-1 md:order-2">
              {/* Small brand tagline */}
              <FadeInView delay={0} duration={0.6}>
                <p className="font-subhead text-sm md:text-base text-sun-plum uppercase tracking-wider">
                  Glow from the heart
                </p>
              </FadeInView>

              {/* Headline - per brandSpec: H1 uses Belvare, uppercase, weight 700 */}
              <FadeInView delay={0.1} duration={0.7}>
                <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl leading-tight text-sun-cocoa uppercase font-bold">
                  Radiance<br />is Yours
                </h1>
              </FadeInView>

              {/* Subheadline - per brandSpec: H2 uses Laro Soft, weight 700 */}
              <FadeInView delay={0.2} duration={0.6}>
                <h2 className="font-subhead text-2xl md:text-3xl text-sun-plum font-bold">
                  The Sunshine Effect
                </h2>
              </FadeInView>

              {/* Body copy - per brandSpec */}
              <FadeInView delay={0.3} duration={0.6}>
                <p className="text-base md:text-lg text-sun-cocoa/80 font-body leading-relaxed max-w-md">
                  Move from burnout to alignment through simple rituals that build confidence, clarity, and momentum towards your most radiant life.
                </p>
              </FadeInView>

              {/* CTA Button */}
              <div className="pt-6">
                <ScaleIn delay={0.4} duration={0.4} initialScale={0.9}>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-sun-plum text-white px-12 py-5 rounded-full text-lg font-subhead font-bold uppercase hover:bg-sun-plum/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    I Want In
                  </button>
                </ScaleIn>
                <FadeInView delay={0.5} direction="none" duration={0.5}>
                  <p className="text-sm text-sun-cocoa/60 font-body mt-4">
                    Stay connected to the fire
                  </p>
                </FadeInView>
              </div>
            </div>

          </div>

        </div>

        {/* Social Proof Strip */}
        <section className="bg-sun-plum py-12 md:py-16 mt-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="text-center space-y-8">
              {/* Community count */}
              <FadeInView>
                <p className="font-subhead text-sun-gold text-lg md:text-xl uppercase tracking-wide">
                  Join 500+ women finding their radiance
                </p>
              </FadeInView>

              {/* Testimonial */}
              <FadeInView delay={0.2}>
                <blockquote className="max-w-2xl mx-auto">
                  <span className="font-headline text-4xl text-sun-gold leading-none select-none" aria-hidden="true">&ldquo;</span>
                  <p className="font-body text-lg md:text-xl text-white leading-relaxed -mt-2">
                    For the first time in years, I feel like I can breathe. The Sunshine Effect helped me find clarity when everything felt overwhelming.
                  </p>
                  <footer className="mt-6">
                    <cite className="not-italic">
                      <span className="font-subhead text-white block">Sarah M.</span>
                      <span className="font-body text-sm text-white/70">Community Member</span>
                    </cite>
                  </footer>
                </blockquote>
              </FadeInView>
            </div>
          </div>
        </section>

        {/* Mission statement footer */}
        <footer className="border-t border-sun-cocoa/10 py-8">
          <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
            <FadeInView>
              <p className="text-sm md:text-base text-sun-cocoa/70 font-body">
                The Sunshine Effect is a Los Angeles-based community for women ready to move from burnout to alignment.
              </p>
            </FadeInView>
          </div>
        </footer>
      </div>

      {/* Sign Up Modal */}
      <SignupModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
