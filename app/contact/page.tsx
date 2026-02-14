import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BrandCard } from '@/components/brand-card';
import { isFeatureEnabled } from '@/lib/features';
import { PAGE_METADATA } from '@/lib/metadata';
import { ContactPageForm } from '@/components/forms/contact-page-form';
import { FadeInView } from '@/components/motion/fade-in-view';
import { SlideInView } from '@/components/motion/slide-in-view';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { NewsletterSignup } from '@/components/forms/newsletter-signup';
import { SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = PAGE_METADATA.contact;

export default function ContactPage() {
  if (!isFeatureEnabled('fullContact')) {
    notFound();
  }

  return (
    <main className="bg-artistic">
      {/* Hero Section */}
      <section className="text-white px-6 py-16 overflow-hidden relative">
        {/* Warm sand texture - slow drift animation */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/sand-warm.png"
            alt=""
            fill
            priority
            className="object-cover object-center animate-slow-drift"
            aria-hidden="true"
          />
        </div>
        {/* Subtle plum overlay */}
        <div className="absolute inset-0 bg-sun-plum/50" />
        <FadeInView className="max-w-5xl mx-auto space-y-4 relative z-10">
          <p className="font-subhead uppercase tracking-[0.15em] text-sm text-sun-gold">Contact</p>
          <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-[0.9] tracking-tight">
            Let&apos;s connect.
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-3xl">
            Questions about events, collaborations, or what we&apos;re building? Reach out. We respond within 24 hours.
          </p>
        </FadeInView>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-6 relative overflow-hidden">
        {/* Elegant layered gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sun-cream via-sun-sand/20 to-sun-cream" />
        <div className="absolute inset-0 bg-gradient-to-br from-sun-coral/10 via-transparent to-sun-sky/10" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-sun-gold/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-sun-plum/10 blur-[80px]" />
        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <FadeInView direction="up" duration={0.6}>
          <ContactPageForm />
        </FadeInView>

        {/* Info Cards */}
        <StaggerChildren className="grid md:grid-cols-3 gap-6" staggerDelay={0.1} duration={0.3}>
          <StaggerItem>
            <BrandCard className="p-6 h-full" variant="yellow">
              <h3 className="font-headline text-xl uppercase leading-[0.9] tracking-tight text-sun-plum mb-2">Response time</h3>
              <p className="font-body text-sm leading-relaxed">Within 24 hours with clear next steps.</p>
            </BrandCard>
          </StaggerItem>
          <StaggerItem>
            <BrandCard className="p-6 h-full border-2 border-sun-sky/30" variant="white">
              <h3 className="font-headline text-xl uppercase leading-[0.9] tracking-tight text-sun-plum mb-2">Collaborations</h3>
              <p className="font-body text-sm leading-relaxed">Open to partnerships, speaking, and event collaborations.</p>
            </BrandCard>
          </StaggerItem>
          <StaggerItem>
            <BrandCard className="p-6 h-full" variant="orange">
              <h3 className="font-headline text-xl uppercase leading-[0.9] tracking-tight mb-2">Events</h3>
              <p className="font-body text-sm leading-relaxed">Questions about Golden Hour? We&apos;ve got answers.</p>
            </BrandCard>
          </StaggerItem>
        </StaggerChildren>
        </div>
      </section>

      {/* Newsletter Signup Section - In My Orbit */}
      <section className="bg-sun-gold py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SlideInView direction="up" className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] text-sm text-sun-plum mb-3">
              In My Orbit
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sun-cocoa mb-4">
              Be in my orbit ✨
            </h2>
            <p className="font-body text-lg text-sun-cocoa/80 max-w-2xl mx-auto leading-relaxed">
              What I&apos;m building, what I&apos;m hosting, and what I&apos;m into right now—events, updates, and inspo.
            </p>
          </SlideInView>

          <FadeInView delay={0.2} className="max-w-xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-sun-plum text-xl">✦</span>
                <div>
                  <h3 className="font-subhead text-sun-cocoa font-bold mb-1">Event Invites</h3>
                  <p className="font-body text-sm text-sun-cocoa/70">First access to Golden Hour gatherings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sun-plum text-xl">✦</span>
                <div>
                  <h3 className="font-subhead text-sun-cocoa font-bold mb-1">Behind the Scenes</h3>
                  <p className="font-body text-sm text-sun-cocoa/70">What I&apos;m building and working on</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sun-plum text-xl">✦</span>
                <div>
                  <h3 className="font-subhead text-sun-cocoa font-bold mb-1">Weekly Momentum</h3>
                  <p className="font-body text-sm text-sun-cocoa/70">Ideas that move you forward</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sun-plum text-xl">✦</span>
                <div>
                  <h3 className="font-subhead text-sun-cocoa font-bold mb-1">Future Offers</h3>
                  <p className="font-body text-sm text-sun-cocoa/70">First to know when new offerings open</p>
                </div>
              </div>
            </div>

            <NewsletterSignup
              variant="yellow"
              placeholder="Your email"
              buttonText="Join the orbit"
              successMessage="You're in the orbit. Welcome."
            />

            <p className="font-body text-xs text-sun-cocoa/60 text-center mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-16 px-6 relative overflow-hidden">
        {/* Subtle warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-sun-cream via-sun-paper to-sun-cream" />
        <div className="absolute inset-0 bg-gradient-to-tl from-sun-sky/10 via-transparent to-sun-coral/10" />
        <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] rounded-full bg-sun-gold/10 blur-[90px]" />
        <div className="absolute top-1/4 left-0 w-[250px] h-[250px] rounded-full bg-sun-plum/8 blur-[70px]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SlideInView direction="up" className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] text-sm text-sun-plum mb-3">
              Connect
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sun-cocoa mb-4">
              Find Us
            </h2>
            <p className="font-body text-lg text-sun-cocoa/80 max-w-2xl mx-auto leading-relaxed">
              Follow along for updates, event photos, and behind-the-scenes of what we&apos;re building.
            </p>
          </SlideInView>

          <FadeInView delay={0.2} className="flex flex-col items-center gap-8">
            {/* Instagram - Primary */}
            <Link
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-sun-gold hover:bg-sun-coral transition-colors duration-300 w-full max-w-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-plum focus-visible:ring-offset-2"
            >
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sun-plum text-white font-headline text-2xl group-hover:scale-110 transition-transform duration-300">
                IG
              </span>
              <div className="text-center">
                <h3 className="font-headline text-xl uppercase leading-[0.9] tracking-tight text-sun-cocoa group-hover:text-white transition-colors duration-300 mb-2">
                  Instagram
                </h3>
                <p className="font-body text-sm text-sun-cocoa/80 group-hover:text-white/90 transition-colors duration-300">
                  Updates, event photos, and community moments
                </p>
              </div>
              <span className="font-subhead text-sm text-sun-plum group-hover:text-white transition-colors duration-300">
                @raeofsunshineirl
              </span>
            </Link>

          </FadeInView>
        </div>
      </section>
    </main>
  );
}
