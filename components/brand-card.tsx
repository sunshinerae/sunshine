import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'purple' | 'orange' | 'yellow' | 'white';
type Decoration = 'none' | 'tape' | 'sticker';

const variants: Record<Variant, string> = {
  purple: 'bg-sun-plum text-white border border-sun-gold',
  orange: 'bg-sun-coral text-sun-cocoa border border-sun-sand',
  yellow: 'bg-sun-gold text-sun-cocoa border border-sun-plum',
  white: 'bg-sun-paper text-sun-cocoa border border-sun-sand shadow-soft',
};

interface BrandCardProps {
  variant?: Variant;
  decoration?: Decoration;
  className?: string;
  children: ReactNode;
}

export function BrandCard({
  variant = 'purple',
  decoration = 'none',
  className = '',
  children
}: BrandCardProps) {
  return (
    <div className={cn(
      'rounded-[2rem] p-10 transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] relative overflow-hidden',
      variants[variant],
      className
    )}>
      {/* Optional tape decoration */}
      {decoration === 'tape' && (
        <div className="absolute top-4 right-4 w-20 h-6 bg-sun-gold/40 -rotate-12 rounded-sm border border-sun-cocoa/10" />
      )}

      {/* Optional sticker decoration */}
      {decoration === 'sticker' && (
        <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-sun-coral border-2 border-white" />
      )}

      {children}
    </div>
  );
}
