'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ScaleIn } from '@/components/motion/scale-in';
import { NewsletterSignup } from '@/components/forms/newsletter-signup';

const backgroundOptions = [
  { id: 'current', src: '/golden-hour-hero.png', label: 'Current (Golden Hour)' },
  { id: 'dusty-pink', src: '/bg-option-dusty-pink.png', label: 'Dusty Pink Purple' },
  { id: 'orange-1', src: '/bg-option-orange-1.png', label: 'Orange Yellow 1' },
  { id: 'orange-2', src: '/bg-option-orange-2.png', label: 'Orange Yellow 2' },
  { id: 'orange', src: '/bg-option-orange.png', label: 'Orange Yellow' },
  { id: 'cloud1', src: '/bg-option-cloud1.png', label: 'Cloud 1' },
  { id: 'orange-pink', src: '/bg-option-orange-pink.png', label: 'Orange & Pink' },
];

function HeroPreview({ bg, label }: { bg: string; label: string }) {
  return (
    <div className="relative">
      {/* Label */}
      <div className="absolute top-4 left-4 z-20 bg-sun-cocoa/80 text-white px-4 py-2 rounded-full font-subhead text-sm uppercase tracking-wide">
        {label}
      </div>

      <div className="min-h-[600px] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={bg}
            alt=""
            fill
            className="object-cover object-center"
            aria-hidden="true"
          />
        </div>
        {/* Layered gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-sun-plum/70 via-sun-plum/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-sun-coral/40 via-transparent to-sun-gold/30" />
        {/* Glowing orbs */}
        <div className="absolute -bottom-32 left-1/4 w-[700px] h-[400px] rounded-full bg-sun-coral/40 blur-[100px]" />
        <div className="absolute -bottom-20 right-1/4 w-[500px] h-[300px] rounded-full bg-sun-gold/30 blur-[80px]" />
        <div className="absolute top-1/4 -left-20 w-[300px] h-[300px] rounded-full bg-sun-plum/30 blur-[60px]" />
        <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] rounded-full bg-sun-sky/20 blur-[60px]" />

        {/* Main content */}
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 relative z-10">
          <div className="space-y-4">
            <h1 className="font-headline text-[clamp(3rem,10vw,7rem)] uppercase leading-[0.85] tracking-tight text-white font-bold drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              Stop playing<br />small.
            </h1>
            <p className="font-headline text-[clamp(1.8rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sun-plum drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
              Your next chapter starts here.
            </p>
            <p className="font-subhead text-xl md:text-2xl text-white font-bold uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              The Sunshine Effect
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-sun-paper/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border-2 border-sun-sky/30">
            <p className="font-headline text-3xl md:text-4xl text-sun-plum uppercase mb-2">
              Be in my orbit
            </p>
            <p className="font-body text-sun-cocoa/80 mb-6">
              What I&apos;m building, what I&apos;m hosting, and what I&apos;m into right now.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-full border-2 border-sun-sky/30 bg-white font-body text-sun-cocoa"
                disabled
              />
              <button className="px-6 py-3 rounded-full bg-sun-plum text-white font-subhead uppercase text-sm">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewBackgroundsPage() {
  return (
    <main className="bg-sun-cocoa">
      {/* Header */}
      <div className="bg-sun-plum text-white py-8 px-4 text-center">
        <h1 className="font-headline text-4xl uppercase mb-2">Background Preview</h1>
        <p className="font-body text-white/80">Compare hero backgrounds - scroll to see all options</p>
        <Link href="/" className="inline-block mt-4 text-sun-gold underline font-subhead text-sm uppercase">
          Back to Home
        </Link>
      </div>

      {/* All previews stacked */}
      <div className="space-y-2">
        {backgroundOptions.map((option) => (
          <HeroPreview key={option.id} bg={option.src} label={option.label} />
        ))}
      </div>
    </main>
  );
}
