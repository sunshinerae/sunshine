'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SOCIAL_LINKS } from '@/lib/constants';
import { getActiveNavItems, FEATURES } from '@/lib/features';

export function Footer() {
  const year = 2025;
  const navItems = getActiveNavItems();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubmitting, setFooterSubmitting] = useState(false);
  const [footerSubmitted, setFooterSubmitted] = useState(false);

  return (
    <footer className="relative text-white border-t border-sun-gold/30 overflow-hidden">
      {/* Elegant gradient background - inverted */}
      <div className="absolute inset-0 bg-gradient-to-b from-sun-coral/80 via-sun-plum to-[#4a0336]" />
      <div className="absolute inset-0 bg-gradient-to-r from-sun-plum/50 via-transparent to-sun-plum/50" />
      {/* Subtle glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-sun-gold/15 blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-sun-plum/30 blur-[80px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="The Sunshine Effect"
              width={48}
              height={48}
            />
            <p className="font-subhead uppercase tracking-[0.14em] text-sm">
              The Sunshine Effect
            </p>
          </div>
          <div className="flex items-center gap-4 pt-3">
            <Link href={SOCIAL_LINKS.instagram} aria-label="Instagram" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sun-plum rounded-full transition-transform hover:scale-110">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sun-gold text-sun-cocoa font-semibold">
                IG
              </span>
            </Link>
          </div>
        </div>

        {navItems.length > 1 && (
          <div className="space-y-4">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm">
              Navigation
            </p>
            <nav className="grid grid-cols-2 gap-3">
              {navItems.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium hover:text-sun-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sun-plum rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4">
              <p className="text-sm">
                Your next chapter starts here.
              </p>
            </div>
          </div>
        )}

        {FEATURES.emailSignup && (
          <div className="space-y-3">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm">
              In My Orbit ✨
            </p>
            <p className="text-sm leading-relaxed">
              Event invites, updates on what I&apos;m building, and weekly momentum for ambitious women.
            </p>
            {!footerSubmitted ? (
              <>
                <form
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!footerEmail) return;

                    setFooterSubmitting(true);
                    try {
                      await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'newsletter', email: footerEmail }),
                      });
                      setFooterSubmitted(true);
                      setFooterEmail('');
                    } catch (error) {
                      console.error('Footer subscription error:', error);
                    } finally {
                      setFooterSubmitting(false);
                    }
                  }}
                >
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    disabled={footerSubmitting}
                    className="bg-sun-paper text-sun-cocoa placeholder:text-sun-cocoa/60 border-2 border-sun-sand"
                    aria-label="Email address for newsletter"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={footerSubmitting}
                    className="bg-sun-gold text-sun-cocoa hover:bg-sun-gold/90 disabled:opacity-50"
                  >
                    {footerSubmitting ? 'Joining...' : 'Join'}
                  </Button>
                </form>
                <p className="text-xs">
                  We celebrate consent. Unsubscribe anytime. No spam, ever. <Link href="/privacy" className="underline hover:text-sun-gold transition-colors">Privacy Policy</Link>
                </p>
              </>
            ) : (
              <div className="bg-sun-gold text-sun-cocoa rounded-lg p-4">
                <p className="font-semibold text-sm">✨ You&apos;re in the orbit!</p>
                <p className="text-xs mt-1">Welcome. Check your inbox.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative z-10 border-t border-sun-gold/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <p className="font-medium">© {year} The Sunshine Effect</p>
            <Link href="/privacy" className="text-xs hover:text-sun-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sun-plum rounded-sm">
              Privacy Policy
            </Link>
          </div>
          {!FEATURES.landingPageMode && (
            <div className="flex gap-4">
              {FEATURES.fullContact && (
                <Link href="/contact" className="hover:text-sun-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sun-plum rounded-sm">Get in Touch</Link>
              )}
              {FEATURES.events && (
                <Link href="/events" className="hover:text-sun-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sun-plum rounded-sm">Explore Events</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
