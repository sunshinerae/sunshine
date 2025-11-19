import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sunshine-orange text-sunshine-white border-t border-sunshine-brown">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm">
            The Sunshine Effect
          </p>
          <h3 className="font-headline text-3xl leading-tight">
            Glow from the heart, together.
          </h3>
          <p className="text-sm leading-relaxed">
            Weekly love notes, event invites, and gentle reminders that discipline is self love in motion.
          </p>
          <div className="flex items-center gap-4 pt-3">
            <Link href={SOCIAL_LINKS.instagram} aria-label="Instagram">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sunshine-yellow text-sunshine-brown font-semibold">
                IG
              </span>
            </Link>
            <Link href={SOCIAL_LINKS.linkedin} aria-label="LinkedIn">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sunshine-blue text-sunshine-brown font-semibold">
                In
              </span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm">
            Navigation
          </p>
          <nav className="grid grid-cols-2 gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-sunshine-yellow"
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

        <div className="space-y-3">
          <p className="font-subhead uppercase tracking-[0.14em] text-sm">
            Join the Consistent Bulletin
          </p>
          <p className="text-sm leading-relaxed">
            Two notes per week: practices to stay resourced, aligned event invites, and community updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="you@example.com"
              className="bg-sunshine-white text-sunshine-brown placeholder:text-sunshine-brown/60 border-2 border-sunshine-purple"
              aria-label="Email address"
            />
            <Button type="button" className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-yellow hover:text-sunshine-brown">
              Join
            </Button>
          </form>
          <p className="text-xs">
            We celebrate consent. Unsubscribe anytime. No spam, ever.
          </p>
        </div>
      </div>
      <div className="border-t border-sunshine-brown">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="font-medium">© {year} The Sunshine Effect</p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-sunshine-yellow">Work With Sunshine</Link>
            <Link href="/events" className="hover:text-sunshine-yellow">Explore Events</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
