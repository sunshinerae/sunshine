import { cn } from '@/lib/utils';

type Level = 'h1' | 'h2' | 'h3';

const styles: Record<Level, string> = {
  h1: 'font-headline text-[clamp(2.8rem,6vw,4.6rem)] uppercase',
  h2: 'font-subhead text-4xl md:text-5xl uppercase',
  h3: 'font-headline text-2xl md:text-3xl uppercase',
};

interface BrandHeadlineProps {
  level?: Level;
  children: React.ReactNode;
  className?: string;
}

export function BrandHeadline({ level = 'h2', children, className }: BrandHeadlineProps) {
  const Component = level;

  return (
    <Component className={cn(styles[level], className)}>
      {children}
    </Component>
  );
}
