'use client';

interface MockupProps {
  brandName: string;
  tagline?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  headingFont?: string;
  bodyFont?: string;
  moodBoardImage?: string;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function BrandInitial({ name, colors, size = 40 }: { name: string; colors: MockupProps['colors']; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: colors.primary,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.45,
        flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function GradientRect({ colors, className, style }: { colors: MockupProps['colors']; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
        ...style,
      }}
    />
  );
}

function PlaceholderLine({ width = '100%', height = 8, color = '#e4e4e7' }: { width?: string | number; height?: number; color?: string }) {
  return <div style={{ width, height, backgroundColor: color, borderRadius: 4 }} />;
}

// ---------------------------------------------------------------------------
// 1. InstagramPostMockup
// ---------------------------------------------------------------------------

export function InstagramPostMockup({ brandName, tagline, colors, headingFont, moodBoardImage }: MockupProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg w-full max-w-[300px]" style={{ fontSize: 13 }}>
      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2">
        <BrandInitial name={brandName} colors={colors} size={28} />
        <span className="font-semibold text-zinc-900 truncate" style={{ fontFamily: headingFont }}>
          {brandName}
        </span>
      </div>

      {/* Image area */}
      {moodBoardImage ? (
        <img src={moodBoardImage} alt="Post" className="w-full aspect-square object-cover" />
      ) : (
        <GradientRect colors={colors} className="w-full aspect-square" />
      )}

      {/* Action icons */}
      <div className="flex items-center gap-4 px-3 pt-2">
        {/* Heart */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {/* Comment */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {/* Share */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </div>

      {/* Caption */}
      <div className="px-3 py-2">
        <span className="font-bold text-zinc-900" style={{ fontFamily: headingFont }}>
          {brandName}
        </span>{' '}
        <span className="text-zinc-600">{tagline || 'Your caption goes here...'}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. InstagramProfileMockup
// ---------------------------------------------------------------------------

export function InstagramProfileMockup({ brandName, tagline, colors, headingFont, bodyFont }: MockupProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg w-full max-w-[300px]" style={{ fontSize: 13 }}>
      {/* Profile header */}
      <div className="flex items-center gap-4 px-4 pt-4 pb-2">
        <BrandInitial name={brandName} colors={colors} size={56} />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-zinc-900 truncate text-sm" style={{ fontFamily: headingFont }}>
            {brandName}
          </div>
          <div className="text-zinc-500 truncate text-xs" style={{ fontFamily: bodyFont }}>
            {tagline || 'Your brand tagline'}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 text-center py-3 border-b border-zinc-100">
        {[
          { label: 'Posts', value: '142' },
          { label: 'Followers', value: '10.4K' },
          { label: 'Following', value: '328' },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="font-bold text-zinc-900 text-sm">{stat.value}</div>
            <div className="text-zinc-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Grid thumbnails */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="aspect-square"
            style={{
              background: `linear-gradient(${135 + i * 30}deg, ${colors.primary}, ${i % 2 === 0 ? colors.secondary : colors.accent})`,
              opacity: 0.75 + (i % 3) * 0.08,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. BusinessCardMockup
// ---------------------------------------------------------------------------

export function BusinessCardMockup({ brandName, tagline, colors, headingFont, bodyFont }: MockupProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[360px]">
      {/* Front */}
      <div
        className="rounded-lg shadow-md overflow-hidden"
        style={{
          aspectRatio: '3.5 / 2',
          backgroundColor: colors.background,
          color: colors.text,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '24px 28px',
          position: 'relative',
        }}
      >
        <div style={{ fontFamily: headingFont, fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
          {brandName}
        </div>
        {tagline && (
          <div style={{ fontFamily: bodyFont, fontSize: 12, opacity: 0.75 }}>
            {tagline}
          </div>
        )}
        {/* Accent bar at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: colors.accent,
          }}
        />
      </div>

      {/* Back */}
      <div
        className="rounded-lg shadow-md overflow-hidden"
        style={{
          aspectRatio: '3.5 / 2',
          backgroundColor: colors.primary,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '24px 28px',
          position: 'relative',
        }}
      >
        <div style={{ fontFamily: headingFont, fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
          Contact
        </div>
        <div className="flex flex-col gap-1.5" style={{ fontFamily: bodyFont, fontSize: 11, opacity: 0.9 }}>
          <div>Jane Doe, Founder</div>
          <div>hello@{brandName.toLowerCase().replace(/\s+/g, '')}.com</div>
          <div>(555) 123-4567</div>
          <div>www.{brandName.toLowerCase().replace(/\s+/g, '')}.com</div>
        </div>
        {/* Secondary color bar at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: colors.secondary,
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. LetterheadMockup
// ---------------------------------------------------------------------------

export function LetterheadMockup({ brandName, colors, headingFont, bodyFont }: MockupProps) {
  return (
    <div
      className="rounded-lg shadow-lg overflow-hidden w-full max-w-[300px]"
      style={{
        aspectRatio: '1 / 1.414',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px 16px',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div style={{ fontFamily: headingFont, fontWeight: 700, fontSize: 16, color: colors.primary }}>
          {brandName}
        </div>
      </div>
      <div style={{ height: 3, backgroundColor: colors.accent, borderRadius: 2, marginBottom: 20 }} />

      {/* Body lines */}
      <div className="flex flex-col gap-2.5 flex-1" style={{ fontFamily: bodyFont }}>
        <PlaceholderLine width="40%" color={colors.text + '30'} />
        <div style={{ height: 6 }} />
        <PlaceholderLine width="100%" color={colors.text + '18'} />
        <PlaceholderLine width="95%" color={colors.text + '18'} />
        <PlaceholderLine width="88%" color={colors.text + '18'} />
        <PlaceholderLine width="92%" color={colors.text + '18'} />
        <PlaceholderLine width="60%" color={colors.text + '18'} />
        <div style={{ height: 6 }} />
        <PlaceholderLine width="100%" color={colors.text + '18'} />
        <PlaceholderLine width="97%" color={colors.text + '18'} />
        <PlaceholderLine width="85%" color={colors.text + '18'} />
        <PlaceholderLine width="45%" color={colors.text + '18'} />
        <div style={{ height: 6 }} />
        <PlaceholderLine width="30%" color={colors.text + '30'} />
        <PlaceholderLine width="25%" color={colors.text + '18'} />
      </div>

      {/* Footer line */}
      <div style={{ height: 2, backgroundColor: colors.primary, borderRadius: 2, opacity: 0.35, marginTop: 12 }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. EmailSignatureMockup
// ---------------------------------------------------------------------------

export function EmailSignatureMockup({ brandName, colors, headingFont, bodyFont }: MockupProps) {
  return (
    <div
      className="rounded-lg shadow-lg overflow-hidden w-full max-w-[400px]"
      style={{
        backgroundColor: '#fff',
        padding: '16px 20px',
        fontSize: 12,
      }}
    >
      {/* Separator above signature */}
      <div style={{ height: 1, backgroundColor: '#e4e4e7', marginBottom: 12 }} />

      <div className="flex items-start gap-3">
        {/* Accent bar */}
        <div
          style={{
            width: 3,
            alignSelf: 'stretch',
            backgroundColor: colors.accent,
            borderRadius: 2,
            flexShrink: 0,
          }}
        />

        <div className="flex flex-col gap-1">
          {/* Name & title */}
          <div style={{ fontFamily: headingFont, fontWeight: 700, fontSize: 14, color: colors.primary }}>
            Jane Doe
          </div>
          <div style={{ fontFamily: bodyFont, color: '#71717a', fontSize: 11 }}>
            Founder &amp; CEO
          </div>
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 600,
              fontSize: 12,
              color: colors.accent,
              marginBottom: 4,
            }}
          >
            {brandName}
          </div>

          {/* Contact details */}
          <div className="flex flex-col gap-0.5" style={{ fontFamily: bodyFont, color: '#52525b', fontSize: 11 }}>
            <div>hello@{brandName.toLowerCase().replace(/\s+/g, '')}.com</div>
            <div>(555) 123-4567</div>
            <div>www.{brandName.toLowerCase().replace(/\s+/g, '')}.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. WebsiteHeroMockup
// ---------------------------------------------------------------------------

export function WebsiteHeroMockup({ brandName, tagline, colors, headingFont, bodyFont, moodBoardImage }: MockupProps) {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden w-full max-w-[480px] bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 border-b border-zinc-200">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        {/* Address bar */}
        <div className="flex-1 bg-white rounded text-xs text-zinc-400 px-3 py-1 truncate" style={{ fontFamily: bodyFont }}>
          www.{brandName.toLowerCase().replace(/\s+/g, '')}.com
        </div>
      </div>

      {/* Hero section */}
      <div
        className="relative flex flex-col items-center justify-center text-center px-8 py-16"
        style={{
          background: moodBoardImage
            ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${moodBoardImage}) center/cover`
            : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          minHeight: 200,
        }}
      >
        <h1
          style={{
            fontFamily: headingFont,
            fontWeight: 800,
            fontSize: 28,
            color: '#fff',
            marginBottom: 8,
            lineHeight: 1.15,
          }}
        >
          {brandName}
        </h1>
        {tagline && (
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: 14,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: 20,
              maxWidth: 320,
            }}
          >
            {tagline}
          </p>
        )}
        <button
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 13,
            backgroundColor: colors.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 28px',
            cursor: 'pointer',
          }}
        >
          Get Started
        </button>
      </div>

      {/* Minimal body hint */}
      <div className="px-8 py-6 flex flex-col gap-2">
        <PlaceholderLine width="50%" color={colors.text + '20'} />
        <PlaceholderLine width="100%" color={colors.text + '10'} />
        <PlaceholderLine width="90%" color={colors.text + '10'} />
        <PlaceholderLine width="70%" color={colors.text + '10'} />
      </div>
    </div>
  );
}
