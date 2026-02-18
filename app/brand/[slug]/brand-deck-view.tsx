'use client';

import { useEffect } from 'react';
import { BrandDeckPages } from '@/lib/brand-decks/pages';
import type { DeckData } from '@/lib/brand-decks/pages';

export function BrandDeckView({ data }: { data: DeckData }) {
  useEffect(() => {
    const fonts = [data.headingFont, data.bodyFont].filter(Boolean);
    const unique = [...new Set(fonts)];
    if (unique.length === 0) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${unique.map(f => `family=${encodeURIComponent(f)}:wght@400;600;700`).join('&')}&display=swap`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [data.headingFont, data.bodyFont]);

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <BrandDeckPages data={data} />
      </div>
      <footer className="text-center py-8 text-zinc-400 text-sm">
        Created with Sunshine Brand Studio
      </footer>
    </div>
  );
}
