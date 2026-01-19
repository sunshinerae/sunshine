import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { PAGE_METADATA } from '@/lib/metadata';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = PAGE_METADATA.thankYou;

const nextSteps = [
  {
    title: 'Check your inbox',
    description: 'Your first ritual arrives within 24 hours. Add us to your contacts so it lands safely.',
  },
  {
    title: 'Follow along',
    description: 'Join us on Instagram for daily inspiration, behind-the-scenes moments, and community connection.',
  },
  {
    title: 'Mark your calendar',
    description: 'Our next Golden Hour or Lunar Room gathering might be calling your name.',
  },
];

export default function ThankYouPage() {
  return (
    <main className="bg-sunshine-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-sunshine-purple text-sunshine-white px-6 py-20 md:py-28 overflow-hidden">
        <FadeInView className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-6xl md:text-7xl block mb-4" role="img" aria-label="fire">
            🔥
          </span>
          <h1 className="font-headline text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight">
            You are in.
          </h1>
          <p className="font-body text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto text-sunshine-white/90">
            Welcome to The Sunshine Effect, radiant one. Your journey from burnout to alignment starts now.
          </p>
          <FadeInView delay={0.3} direction="none">
            <p className="font-subhead text-lg text-sunshine-yellow">
              Glow from the heart.
            </p>
          </FadeInView>
        </FadeInView>
      </section>

      {/* What Happens Next Section */}
      <section className="px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeInView className="text-center mb-12">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-orange mb-3">
              What happens next
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sunshine-purple mb-4">
              Your first ritual arrives in 24 hours.
            </h2>
            <p className="font-body text-lg leading-relaxed text-sunshine-brown max-w-2xl mx-auto">
              A simple practice to help you pause, breathe, and reconnect with your radiance. No overwhelm—just gentle momentum.
            </p>
          </FadeInView>

          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => (
              <StaggerItem key={step.title}>
                <BrandCard className="p-7 h-full text-center" variant="white">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sunshine-yellow text-sunshine-purple font-headline text-xl mb-4">
                    {index + 1}
                  </span>
                  <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-sunshine-brown">
                    {step.description}
                  </p>
                </BrandCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Community Invitation Section */}
      <section className="bg-sunshine-yellow px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeInView className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-purple mb-3">
              Join the community
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sunshine-brown mb-4">
              You do not have to do this alone.
            </h2>
            <p className="font-body text-lg leading-relaxed text-sunshine-brown/80 max-w-2xl mx-auto">
              Connect with women who understand the path from scattered to radiant. Real support, real connection, real transformation.
            </p>
          </FadeInView>

          <FadeInView delay={0.2} className="flex flex-col items-center gap-6">
            <Link
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-8 py-5 rounded-2xl bg-sunshine-purple hover:bg-sunshine-orange transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sunshine-brown focus-visible:ring-offset-2"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sunshine-white text-sunshine-purple font-headline text-xl group-hover:scale-110 transition-transform duration-300">
                IG
              </span>
              <div className="text-left">
                <h3 className="font-headline text-lg uppercase text-sunshine-white mb-1">
                  Follow on Instagram
                </h3>
                <p className="font-body text-sm text-sunshine-white/80">
                  @thesunshineeffect
                </p>
              </div>
            </Link>

            <p className="font-body text-sm text-sunshine-brown/60 text-center max-w-md">
              Daily inspiration, behind-the-scenes moments, and a community that celebrates your radiance.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Explore More Section */}
      <section className="bg-sunshine-white px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeInView className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sunshine-orange mb-3">
              While you wait
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] uppercase leading-[0.9] tracking-tight text-sunshine-purple mb-4">
              Explore what awaits you.
            </h2>
          </FadeInView>

          <StaggerChildren className="grid sm:grid-cols-2 gap-6">
            <StaggerItem>
              <Link href="/events" className="block h-full">
                <BrandCard className="p-7 h-full hover:scale-[1.02] transition-transform duration-300" variant="orange">
                  <h3 className="font-headline text-2xl uppercase mb-2">
                    Upcoming Events
                  </h3>
                  <p className="font-body text-sm leading-relaxed mb-4">
                    Golden Hour energy sessions and Lunar Room restorative gatherings. Leave lighter, clearer, connected.
                  </p>
                  <span className="font-subhead text-sm uppercase">
                    See events →
                  </span>
                </BrandCard>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/offerings" className="block h-full">
                <BrandCard className="p-7 h-full hover:scale-[1.02] transition-transform duration-300" variant="purple">
                  <h3 className="font-headline text-2xl uppercase mb-2">
                    Work With Sunshine
                  </h3>
                  <p className="font-body text-sm leading-relaxed mb-4">
                    1:1 coaching, retreats, and transformative experiences designed for women ready to glow.
                  </p>
                  <span className="font-subhead text-sm uppercase">
                    Explore offerings →
                  </span>
                </BrandCard>
              </Link>
            </StaggerItem>
          </StaggerChildren>

          <FadeInView delay={0.4} direction="none" className="text-center mt-12">
            <Link href="/">
              <Button className="bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                Return Home
              </Button>
            </Link>
            <p className="font-body text-sm text-sunshine-brown/60 mt-4">
              Move like it is already yours.
            </p>
          </FadeInView>
        </div>
      </section>
    </main>
  );
}
