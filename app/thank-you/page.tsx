import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandCard } from '@/components/brand-card';
import { PAGE_METADATA } from '@/lib/metadata';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ScaleIn } from '@/components/motion/scale-in';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = PAGE_METADATA.thankYou;

const nextSteps = [
  {
    title: 'Check your inbox',
    description: 'Your first update arrives soon. Add us to your contacts so it lands safely.',
  },
  {
    title: 'Follow along',
    description: 'Join us on Instagram for updates, behind-the-scenes moments, and community connection.',
  },
  {
    title: 'Mark your calendar',
    description: 'The next Golden Hour gathering might be calling your name.',
  },
];

export default function ThankYouPage() {
  return (
    <main className="bg-sun-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-sun-plum text-white px-6 py-20 md:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <ScaleIn delay={0.1} initialScale={0.5} duration={0.5} className="inline-block">
            <span className="text-6xl md:text-7xl block mb-4" role="img" aria-label="fire">
              🔥
            </span>
          </ScaleIn>
          <FadeInView delay={0.2} duration={0.7}>
            <h1 className="font-headline text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight">
              You are in.
            </h1>
          </FadeInView>
          <FadeInView delay={0.4} duration={0.7}>
            <p className="font-body text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto text-white/90">
              Welcome to The Sunshine Effect. You&apos;re in the orbit now.
            </p>
          </FadeInView>
          <FadeInView delay={0.6} direction="none" duration={0.7}>
            <p className="font-subhead text-lg text-sun-gold">
              Your next chapter starts here.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeInView className="text-center mb-12">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">
              What happens next
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sun-plum mb-4">
              Your first ritual arrives in 24 hours.
            </h2>
            <p className="font-body text-lg leading-relaxed text-sun-cocoa max-w-2xl mx-auto">
              A simple practice to help you pause, breathe, and reconnect with your radiance. No overwhelm—just gentle momentum.
            </p>
          </FadeInView>

          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => (
              <StaggerItem key={step.title}>
                <BrandCard className="p-7 h-full text-center" variant="white">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-gold text-sun-plum font-headline text-xl mb-4">
                    {index + 1}
                  </span>
                  <h3 className="font-headline text-xl uppercase text-sun-plum mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-sun-cocoa">
                    {step.description}
                  </p>
                </BrandCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Community Invitation Section */}
      <section className="bg-sun-gold px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeInView className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">
              Join the community
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sun-cocoa mb-4">
              You do not have to do this alone.
            </h2>
            <p className="font-body text-lg leading-relaxed text-sun-cocoa/80 max-w-2xl mx-auto">
              Connect with women who understand the path from scattered to radiant. Real support, real connection, real transformation.
            </p>
          </FadeInView>

          <StaggerChildren className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            <StaggerItem>
              <Link
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-sun-plum hover:bg-sun-plum/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-cocoa focus-visible:ring-offset-2 w-full sm:w-auto"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-paper text-sun-plum font-headline text-lg group-hover:scale-110 transition-transform duration-300">
                  IG
                </span>
                <div className="text-left">
                  <h3 className="font-headline text-base uppercase text-white mb-0.5">
                    Instagram
                  </h3>
                  <p className="font-body text-xs text-white/80">
                    @thesunshineeffect
                  </p>
                </div>
              </Link>
            </StaggerItem>

            <StaggerItem>
              <Link
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-sun-plum hover:bg-sun-plum/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-cocoa focus-visible:ring-offset-2 w-full sm:w-auto"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-paper text-sun-plum font-headline text-lg group-hover:scale-110 transition-transform duration-300">
                  in
                </span>
                <div className="text-left">
                  <h3 className="font-headline text-base uppercase text-white mb-0.5">
                    LinkedIn
                  </h3>
                  <p className="font-body text-xs text-white/80">
                    The Sunshine Effect
                  </p>
                </div>
              </Link>
            </StaggerItem>
          </StaggerChildren>

          <FadeInView delay={0.4} className="text-center">
            <p className="font-body text-sm text-sun-cocoa/70 max-w-md mx-auto">
              Daily inspiration, behind-the-scenes moments, and a community that celebrates your radiance.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Explore More Section */}
      <section className="bg-sun-cream px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeInView className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">
              While you wait
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] uppercase leading-[0.9] tracking-tight text-sun-plum mb-4">
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
                    Golden Hour gatherings in Los Angeles. Leave with clarity, momentum, and real connections.
                  </p>
                  <span className="font-subhead text-sm uppercase">
                    See events →
                  </span>
                </BrandCard>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/about" className="block h-full">
                <BrandCard className="p-7 h-full hover:scale-[1.02] transition-transform duration-300" variant="purple">
                  <h3 className="font-headline text-2xl uppercase mb-2">
                    About Sunshine
                  </h3>
                  <p className="font-body text-sm leading-relaxed mb-4">
                    The woman behind the movement. Learn more about what I&apos;m building for ambitious women.
                  </p>
                  <span className="font-subhead text-sm uppercase">
                    Meet Sunshine →
                  </span>
                </BrandCard>
              </Link>
            </StaggerItem>
          </StaggerChildren>

          <FadeInView delay={0.4} direction="none" className="text-center mt-12">
            <Link href="/">
              <Button className="bg-sun-plum text-white hover:bg-sun-plum/90 rounded-[14px]">
                Return Home
              </Button>
            </Link>
            <p className="font-body text-sm text-sun-cocoa/60 mt-4">
              Move like it is already yours.
            </p>
          </FadeInView>
        </div>
      </section>
    </main>
  );
}
