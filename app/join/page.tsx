import Image from 'next/image';
import Link from 'next/link';
import { FadeInView } from '@/components/motion/fade-in-view';
import { NewsletterSignup } from '@/components/forms/newsletter-signup';
import { BrandCard } from '@/components/brand-card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Join In My Orbit | The Sunshine Effect',
  description:
    'Get event invites, updates on what I\'m building, and weekly inspo from The Sunshine Effect. First access to future offerings.',
  alternates: { canonical: '/join' },
};

const bullets = [
  { title: 'Event invites', copy: 'First access to Golden Hour gatherings. The room where ambitious women show up.' },
  { title: 'What I\'m building', copy: 'Behind-the-scenes on what\'s next. Retreats, courses, collaborations.' },
  { title: 'Weekly momentum', copy: 'Ideas that move you forward. No fluff. Just action and clarity.' },
  { title: 'Early access', copy: 'When doors open, you\'ll know first. Real updates only.' },
];

export default function JoinPage() {
  return (
    <main className="bg-artistic">
      <section className="text-white px-6 py-16 md:py-20 relative overflow-hidden">
        {/* Golden hour clouds background - same as homepage */}
        <Image
          src="/golden-hour-clouds.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Plum overlay for brand consistency */}
        <div className="absolute inset-0 bg-sun-plum/60" />
        <div className="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <FadeInView>
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sun-gold">
              In My Orbit
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h1 className="font-headline text-[clamp(2.6rem,6vw,4.6rem)] uppercase leading-[0.9] tracking-tight">
              Be in my orbit ✨
            </h1>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto text-white/90">
              What I&apos;m building, what I&apos;m hosting, and what I&apos;m into right now—events, updates, and inspo for ambitious women.
            </p>
          </FadeInView>

          <FadeInView delay={0.3} direction="none">
            <div className="max-w-xl mx-auto pt-4">
              <NewsletterSignup
                variant="yellow"
                placeholder="Your email address"
                buttonText="Join the orbit"
                successMessage="You're in the orbit. Welcome."
              />
              <p className="font-body text-xs text-white/70 mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </FadeInView>
        </div>
      </section>

      <section className="px-6 py-14 md:py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {bullets.map((b) => (
            <BrandCard key={b.title} variant="white" className="p-7">
              <h2 className="font-headline text-2xl uppercase text-sun-plum mb-2">{b.title}</h2>
              <p className="font-body text-sm leading-relaxed text-sun-cocoa">{b.copy}</p>
            </BrandCard>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center mt-12 space-y-4">
          <p className="font-body text-sm text-sun-cocoa/70">
            No current offer — and that&apos;s intentional. We&apos;re building the room first. When it&apos;s time, you&apos;ll be first in line.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/events"><Button className="bg-sun-plum text-white hover:bg-sun-plum/90">See upcoming events</Button></Link>
            <Link href="/about"><Button variant="outline" className="border-sun-plum text-sun-plum hover:bg-sun-plum hover:text-white">About Sunshine</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
