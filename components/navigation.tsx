'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Offerings', href: '/offerings' },
  { label: 'Events', href: '/events' },
  { label: 'Community', href: '/community' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

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
            ? 'bg-sun-cream rounded-full shadow-xl shadow-sun-plum/20 border-2 border-sun-plum mx-4 px-4 md:px-6 py-2 max-w-5xl mx-auto mt-4'
            : 'bg-sun-cream max-w-7xl mx-auto px-4 md:px-6 py-3'
        }`}>
          <div className="flex items-center justify-between gap-4">
            {/* Logo + Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sun-plum text-white transition-all">
                <Sparkles className="h-5 w-5" />
              </span>
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
                  className="relative px-3 py-2 text-sm font-medium text-sun-cocoa hover:text-sun-plum transition-all duration-300 rounded-full hover:bg-sun-plum/5 group"
                >
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sun-plum rounded-full transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden lg:block flex-shrink-0">
              <Link href="/launch">
                <Button
                  size="sm"
                  className="bg-sun-plum text-white hover:bg-sun-plum/90 transition-colors rounded-[14px]"
                >
                  {scrolled ? 'Join' : 'Join the Journey'}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
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
          <div className="absolute top-20 left-4 right-4 bg-sun-cream rounded-2xl shadow-xl border-2 border-sun-plum p-6 animate-in fade-in slide-in-from-top-4 duration-300">
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
              <div className="mt-4 pt-4 border-t border-sun-plum/20">
                <Link href="/launch" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-sun-plum text-white hover:bg-sun-plum/90 transition-colors rounded-[14px]">
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
