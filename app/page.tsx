'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sunshine-yellow flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative poppy in corner - subtle */}
      <div className="absolute top-8 right-8 w-32 h-32 md:w-48 md:h-48 opacity-20 pointer-events-none hidden md:block">
        <Image
          src="/poppy.jpg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 relative z-10">

        {/* Bold headline */}
        <div className="space-y-4">
          <h1 className="font-headline text-[clamp(3rem,10vw,7rem)] uppercase leading-[0.85] tracking-tight text-sunshine-brown font-bold">
            Building<br />Something<br />Radiant
          </h1>
          <p className="font-subhead text-2xl md:text-3xl text-sunshine-purple font-bold uppercase">
            The Sunshine Effect
          </p>
        </div>

        {/* Body copy */}
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="font-body text-xl md:text-2xl text-sunshine-brown leading-relaxed">
            We&apos;re creating a space for women to move from burnout to alignment through simple rituals that build confidence, clarity, and momentum.
          </p>
          <p className="font-body text-lg md:text-xl text-sunshine-brown/80 leading-relaxed">
            Something beautiful is coming. Stay connected to the fire.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Link
            href="/launch"
            className="inline-block bg-sunshine-purple text-sunshine-white font-subhead font-bold py-5 px-12 md:py-6 md:px-16 rounded-full text-xl md:text-2xl uppercase hover:bg-sunshine-brown hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Get Early Access
          </Link>
          <p className="font-body text-sm md:text-base text-sunshine-brown/70 mt-6">
            Join the list to be first in line for events, offerings, and rituals
          </p>
        </div>

        {/* Instagram link */}
        <div className="pt-8">
          <p className="font-body text-base md:text-lg text-sunshine-brown">
            Follow the journey{' '}
            <a
              href="https://instagram.com/thesunshineeffect"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sunshine-purple hover:text-sunshine-orange transition-colors underline"
            >
              @thesunshineeffect
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
