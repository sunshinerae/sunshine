'use client';

import { useEffect, useState } from 'react';
import { BrandCard } from '@/components/brand-card';
import { Button } from '@/components/ui/button';

const affirmations = [
  'You are allowed to rest without earning it.',
  'Your pace is not falling behind.',
  'Gentle progress is still progress.',
  'Discipline is self love in motion.',
  'Real power does not have to push or prove.',
];

export function FloatingAffirmation() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex(new Date().getDate() % affirmations.length);
      setVisible(true);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="hidden lg:block fixed bottom-4 right-4 z-40 animate-slide-in">
      <BrandCard variant="yellow" className="max-w-xs shadow-lg p-6 overflow-hidden">
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="font-headline text-lg leading-[0.9] tracking-tight">Today&apos;s reminder</p>
            <p className="font-body leading-relaxed mt-2">{affirmations[index]}</p>
          </div>
          <button
            aria-label="Dismiss affirmation"
            className="text-sun-cocoa/70 hover:text-sun-cocoa"
            onClick={() => setVisible(false)}
          >
            ✕
          </button>
        </div>
        <Button size="sm" variant="glow-purple" className="mt-4">
          Save to phone
        </Button>
      </BrandCard>
    </div>
  );
}
