'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NAV_LINKS, HOME_SECTIONS } from '@/lib/constants';
import { useActiveSection } from '@/lib/hooks/use-active-section';

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(HOME_SECTIONS);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-sunshine-white ${
        scrolled ? 'border-b-2 border-sunshine-purple' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo + Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sunshine-purple text-sunshine-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-subhead text-xl font-bold uppercase tracking-wide text-sunshine-purple group-hover:text-sunshine-orange transition-colors hidden sm:inline">
              The Sunshine Effect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isPageActive = pathname === link.href;
              const isSectionActive = isHomePage && link.section && activeSection === link.section;
              const active = isPageActive || isSectionActive;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-sm font-medium transition-colors relative group tracking-wide ${
                    active ? 'text-sunshine-purple' : 'text-sunshine-brown hover:text-sunshine-purple'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-1/2 h-0.5 bg-sunshine-yellow transition-all duration-300 ${
                    active ? 'w-full left-0' : 'w-0 group-hover:w-full group-hover:left-0'
                  }`} />
                </Link>
              );
            })}
          </nav>

          {/* CTA + Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden sm:block">
              <Button size="sm" className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange transition-colors">
                Work With Sunshine
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-sunshine-purple">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[360px] p-8 bg-sunshine-purple text-sunshine-white">
                <div className="flex items-center gap-3 mb-10 mt-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sunshine-yellow text-sunshine-brown">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <span className="font-subhead text-xl font-bold uppercase tracking-wide">
                    The Sunshine Effect
                  </span>
                </div>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="mb-8 block"
                >
                  <Button className="w-full bg-sunshine-yellow text-sunshine-brown hover:bg-sunshine-blue">
                    Work With Sunshine
                  </Button>
                </Link>
                <nav className="flex flex-col gap-5 pl-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-sunshine-white hover:text-sunshine-yellow transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
