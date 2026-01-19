import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ScaleIn } from '@/components/motion/scale-in';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';

const quickLinks = [
  { href: '/', label: 'Home', description: 'Return to the beginning' },
  { href: '/about', label: 'About', description: 'Learn our story' },
  { href: '/offerings', label: 'Offerings', description: 'Explore how we can work together' },
  { href: '/events', label: 'Events', description: 'Find your next gathering' },
  { href: '/blog', label: 'Blog', description: 'Read wisdom and rituals' },
  { href: '/contact', label: 'Contact', description: 'Reach out to us' },
];

export default function NotFound() {
  return (
    <main className="bg-sun-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-sun-plum text-white px-6 py-20 md:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <ScaleIn delay={0.1} initialScale={0.5} duration={0.5} className="inline-block">
            <span className="text-6xl md:text-7xl block mb-4" role="img" aria-label="compass">
              🧭
            </span>
          </ScaleIn>
          <FadeInView delay={0.2} duration={0.7}>
            <h1 className="font-headline text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight">
              You wandered off the path.
            </h1>
          </FadeInView>
          <FadeInView delay={0.4} duration={0.7}>
            <p className="font-body text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto text-white/90">
              That is okay, radiant one. Even the brightest souls get lost sometimes. Let us guide you back to where you belong.
            </p>
          </FadeInView>
          <FadeInView delay={0.6} direction="none" duration={0.7}>
            <p className="font-subhead text-lg text-sun-gold">
              Come home to yourself.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeInView className="text-center mb-12">
            <p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-coral mb-3">
              Find your way
            </p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-sun-plum mb-4">
              Where would you like to go?
            </h2>
            <p className="font-body text-lg leading-relaxed text-sun-cocoa max-w-2xl mx-auto">
              Every path leads somewhere beautiful. Choose the one that calls to you.
            </p>
          </FadeInView>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <StaggerItem key={link.href}>
                <Link
                  href={link.href}
                  className="block p-6 rounded-2xl bg-sun-gold/20 hover:bg-sun-gold/40 border border-sun-gold/30 transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-plum focus-visible:ring-offset-2"
                >
                  <h3 className="font-headline text-xl uppercase text-sun-plum mb-1">
                    {link.label}
                  </h3>
                  <p className="font-body text-sm text-sun-cocoa/70">
                    {link.description}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Return Home CTA Section */}
      <section className="bg-sun-gold px-6 py-16 md:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInView className="space-y-6">
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] uppercase leading-[0.9] tracking-tight text-sun-cocoa">
              Ready to find your glow?
            </h2>
            <p className="font-body text-lg leading-relaxed text-sun-cocoa/80 max-w-xl mx-auto">
              Sometimes getting lost is exactly what we need to find our way back to ourselves.
            </p>
            <div className="pt-4">
              <Link href="/">
                <Button className="bg-sun-plum text-white hover:bg-sun-plum/90">
                  Return Home
                </Button>
              </Link>
            </div>
            <p className="font-body text-sm text-sun-cocoa/60 pt-2">
              Move like it is already yours.
            </p>
          </FadeInView>
        </div>
      </section>
    </main>
  );
}
