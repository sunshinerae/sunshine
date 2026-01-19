import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';

export const metadata: Metadata = PAGE_METADATA.offerings;

const focusAreas = [
  'Rebuild confidence and self trust',
  'Clarify goals and aligned action',
  'Release perfectionism and self-doubt',
  'Create daily rhythms that feel good',
  'Accountability and gentle support',
];

const retreatElements = [
  'Intention setting circles',
  'Somatic movement and breathwork',
  'Journaling and creative visioning',
  'Guest coaches + trauma-informed facilitators',
  'Skill-building workshops',
  'Brand collaborations + sponsored goodies',
];

const future = [
  { title: 'Online courses', copy: 'Self-paced mini journeys to build rituals and aligned habits.' },
  { title: 'Cohorts + challenges', copy: 'Seasonal containers for momentum, community, and live coaching.' },
  { title: 'Journals + tools', copy: 'Daily planners, ritual cards, and grounded prompts for clarity.' },
];

export default function OfferingsPage() {
  if (!isFeatureEnabled('offerings')) {
    notFound();
  }

  return (
    <div className="bg-sun-cream">
      <section className="bg-sun-plum text-white px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <FadeInView delay={0}>
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sun-gold">Offerings</p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h1 className="font-headline text-[clamp(2.8rem,6vw,4.5rem)] uppercase leading-tight">
              Services that honor your energy and your ambition.
            </h1>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
              Multiple entry points based on your readiness—private coaching, restorative retreats, and community events that meet you where you are.
            </p>
          </FadeInView>
          <FadeInView delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button className="bg-sun-gold text-sun-cocoa hover:bg-sun-gold/90">
                  Work With Sunshine
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-sun-plum">
                  Explore events
                </Button>
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <FadeInView>
            <div className="space-y-2">
              <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sun-plum">1:1 Coaching</p>
              <h2 className="font-headline text-4xl uppercase text-sun-plum">Come home to yourself.</h2>
              <p className="font-body text-lg text-sun-cocoa leading-relaxed max-w-3xl">
                Single session or 3-month journey. Together we clear the fog, rebuild confidence, and practice rituals that keep you resourced.
              </p>
              <p className="font-body text-sm text-sun-cocoa">Starts at $450 per session or $1,200 for 3 months. Payment plans available.</p>
            </div>
          </FadeInView>
          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            <StaggerItem>
              <BrandCard className="p-7" variant="purple">
                <h3 className="font-headline text-2xl uppercase mb-3">Single clarity session</h3>
                <p className="font-body leading-relaxed text-sm">
                  A focused 75 minutes to name what is draining you, choose a next step, and leave with a simple ritual you can start today.
                </p>
              </BrandCard>
            </StaggerItem>
            <StaggerItem className="md:mt-12">
              <BrandCard className="p-7" variant="orange">
                <h3 className="font-headline text-2xl uppercase mb-3">3-month journey</h3>
                <p className="font-body leading-relaxed text-sm">
                  Bi-weekly calls, voice note check-ins, and co-created rituals. We track progress, celebrate momentum, and recalibrate together.
                </p>
              </BrandCard>
            </StaggerItem>
            <StaggerItem>
              <BrandCard className="p-7" variant="white">
              <h3 className="font-headline text-2xl uppercase text-sun-plum mb-3">What it helps with</h3>
              <ul className="space-y-2 text-sm leading-relaxed font-body">
                {focusAreas.map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sun-gold mt-2" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </BrandCard>
            </StaggerItem>
          </StaggerChildren>
          <FadeInView delay={0.3}>
            <Link href="/contact">
              <Button variant="glow-yellow">
                Book a free 20-min discovery call
              </Button>
            </Link>
          </FadeInView>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 overflow-hidden bg-sun-gold text-sun-cocoa">
        <div className="max-w-6xl mx-auto space-y-8">
          <FadeInView>
            <div className="space-y-2">
              <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum">Retreats</p>
              <h2 className="font-headline text-4xl uppercase text-sun-plum">Release, remember, reconnect.</h2>
              <p className="font-body text-lg leading-relaxed max-w-3xl">
                Weekend and longer immersive experiences to shed old identities, remember who you are, and gather tools with women who want the same.
              </p>
              <p className="font-body text-sm text-sun-cocoa">From $650. Payment plans and limited scholarships available.</p>
            </div>
          </FadeInView>
          <StaggerChildren className="grid md:grid-cols-2 gap-6">
            <StaggerItem>
              <BrandCard className="p-7" variant="orange">
                <p className="font-subhead uppercase tracking-[0.14em] text-xs text-sun-plum">Energy</p>
                <h3 className="font-headline text-2xl uppercase mt-2">Immersive + restorative</h3>
                <p className="font-body leading-relaxed mt-3 text-sm">
                  Release old narratives, reset your nervous system, and leave with practice you can carry home.
                </p>
              </BrandCard>
            </StaggerItem>
            <StaggerItem>
              <BrandCard className="p-7" variant="white">
                <h4 className="font-subhead uppercase tracking-[0.14em] text-xs text-sun-plum">Elements</h4>
                <ul className="grid sm:grid-cols-2 gap-3 mt-3 text-sm leading-relaxed font-body">
                  {retreatElements.map((item) => (
                    <li key={item} className="flex gap-2 items-start">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sun-coral mt-2" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </BrandCard>
            </StaggerItem>
          </StaggerChildren>
          <FadeInView delay={0.3}>
            <Link href="/events">
              <Button className="bg-sun-plum text-white hover:bg-sun-plum/90">
                Join the retreat waitlist
              </Button>
            </Link>
          </FadeInView>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 overflow-hidden bg-sun-cream">
        <div className="max-w-6xl mx-auto space-y-8">
          <FadeInView>
            <div className="space-y-2">
              <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum">Events hub</p>
              <h2 className="font-headline text-4xl uppercase text-sun-plum leading-[0.9] tracking-tight">Community in motion</h2>
              <p className="font-body text-lg leading-relaxed max-w-3xl text-sun-cocoa">
                Golden Hour (high-energy, heart-led networking) and Lunar Room (slow, introspective sound + stillness). Two energies, one community.
              </p>
            </div>
          </FadeInView>
          <StaggerChildren className="grid md:grid-cols-2 gap-6">
            <StaggerItem>
              <BrandCard className="p-7" variant="orange">
                <h3 className="font-headline text-2xl uppercase mb-2">Golden Hour</h3>
                <p className="font-body text-sm leading-relaxed">Electric, connective, and playful. Storytelling, mindset coaching, and a clear next step to keep moving.</p>
                <Button className="mt-5 bg-sun-plum text-white hover:bg-sun-plum/90">
                  See upcoming dates
                </Button>
              </BrandCard>
            </StaggerItem>
            <StaggerItem>
              <BrandCard className="p-7" variant="purple">
                <h3 className="font-headline text-2xl uppercase mb-2">Lunar Room</h3>
                <p className="font-body text-sm leading-relaxed">Slow, grounded, candle-lit. Yoga, sound, meditation, and gentle community processing.</p>
                <Button className="mt-5 bg-sun-gold text-sun-cocoa hover:bg-sun-gold/90">
                  Join the waitlist
                </Button>
              </BrandCard>
            </StaggerItem>
          </StaggerChildren>
          <FadeInView delay={0.3}>
            <Link href="/events">
              <Button variant="outline" className="border-sun-plum text-sun-plum hover:bg-sun-plum hover:text-white">
                Explore all events
              </Button>
            </Link>
          </FadeInView>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 overflow-hidden bg-sun-gold text-sun-cocoa">
        <div className="max-w-6xl mx-auto space-y-8">
          <FadeInView>
            <div className="space-y-2">
              <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sun-plum">Future offerings</p>
              <h2 className="font-headline text-4xl uppercase text-sun-plum">Planting seeds</h2>
              <p className="font-body text-lg leading-relaxed max-w-3xl">
                We are building more ways to stay in momentum. No overpromising—just honest excitement for what is next.
              </p>
            </div>
          </FadeInView>
          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {future.map((item) => (
              <StaggerItem key={item.title}>
                <BrandCard variant="white" className="p-6">
                  <h3 className="font-headline text-xl uppercase text-sun-plum mb-2">{item.title}</h3>
                  <p className="font-body text-sm leading-relaxed">{item.copy}</p>
                </BrandCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </div>
  );
}
