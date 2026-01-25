"use client";

import { useEffect, useRef } from "react";

export function ViewportVideo({
  src,
  poster,
  className = "",
  playbackRate = 0.5,
}: {
  src: string;
  poster?: string;
  className?: string;
  playbackRate?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.playbackRate = playbackRate;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.25;
        if (visible) {
          el.playbackRate = playbackRate;
          const p = el.play();
          if (p) p.catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: [0, 0.25, 0.5, 1] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [playbackRate]);

  return (
    <video
      ref={ref}
      muted
      playsInline
      loop
      preload="metadata"
      poster={poster}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      aria-hidden="true"
      disablePictureInPicture
      disableRemotePlayback
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
