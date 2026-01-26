import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PAGE_METADATA } from '@/lib/metadata';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { Button } from '@/components/ui/button';
import { ArchMedia } from '@/components/ui/arch-media';

export const metadata: Metadata = PAGE_METADATA.about;

const values = [
  {
    name: 'Ambition',
    icon: '🔥',
    description:
      'We want more. More impact, more alignment, more life. Ambition isn\'t greed—it\'s trusting yourself enough to go after what you actually want.',
  },
  {
    name: 'Momentum',
    icon: '✨',
    description:
      'Action creates clarity. We don\'t wait until we\'re ready—we move, adjust, and build momentum that compounds.',
  },
  {
    name: 'Community',
    icon: '🤝',
    description:
      'You level up faster surrounded by women who push you forward. Real connection. Real accountability. Real growth.',
  },
  {
    name: 'Courage',
    icon: '👑',
    description:
      'Growth happens on the other side of fear. We take the bold action, have the hard conversation, bet on ourselves.',
  },
  {
    name: 'Alignment',
    icon: '🌿',
    description:
      'Success without alignment is just another grind. We build lives and businesses that actually feel good.',
  },
  {
    name: 'Leadership',
    icon: '💛',
    description:
      'Every woman here is a leader. We model what we believe, inspire through action, and lift others as we rise.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-artistic">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        {/* Purple dreamy clouds - slow drift animation */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/golden-hour-hero.png"
            alt=""
            fill
            priority
            className="object-cover object-center animate-slow-drift"
            aria-hidden="true"
          />
        </div>
        {/* Subtle plum overlay */}
        <div className="absolute inset-0 bg-sun-plum/40" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Arch portrait */}
            <FadeInView direction="left" className="order-2 md:order-1">
              <ArchMedia
                src="/portrait-female-professional.png"
                alt="Sunshine - founder of The Sunshine Effect"
                aspect="3/4"
                gradient
                className="max-w-sm mx-auto shadow-xl"
              />
            </FadeInView>

            {/* Text content */}
            <div className="order-1 md:order-2 text-center md:text-left">
              <FadeInView delay={0.1}>
                <p className="font-subhead text-sun-gold text-lg uppercase tracking-[0.15em] mb-4">
                  Meet Sunshine
                </p>
              </FadeInView>

              <FadeInView delay={0.2}>
                <h1 className="font-headline text-[clamp(3rem,8vw,5rem)] uppercase leading-[0.9] tracking-tight text-sun-cream font-bold mb-6">
                  The woman behind the movement.
                </h1>
              </FadeInView>

              <FadeInView delay={0.3}>
                <p className="font-body text-xl md:text-2xl text-sun-cream/90 leading-relaxed">
                  Catalyst for ambitious women who refuse to play small.
                </p>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        {/* Subtle warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sun-cream via-sun-sand/30 to-sun-cream" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-sun-coral/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-sun-sky/10 blur-3xl" />
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeInView>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sun-plum text-center mb-12">
              The Real Story
            </h2>
          </FadeInView>

          <FadeInView delay={0.1} className="mb-12">
            <div className="text-center md:text-left">
              <p className="font-body text-lg md:text-xl text-sun-cocoa leading-relaxed mb-6">
                I spent years in hustle mode—pushing harder, proving more, wondering why &quot;success&quot;
                felt hollow. The burnout was real. But the deeper problem? I&apos;d lost connection
                with what I actually wanted.
              </p>
              <p className="font-body text-lg md:text-xl text-sun-cocoa leading-relaxed">
                <strong>The fix wasn&apos;t doing more. It was coming home to myself.</strong>
              </p>
            </div>
          </FadeInView>

          <FadeInView delay={0.2} className="mb-12">
            <div className="bg-sun-plum/5 rounded-3xl p-8 md:p-10">
              <p className="font-body text-lg md:text-xl text-sun-cocoa leading-relaxed mb-6">
                Through a blend of mindset work, business strategy, and nervous system tools,
                I rebuilt my life from the inside out. Not from force—from clarity and self-trust.
                I learned that discipline is momentum in motion, and real confidence doesn&apos;t need
                anyone&apos;s permission.
              </p>
              <p className="font-body text-lg md:text-xl text-sun-cocoa leading-relaxed">
                Now I help other women make the same shift: from scattered and burned out,
                to clear, focused, and ready to take action.
              </p>
            </div>
          </FadeInView>

          <FadeInView delay={0.3}>
            <div className="text-center">
              <p className="font-body text-lg md:text-xl text-sun-cocoa leading-relaxed mb-8">
                The Sunshine Effect is the room I wish I&apos;d had. A space where ambitious women
                invest in themselves, build momentum, and leave with the clarity to
                take their next bold move.
              </p>
              <p className="font-headline text-2xl md:text-3xl uppercase leading-[0.9] tracking-tight text-sun-plum">
                &ldquo;Stop waiting. Start moving.&rdquo;
              </p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Values Grid Section - Mesh gradient */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        {/* Layered mesh gradient background - DRAMATIC */}
        <div className="absolute inset-0 bg-sun-gold" />
        <div className="absolute inset-0 bg-gradient-to-br from-sun-coral/60 via-sun-gold/20 to-sun-plum/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-sun-plum/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-sun-sky/15 via-transparent to-sun-coral/20" />
        {/* Dramatic glowing orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sun-coral/50 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sun-plum/40 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sun-gold/30 blur-[150px]" />
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-sun-sky/20 blur-[80px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeInView>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sun-cocoa text-center mb-4">
              What We Stand For
            </h2>
          </FadeInView>

          <FadeInView delay={0.1}>
            <p className="font-body text-lg md:text-xl text-sun-cocoa text-center max-w-2xl mx-auto mb-16">
              These values show up in every event, every conversation, every move we make.
            </p>
          </FadeInView>

          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            staggerDelay={0.1}
          >
            {values.map((value) => (
              <StaggerItem key={value.name}>
                <div className="bg-sun-paper rounded-3xl p-6 md:p-8 h-full shadow-soft hover:shadow-lg transition-shadow duration-300 border-2 border-sun-sky/20 hover:border-sun-sky/40">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-sun-plum/10 rounded-full flex items-center justify-center mb-5">
                    <span className="text-2xl md:text-3xl" aria-hidden="true">
                      {value.icon}
                    </span>
                  </div>
                  <h3 className="font-headline text-xl md:text-2xl uppercase leading-[0.9] tracking-tight text-sun-plum mb-3">
                    {value.name}
                  </h3>
                  <p className="font-body text-sun-cocoa leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section - Rich gradient */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sun-plum via-sun-coral to-sun-gold" />
        <div className="absolute inset-0 bg-gradient-to-tl from-sun-plum/50 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-sun-gold/20 blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeInView>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-white mb-6">
              Ready to stop playing small?
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto">
              Join ambitious women who are building momentum, taking bold action,
              and investing in themselves.
            </p>
          </FadeInView>
          <FadeInView delay={0.3} direction="none">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button className="bg-sun-paper text-sun-plum hover:bg-sun-gold hover:text-sun-cocoa">
                  See Upcoming Events
                </Button>
              </Link>
              <Link href="/join">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-sun-plum">
                  Join the Orbit
                </Button>
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>
    </main>
  );
}
