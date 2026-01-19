'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SOCIAL_LINKS } from '@/lib/constants';
import { getActiveNavItems, FEATURES } from '@/lib/features';

export function Footer() {
  const year = new Date().getFullYear();
  const navItems = getActiveNavItems();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubmitting, setFooterSubmitting] = useState(false);
  const [footerSubmitted, setFooterSubmitted] = useState(false);

  return (
    <footer className="bg-sunshine-orange text-sunshine-white border-t border-sunshine-brown">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm">
            The Sunshine Effect
          </p>
          <p className="font-headline text-3xl leading-tight">
            Glow from the heart, together.
          </p>
          <p className="text-sm leading-relaxed">
            Weekly love notes, event invites, and gentle reminders that discipline is self love in motion.
          </p>
          <div className="flex items-center gap-4 pt-3">
            <Link href={SOCIAL_LINKS.instagram} aria-label="Instagram" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-sunshine-orange rounded-full transition-transform hover:scale-110">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sunshine-yellow text-sunshine-brown font-semibold">
                IG
              </span>
            </Link>
            <Link href={SOCIAL_LINKS.linkedin} aria-label="LinkedIn" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine-blue focus-visible:ring-offset-2 focus-visible:ring-offset-sunshine-orange rounded-full transition-transform hover:scale-110">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sunshine-blue text-sunshine-brown font-semibold">
                In
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
                  className="text-sm font-medium hover:text-sunshine-yellow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-sunshine-orange rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4">
              <p className="text-sm">
                Move like it&apos;s already yours—start with one small ritual today.
              </p>
            </div>
          </div>
        )}

        {FEATURES.emailSignup && (
          <div className="space-y-3">
            <p className="font-subhead uppercase tracking-[0.14em] text-sm">
              Join the Consistent Bulletin
            </p>
            <p className="text-sm leading-relaxed">
              Two notes per week: practices to stay resourced, aligned event invites, and community updates.
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
                    className="bg-sunshine-white text-sunshine-brown placeholder:text-sunshine-brown/60 border-2 border-sunshine-purple"
                    aria-label="Email address for newsletter"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={footerSubmitting}
                    className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-yellow hover:text-sunshine-brown disabled:opacity-50"
                  >
                    {footerSubmitting ? 'Joining...' : 'Join'}
                  </Button>
                </form>
                <p className="text-xs">
                  We celebrate consent. Unsubscribe anytime. No spam, ever. <Link href="/privacy" className="underline hover:text-sunshine-yellow transition-colors">Privacy Policy</Link>
                </p>
              </>
            ) : (
              <div className="bg-sunshine-yellow text-sunshine-purple rounded-lg p-4">
                <p className="font-semibold text-sm">✨ You&apos;re in!</p>
                <p className="text-xs mt-1">Check your inbox for a warm welcome.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-sunshine-brown">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <p className="font-medium">© {year} The Sunshine Effect</p>
            <Link href="/privacy" className="text-xs hover:text-sunshine-yellow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-sunshine-orange rounded-sm">
              Privacy Policy
            </Link>
          </div>
          <div className="flex gap-4">
            {FEATURES.fullContact && (
              <Link href="/contact" className="hover:text-sunshine-yellow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-sunshine-orange rounded-sm">Work With Sunshine</Link>
            )}
            {FEATURES.events && (
              <Link href="/events" className="hover:text-sunshine-yellow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-sunshine-orange rounded-sm">Explore Events</Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
