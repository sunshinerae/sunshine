'use client';

import { useEffect, useState } from 'react';

interface SpotsCounterProps {
  initial?: number;
}

export function SpotsCounter({ initial = 12 }: SpotsCounterProps) {
  const [spots, setSpots] = useState(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpots((prev) => {
        if (prev <= 3 || Math.random() > 0.7) return prev;
        return prev - 1;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-subhead uppercase tracking-[0.12em] text-sm text-sun-cream flex items-center gap-2 animate-pulse">
      Only {spots} spots remaining · 2 people viewing now
    </div>
  );
}
