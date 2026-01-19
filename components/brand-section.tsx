import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'plum' | 'coral' | 'gold' | 'cream';

const variants: Record<Variant, string> = {
  plum: 'bg-sun-plum text-white',
  coral: 'bg-sun-coral text-sun-cocoa',
  gold: 'bg-sun-gold text-sun-cocoa',
  cream: 'bg-sun-cream text-sun-cocoa',
};

interface BrandSectionProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function BrandSection({ variant = 'cream', className = '', children }: BrandSectionProps) {
  return (
    <section className={cn('px-6 py-16', variants[variant], className)}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}
