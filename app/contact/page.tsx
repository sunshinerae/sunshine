import { Metadata } from 'next';
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
import { SMSSignup } from '@/components/forms/sms-signup';
import { SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = PAGE_METADATA.contact;

export default function ContactPage() {
  if (!isFeatureEnabled('fullContact')) {
    notFound();
  }

  return (
    <main className="bg-sunshine-white">
      {/* Hero Section */}
      <section className="bg-sunshine-purple text-sunshine-white px-6 py-16 overflow-hidden">
        <FadeInView className="max-w-5xl mx-auto space-y-4">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-blue">Contact</p>
          <h1 className="font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase leading-tight">
            Safe, judgment-free connection.
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-3xl">
            Tell us what you need. We respond within 24 hours with next steps, calm guidance, and zero pressure.
          </p>
          <p className="font-body text-sm">
            You are allowed to want more ease. This space is warm, private, and blame-free.
          </p>
        </FadeInView>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-5xl mx-auto py-12 px-6 space-y-12">
        <FadeInView direction="up" duration={0.6}>
          <ContactPageForm />
        </FadeInView>

        {/* Info Cards */}
        <StaggerChildren className="grid md:grid-cols-3 gap-6" staggerDelay={0.1} duration={0.3}>
          <StaggerItem>
            <BrandCard className="p-6 h-full" variant="yellow">
              <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">Response time</h3>
              <p className="font-body text-sm leading-relaxed">Within 24 hours, with clear next steps and zero pushiness.</p>
            </BrandCard>
          </StaggerItem>
          <StaggerItem>
            <BrandCard className="p-6 h-full" variant="white">
              <h3 className="font-headline text-xl uppercase text-sunshine-purple mb-2">Safety first</h3>
              <p className="font-body text-sm leading-relaxed">Judgment-free communication. You can ask for what you need without pressure.</p>
            </BrandCard>
          </StaggerItem>
          <StaggerItem>
            <BrandCard className="p-6 h-full" variant="orange">
              <h3 className="font-headline text-xl uppercase mb-2">Gentle microcopy</h3>
              <p className="font-body text-sm leading-relaxed">We reduce decision anxiety with clear options and loving encouragement.</p>
            </BrandCard>
          </StaggerItem>
        </StaggerChildren>
      </section>

      {/* Newsletter Signup Section - Consistent Bulletin */}
      <section className="bg-sunshine-yellow py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SlideInView direction="up" className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-purple mb-3">
              The Consistent Bulletin
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-tight text-sunshine-brown mb-4">
              Stay Connected
            </h2>
            <p className="font-body text-lg text-sunshine-brown/80 max-w-2xl mx-auto leading-relaxed">
              A personal note from Sunshine, curated recommendations, event updates, and gentle reminders that radiance is yours.
            </p>
          </SlideInView>

          <FadeInView delay={0.2} className="max-w-xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-sunshine-purple text-xl">✦</span>
                <div>
                  <h3 className="font-subhead text-sunshine-brown font-bold mb-1">Personal Notes</h3>
                  <p className="font-body text-sm text-sunshine-brown/70">Intimate letters from Sunshine with wisdom and encouragement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sunshine-purple text-xl">✦</span>
                <div>
                  <h3 className="font-subhead text-sunshine-brown font-bold mb-1">Curated Picks</h3>
                  <p className="font-body text-sm text-sunshine-brown/70">Books, tools, and practices to support your alignment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sunshine-purple text-xl">✦</span>
                <div>
                  <h3 className="font-subhead text-sunshine-brown font-bold mb-1">Event Updates</h3>
                  <p className="font-body text-sm text-sunshine-brown/70">First access to Golden Hour and Lunar Room gatherings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sunshine-purple text-xl">✦</span>
                <div>
                  <h3 className="font-subhead text-sunshine-brown font-bold mb-1">Community Connection</h3>
                  <p className="font-body text-sm text-sunshine-brown/70">Ways to stay in touch with women on the same path</p>
                </div>
              </div>
            </div>

            <NewsletterSignup
              variant="yellow"
              placeholder="Enter your email"
              buttonText="Join the Consistent Bulletin"
              successMessage="Welcome to the community! Your first note arrives soon."
            />

            <p className="font-body text-xs text-sunshine-brown/60 text-center mt-4">
              Glow from the heart. Unsubscribe anytime. No spam—just devotion and clarity.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* SMS Signup Section - Love Notes */}
      <section className="bg-sunshine-purple py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SlideInView direction="up" className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-blue mb-3">
              Love Notes
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-tight text-sunshine-white mb-4">
              A Little Sunshine in Your Pocket
            </h2>
            <p className="font-body text-lg text-sunshine-white/80 max-w-2xl mx-auto leading-relaxed">
              Short, sweet text messages to brighten your day—gentle check-ins, soft encouragement, and reminders that you are held.
            </p>
          </SlideInView>

          <FadeInView delay={0.2} className="max-w-xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-sunshine-yellow text-xl">♡</span>
                <div>
                  <h3 className="font-subhead text-sunshine-white font-bold mb-1">Gentle Check-ins</h3>
                  <p className="font-body text-sm text-sunshine-white/70">A soft nudge to pause, breathe, and remember your radiance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sunshine-yellow text-xl">♡</span>
                <div>
                  <h3 className="font-subhead text-sunshine-white font-bold mb-1">Encouragement</h3>
                  <p className="font-body text-sm text-sunshine-white/70">Words of warmth when you need them most</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sunshine-yellow text-xl">♡</span>
                <div>
                  <h3 className="font-subhead text-sunshine-white font-bold mb-1">Event Invites</h3>
                  <p className="font-body text-sm text-sunshine-white/70">First access to Golden Hour and Lunar Room gatherings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sunshine-yellow text-xl">♡</span>
                <div>
                  <h3 className="font-subhead text-sunshine-white font-bold mb-1">Always Optional</h3>
                  <p className="font-body text-sm text-sunshine-white/70">Reply STOP anytime. Your boundaries are honored.</p>
                </div>
              </div>
            </div>

            <SMSSignup
              variant="purple"
              placeholder="(555) 123-4567"
              buttonText="Get Love Notes"
              successMessage="Your first love note is on its way. Welcome, beautiful."
            />

            <p className="font-body text-xs text-sunshine-white/60 text-center mt-4">
              Move like it&apos;s already yours. 1-2 texts per week, max. Consent matters here.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="bg-sunshine-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SlideInView direction="up" className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm text-sunshine-purple mb-3">
              Connect With Us
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-tight text-sunshine-brown mb-4">
              Find Your Community
            </h2>
            <p className="font-body text-lg text-sunshine-brown/80 max-w-2xl mx-auto leading-relaxed">
              Join the conversation. See what radiance looks like in real life. Connect with women who are glowing from the heart.
            </p>
          </SlideInView>

          <FadeInView delay={0.2} className="flex flex-col items-center gap-8">
            {/* Instagram - Primary */}
            <Link
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-sunshine-yellow hover:bg-sunshine-orange transition-colors duration-300 w-full max-w-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sunshine-purple focus-visible:ring-offset-2"
            >
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sunshine-purple text-sunshine-white font-headline text-2xl group-hover:scale-110 transition-transform duration-300">
                IG
              </span>
              <div className="text-center">
                <h3 className="font-headline text-xl uppercase text-sunshine-brown group-hover:text-sunshine-white transition-colors duration-300 mb-2">
                  Instagram
                </h3>
                <p className="font-body text-sm text-sunshine-brown/80 group-hover:text-sunshine-white/90 transition-colors duration-300">
                  Daily inspiration, behind-the-scenes moments, and community highlights
                </p>
              </div>
              <span className="font-subhead text-sm text-sunshine-purple group-hover:text-sunshine-white transition-colors duration-300">
                @thesunshineeffect
              </span>
            </Link>

            {/* Secondary Social Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-sunshine-blue/20 hover:bg-sunshine-blue transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sunshine-purple focus-visible:ring-offset-2"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sunshine-blue text-sunshine-brown font-semibold group-hover:bg-sunshine-white transition-colors duration-300">
                  In
                </span>
                <span className="font-subhead text-sm text-sunshine-brown">
                  LinkedIn
                </span>
              </Link>
            </div>

            <p className="font-body text-sm text-sunshine-brown/60 text-center max-w-md">
              Real power doesn&apos;t have to push or prove. We show up authentically and invite you to do the same.
            </p>
          </FadeInView>
        </div>
      </section>
    </main>
  );
}
