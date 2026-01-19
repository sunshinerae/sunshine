'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className={`transition-all duration-500 ${
        scrolled
          ? 'bg-sunshine-white rounded-full shadow-xl shadow-sunshine-purple/20 border-2 border-sunshine-purple mx-4 px-6 py-2 max-w-4xl mx-auto mt-4'
          : 'bg-sunshine-white max-w-7xl mx-auto px-6 py-3'
      }`}>
        <div className="flex items-center justify-between gap-6">
          {/* Logo + Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sunshine-purple text-sunshine-white transition-all">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-subhead text-xl font-bold uppercase tracking-wide text-sunshine-purple group-hover:text-sunshine-orange transition-colors">
              {scrolled ? (
                <span className="hidden sm:inline">Sunshine</span>
              ) : (
                <span className="hidden sm:inline">The Sunshine Effect</span>
              )}
            </span>
          </Link>

          {/* CTA Button */}
          <Link href="/launch">
            <Button
              size="sm"
              className="bg-sunshine-purple text-sunshine-white hover:bg-sunshine-orange transition-colors"
            >
              <span className="hidden sm:inline">{scrolled ? 'Join' : 'Join the Journey'}</span>
              <span className="sm:hidden">Join</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
