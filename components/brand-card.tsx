import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'purple' | 'orange' | 'yellow' | 'white';

const variants: Record<Variant, string> = {
  purple: 'bg-sunshine-purple text-sunshine-white border-2 border-sunshine-yellow',
  orange: 'bg-sunshine-orange text-sunshine-white border-2 border-sunshine-blue',
  yellow: 'bg-sunshine-yellow text-sunshine-brown border-2 border-sunshine-purple',
  white: 'bg-sunshine-white text-sunshine-brown border-2 border-sunshine-purple',
};

interface BrandCardProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function BrandCard({ variant = 'purple', className = '', children }: BrandCardProps) {
  return (
    <div className={cn('rounded-2xl p-8', variants[variant], className)}>
      {children}
    </div>
  );
}
