'use client';

import { motion } from 'framer-motion';

interface ZoneDividerProps {
  from: 'golden-hour' | 'lunar-room';
  to: 'golden-hour' | 'lunar-room';
}

export function ZoneDivider({ from, to }: ZoneDividerProps) {
  const isGoldenToLunar = from === 'golden-hour' && to === 'lunar-room';

  // Colors based on transition direction
  const fromBg = isGoldenToLunar ? 'bg-sunshine-orange' : 'bg-sunshine-purple';
  const toBg = isGoldenToLunar ? 'bg-sunshine-purple' : 'bg-sunshine-orange';
  const fromColor = isGoldenToLunar ? '#D4510B' : '#6E054D';
  const toColor = isGoldenToLunar ? '#6E054D' : '#D4510B';
  const accentColor = isGoldenToLunar ? '#FFC619' : '#95D7E6';

  return (
    <div className={`relative h-32 md:h-48 ${fromBg} overflow-hidden`}>
      {/* SVG Wave Divider */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="zoneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="50%" stopColor={accentColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>

        {/* Main wave shape - fills bottom half with destination color */}
        <path
          d="M0,100 C240,150 480,50 720,100 C960,150 1200,50 1440,100 L1440,200 L0,200 Z"
          fill={toColor}
        />

        {/* Accent wave - subtle overlay */}
        <path
          d="M0,120 C360,80 720,160 1080,100 C1260,70 1380,110 1440,90 L1440,200 L0,200 Z"
          fill={toColor}
          opacity="0.5"
        />
      </svg>

      {/* Decorative celestial elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Transition symbol - sun setting into moon rising */}
        <div className="relative">
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
              width: '120px',
              height: '120px',
              marginLeft: '-60px',
              marginTop: '-60px',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Central orb representing transition */}
          <motion.div
            className="relative w-16 h-16 md:w-20 md:h-20 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${fromColor} 0%, ${accentColor} 50%, ${toColor} 100%)`,
              boxShadow: `0 0 40px ${accentColor}60`,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>

      {/* Decorative sparkles/stars for lunar transition */}
      {isGoldenToLunar && (
        <>
          <motion.div
            className="absolute top-8 left-1/4 w-1.5 h-1.5 rounded-full bg-sunshine-white/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />
          <motion.div
            className="absolute top-12 right-1/3 w-1 h-1 rounded-full bg-sunshine-white/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
          />
          <motion.div
            className="absolute top-6 right-1/4 w-2 h-2 rounded-full bg-sunshine-blue/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.7 }}
          />
        </>
      )}

      {/* Subtle rays for golden transition */}
      {!isGoldenToLunar && (
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-16 opacity-20"
          style={{
            background: `radial-gradient(ellipse at bottom, ${accentColor} 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      )}
    </div>
  );
}
