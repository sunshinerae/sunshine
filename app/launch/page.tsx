'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SignupModal } from '@/components/signup-modal';

export default function LaunchPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sunshine-white via-sunshine-white to-sunshine-yellow/8 relative overflow-hidden">
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
            <div className="relative order-2 md:order-1">
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
                <div className="absolute inset-0 bg-gradient-to-t from-sunshine-orange/20 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Content - Clean and spacious */}
            <div className="space-y-8 order-1 md:order-2">
              {/* Small brand tagline */}
              <p className="font-subhead text-sm md:text-base text-sunshine-orange uppercase tracking-wider">
                Glow from the heart
              </p>

              {/* Headline - per brandSpec: H1 uses Belvare, uppercase, weight 700 */}
              <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl leading-tight text-sunshine-brown uppercase font-bold">
                Radiance<br />is Yours
              </h1>

              {/* Subheadline - per brandSpec: H2 uses Laro Soft, weight 700 */}
              <h2 className="font-subhead text-2xl md:text-3xl text-sunshine-purple font-bold">
                The Sunshine Effect
              </h2>

              {/* Body copy - per brandSpec */}
              <p className="text-base md:text-lg text-sunshine-brown/80 font-body leading-relaxed max-w-md">
                Move from burnout to alignment through simple rituals that build confidence, clarity, and momentum towards your most radiant life.
              </p>

              {/* CTA Button */}
              <div className="pt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-sunshine-purple text-sunshine-white px-12 py-5 rounded-full text-lg font-subhead font-bold uppercase hover:bg-sunshine-orange hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  I Want In
                </button>
                <p className="text-sm text-sunshine-brown/60 font-body mt-4">
                  Stay connected to the fire
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Mission statement footer */}
        <footer className="border-t border-sunshine-brown/10 py-8">
          <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
            <p className="text-sm md:text-base text-sunshine-brown/70 font-body">
              The Sunshine Effect is a Los Angeles-based community for women ready to move from burnout to alignment.
            </p>
          </div>
        </footer>
      </div>

      {/* Sign Up Modal */}
      <SignupModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
