import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'purple' | 'orange' | 'yellow' | 'white';

const variants: Record<Variant, string> = {
  purple: 'bg-sunshine-purple text-sunshine-white',
  orange: 'bg-sunshine-orange text-sunshine-white',
  yellow: 'bg-sunshine-yellow text-sunshine-brown',
  white: 'bg-sunshine-white text-sunshine-brown',
};

interface BrandSectionProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function BrandSection({ variant = 'white', className = '', children }: BrandSectionProps) {
  return (
    <section className={cn('px-6 py-16', variants[variant], className)}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}
