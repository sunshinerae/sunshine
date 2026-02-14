import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PAGE_METADATA } from '@/lib/metadata';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ScaleIn } from '@/components/motion/scale-in';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { SOCIAL_LINKS, PAYMENT_LINKS } from '@/lib/constants';

export const metadata: Metadata = PAGE_METADATA.thankYou;

export default function ThankYouPage() {
  return (
    <main className="bg-sun-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-sun-plum text-white px-6 py-20 md:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <ScaleIn delay={0.1} initialScale={0.5} duration={0.5} className="inline-block">
            <span className="text-6xl md:text-7xl block mb-4" role="img" aria-label="sparkles">
              ✨
            </span>
          </ScaleIn>
          <FadeInView delay={0.2} duration={0.7}>
            <h1 className="font-headline text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight">
              You&apos;re in ✨ Welcome to the Orbit.
            </h1>
          </FadeInView>
          <FadeInView delay={0.4} duration={0.7}>
            <p className="font-body text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto text-white/90">
              Thank you for signing up — it means the world to this growing community. The Sunshine Effect is independently produced, and donations help keep these gatherings accessible, beautiful, and well-supported.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Donation Section */}
      <section className="px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <FadeInView className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">
              Where donations go
            </p>
            <h2 className="font-headline text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[0.9] tracking-tight text-sun-plum mb-4">
              Support the Movement
            </h2>
            <p className="font-body text-lg leading-relaxed text-sun-cocoa max-w-xl mx-auto">
              Every donation is reinvested into future sessions — supporting facilitators and covering the costs of creating safe, intentional spaces.
            </p>
          </FadeInView>

          <StaggerChildren className="flex flex-col gap-6">
            {/* Venmo */}
            <StaggerItem>
              <div className="bg-sun-paper rounded-3xl p-8 shadow-soft border-2 border-sun-sky/30 text-center">
                <h3 className="font-headline text-2xl uppercase text-sun-plum mb-2">
                  Venmo
                </h3>
                <p className="font-body text-sun-cocoa/80 mb-4">
                  @SunshineB
                </p>
                {/* QR Code placeholder — replace src with actual Venmo QR image */}
                <div className="inline-flex items-center justify-center w-48 h-48 rounded-2xl bg-sun-sand/40 border-2 border-dashed border-sun-sand mb-4">
                  <span className="font-body text-sm text-sun-cocoa/50">Venmo QR Code</span>
                </div>
                <div>
                  <a
                    href={PAYMENT_LINKS.venmo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 rounded-full bg-sun-plum text-white font-subhead text-sm uppercase hover:bg-sun-plum/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-plum focus-visible:ring-offset-2"
                  >
                    Open Venmo
                  </a>
                </div>
              </div>
            </StaggerItem>

            {/* Zelle */}
            <StaggerItem>
              <div className="bg-sun-paper rounded-3xl p-8 shadow-soft border-2 border-sun-sky/30 text-center">
                <h3 className="font-headline text-2xl uppercase text-sun-plum mb-2">
                  Zelle
                </h3>
                <p className="font-body text-sun-cocoa/80 mb-4">
                  (909) 519-9378
                </p>
                {/* QR Code placeholder — replace src with actual Zelle QR image */}
                <div className="inline-flex items-center justify-center w-48 h-48 rounded-2xl bg-sun-sand/40 border-2 border-dashed border-sun-sand mb-4">
                  <span className="font-body text-sm text-sun-cocoa/50">Zelle QR Code</span>
                </div>
                <div>
                  <a
                    href={PAYMENT_LINKS.zelle}
                    className="inline-block px-8 py-3 rounded-full bg-sun-plum text-white font-subhead text-sm uppercase hover:bg-sun-plum/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-plum focus-visible:ring-offset-2"
                  >
                    Open Zelle
                  </a>
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* Community / Follow Section */}
      <section className="bg-sun-gold px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeInView className="text-center mb-10">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">
              Stay connected
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
                    @raeofsunshineirl
                  </p>
                </div>
              </Link>
            </StaggerItem>

          </StaggerChildren>
        </div>
      </section>

      {/* Return Home */}
      <section className="bg-sun-cream px-6 py-12 overflow-hidden">
        <FadeInView direction="none" className="text-center">
          <Link href="/">
            <Button className="bg-sun-plum text-white hover:bg-sun-plum/90 rounded-[14px]">
              Return Home
            </Button>
          </Link>
        </FadeInView>
      </section>
    </main>
  );
}
