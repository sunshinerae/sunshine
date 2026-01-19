import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';
import { NewsletterSignup } from '@/components/forms/newsletter-signup';
import { FadeInView } from '@/components/motion/fade-in-view';
import { SlideInView } from '@/components/motion/slide-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';

export const metadata: Metadata = PAGE_METADATA.community;

const pillars = [
  {
    title: 'Wellness & everyday self-respect',
    copy: 'Rituals that regulate your nervous system and honor your energy. Rest counts as progress.',
  },
  {
    title: 'Self-development & trauma awareness',
    copy: 'Gentle prompts, somatic practices, and language that honors what you have lived through.',
  },
  {
    title: 'Business strategy & aligned action',
    copy: 'Simple plans, bold asks, and marketing that feels like you. Momentum without the hustle.',
  },
];

const connection = [
  { title: 'Events', copy: 'Golden Hour + Lunar Room gatherings every month.' },
  { title: 'SMS list', copy: 'Gentle check-ins 1–2x week. Opt out anytime.' },
  { title: 'Consistent Bulletin', copy: 'Email love notes, curated tools, event updates.' },
  { title: 'Social', copy: 'Instagram for daily reminders and community features.' },
];

export default function CommunityPage() {
  if (!isFeatureEnabled('community')) {
    notFound();
  }
  return (
    <div className="bg-sunshine-white">
      <section className="px-4 sm:px-6 py-12 md:py-16 overflow-hidden bg-sunshine-yellow text-sunshine-brown">
        <FadeInView className="max-w-5xl mx-auto space-y-4 text-center">
          <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-purple">Community</p>
          <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-[0.9] tracking-tight text-sunshine-purple">
            You do not have to do this alone.
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
            The gap between where you are and where you want to go closes faster with women who get it. We build belonging, courage, and gentle accountability.
          </p>
          <FadeInView delay={0.3} direction="none">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/events">
                <Button className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange">
                  Explore events
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-sunshine-purple text-sunshine-purple hover:bg-sunshine-purple hover:text-sunshine-white">
                  Join the list
                </Button>
              </Link>
            </div>
          </FadeInView>
        </FadeInView>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <SlideInView direction="right" className="space-y-4">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-orange">The gap</p>
            <h2 className="font-headline text-4xl uppercase text-sunshine-purple leading-[0.9] tracking-tight">From busy & dull to aligned & radiant.</h2>
            <p className="font-body text-lg leading-relaxed text-sunshine-brown">
              Maybe there is another way. You want clarity, confidence, stability, and a circle that will not let you shrink. Community is how we move from awareness to action.
            </p>
          </SlideInView>
          <SlideInView direction="left" delay={0.2}>
            <BrandCard className="p-7" variant="purple">
              <h3 className="font-headline text-2xl uppercase mb-3">Who is here</h3>
              <ul className="space-y-3 text-sm leading-relaxed font-body">
                <li>Big-hearted, creative women in transition</li>
                <li>Curious about wellness, spirituality, and soulful work</li>
                <li>Ready to feel aligned, resourced, and proud of their progress</li>
              </ul>
              <div className="mt-6 text-sm">
                Themes we keep returning to: accountability, courage, belonging.
              </div>
            </BrandCard>
          </SlideInView>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 overflow-hidden bg-sunshine-purple text-sunshine-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <FadeInView className="space-y-2 text-center">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-blue">Content pillars</p>
            <h3 className="font-headline text-4xl uppercase leading-[0.9] tracking-tight">What we practice together</h3>
            <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
              Three pillars that show up in coaching, retreats, and every community touchpoint.
            </p>
          </FadeInView>
          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <BrandCard className="p-7 h-full" variant="white">
                  <h4 className="font-headline text-2xl uppercase text-sunshine-purple mb-2">{pillar.title}</h4>
                  <p className="font-body text-sm leading-relaxed">{pillar.copy}</p>
                </BrandCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-16 overflow-hidden bg-sunshine-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <FadeInView className="space-y-2 text-center">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-orange">How we stay connected</p>
            <h3 className="font-headline text-4xl uppercase text-sunshine-purple leading-[0.9] tracking-tight">Choose your doorway</h3>
            <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto text-sunshine-brown">
              Events, SMS love notes, the Consistent Bulletin, and social touches. Clear labels, big tap targets, and easy opt-outs.
            </p>
          </FadeInView>
          <StaggerChildren className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {connection.map((item) => (
              <StaggerItem key={item.title}>
                <BrandCard className="p-5 h-full" variant="white">
                  <h4 className="font-headline text-xl uppercase text-sunshine-purple mb-1">{item.title}</h4>
                  <p className="font-body text-sm leading-relaxed text-sunshine-brown">{item.copy}</p>
                </BrandCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
          <FadeInView delay={0.4} direction="none" className="text-center">
            <Link href="/contact">
              <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                Join the Consistent Bulletin
              </Button>
            </Link>
          </FadeInView>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-16 md:py-24 overflow-hidden bg-sunshine-orange">
        <FadeInView className="max-w-2xl mx-auto text-center space-y-6">
          <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-yellow">
            Join the list
          </p>
          <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sunshine-white">
            Your next chapter starts with one small yes.
          </h2>
          <p className="font-body text-lg leading-relaxed text-sunshine-white/90 max-w-xl mx-auto">
            Get weekly love notes, event invites, and gentle nudges toward the woman you are becoming. No spam, just warmth.
          </p>
          <FadeInView delay={0.3} direction="none">
            <div className="pt-4">
              <NewsletterSignup
                variant="orange"
                placeholder="Your email address"
                buttonText="I Want In"
                successMessage="You're in! Check your inbox for a warm welcome."
              />
            </div>
            <p className="font-body text-sm text-sunshine-white/70 mt-6">
              Unsubscribe anytime. Your peace matters.
            </p>
          </FadeInView>
        </FadeInView>
      </section>
    </div>
  );
}
