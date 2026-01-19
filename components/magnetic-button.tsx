import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MagneticButtonProps = React.ComponentProps<typeof Button>;

export function MagneticButton({ className, children, ...props }: MagneticButtonProps) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.15, y: y * 0.15 });
  };

  return (
    <Button
      {...props}
      className={cn('bg-sun-plum text-white hover:bg-sun-plum/90 rounded-[14px] transition-transform duration-200 will-change-transform', className)}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </Button>
  );
}
