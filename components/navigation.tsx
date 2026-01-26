'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { getActiveNavItems, FEATURES } from '@/lib/features';

// Navigation items controlled by feature flags in lib/features.ts
const navItems = getActiveNavItems();

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state for styling
      setScrolled(currentScrollY > 20);

      // Show nav when at top or scrolling up, hide when scrolling down
      if (currentScrollY < 20) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down (only hide after 100px)
        setVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when route changes or escape key pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className={`transition-all duration-500 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-xl rounded-full shadow-lg shadow-sun-gold/30 border border-sun-gold/40 mx-4 px-4 md:px-6 py-2 max-w-5xl mx-auto mt-4'
            : 'bg-transparent max-w-7xl mx-auto px-4 md:px-6 py-3'
        }`}>
          <div className="flex items-center justify-between gap-4">
            {/* Logo + Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-sun-gold/40 rounded-full blur-md group-hover:blur-lg group-hover:bg-sun-gold/60 transition-all duration-300" />
                <Image
                  src="/logo.png"
                  alt="The Sunshine Effect"
                  width={44}
                  height={44}
                  className="relative transition-all group-hover:scale-105"
                />
              </div>
              <span className="font-subhead text-lg md:text-xl font-bold uppercase tracking-wide text-sun-plum group-hover:text-sun-plum/80 transition-colors">
                {scrolled ? (
                  <span className="hidden sm:inline">Sunshine</span>
                ) : (
                  <span className="hidden sm:inline">The Sunshine Effect</span>
                )}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-semibold text-sun-cocoa hover:text-sun-plum transition-all duration-300 rounded-full hover:bg-sun-gold/20 hover:shadow-[0_0_20px_rgba(246,196,83,0.4)] group"
                >
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sun-gold rounded-full transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            {!FEATURES.landingPageMode && (
              <div className="hidden lg:block flex-shrink-0">
                <Link href="/launch">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-sun-plum to-sun-coral text-white hover:shadow-[0_0_25px_rgba(110,5,77,0.5)] transition-all duration-300 rounded-full px-6"
                  >
                    {scrolled ? 'Join' : 'Join the Journey'}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {!FEATURES.landingPageMode && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-sun-plum hover:text-sun-plum/80 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-sun-cocoa/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-20 left-4 right-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-sun-gold/20 border border-sun-gold/40 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative px-4 py-3 text-lg font-medium text-sun-cocoa hover:text-sun-plum hover:bg-sun-plum/5 transition-all duration-300 rounded-xl group"
                >
                  <span className="relative inline-flex items-center gap-2">
                    <span className="w-0 h-0.5 bg-sun-plum rounded-full transition-all duration-300 group-hover:w-3" />
                    {item.label}
                  </span>
                </Link>
              ))}

              {/* Mobile CTA */}
              <div className="mt-4 pt-4 border-t border-sun-gold/30">
                <Link href="/launch" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-sun-plum to-sun-coral text-white hover:shadow-[0_0_25px_rgba(110,5,77,0.5)] transition-all duration-300 rounded-full">
                    Join the Journey
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
