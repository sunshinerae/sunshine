'use client';

// ---------------------------------------------------------------------------
// Brand Deck Page Components
// Each page renders at letter-size ratio (8.5:11) for print-like layout.
// ---------------------------------------------------------------------------

interface DeckData {
  title: string;
  intake: {
    businessName: string;
    industry: string;
    keywords: string;
    about: string;
    logoDataUrl?: string;
  } | null;
  identity: {
    brandStory: string;
    mission: string;
    vision: string;
    values: { name: string; description: string }[];
    personality: { trait: string; description: string }[];
  } | null;
  audience: {
    personas: {
      name: string;
      ageRange: string;
      occupation: string;
      location: string;
      painPoints: string[];
      goals: string[];
      channels: string[];
    }[];
  } | null;
  voice: {
    toneAttributes: string[];
    elevatorPitch: string;
    taglines: string[];
    messagingPillars: { title: string; description: string }[];
    voiceGuide: { dos: string[]; donts: string[] };
    examplePhrases: string[];
  } | null;
  colors: { primary: string; secondary: string; accent: string; background: string; text: string };
  darkColors: { primary: string; secondary: string; accent: string; background: string; text: string } | null;
  colorPsychology?: string;
  headingFont: string;
  bodyFont: string;
  moodBoardImages: { url: string; alt: string; photographer: string }[];
  photoNotes?: string;
  motion: { style: string; speed: string; notes: string } | null;
}

interface PageProps {
  data: DeckData;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function PageShell({
  children,
  bg = '#ffffff',
  pageNumber,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  bg?: string;
  pageNumber?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`aspect-[8.5/11] relative overflow-hidden ${className}`}
      style={{ backgroundColor: bg, padding: '48px 56px', ...style }}
    >
      {children}
      {pageNumber != null && (
        <span
          className="absolute bottom-5 right-7 text-xs"
          style={{ color: '#a1a1aa', fontVariantNumeric: 'tabular-nums' }}
        >
          {pageNumber}
        </span>
      )}
    </div>
  );
}

function SectionHeading({
  children,
  color,
  font,
  accent,
}: {
  children: React.ReactNode;
  color: string;
  font: string;
  accent: string;
}) {
  return (
    <div className="mb-6">
      <h2 style={{ fontFamily: font, fontWeight: 700, fontSize: 22, color, lineHeight: 1.3, marginBottom: 8 }}>
        {children}
      </h2>
      <div style={{ width: 48, height: 3, backgroundColor: accent, borderRadius: 2 }} />
    </div>
  );
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;
  return `${r}, ${g}, ${b}`;
}

function PlaceholderLine({ width = '100%', height = 8, color = '#e4e4e7' }: { width?: string | number; height?: number; color?: string }) {
  return <div style={{ width, height, backgroundColor: color, borderRadius: 4 }} />;
}

function BrandInitial({ name, colors, size = 40 }: { name: string; colors: DeckData['colors']; size?: number }) {
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

// ---------------------------------------------------------------------------
// 1. CoverPage
// ---------------------------------------------------------------------------

export function CoverPage({ data }: PageProps) {
  const bgImage = data.moodBoardImages[0]?.url;
  const tagline = data.voice?.taglines?.[0];
  return (
    <PageShell
      style={{
        padding: 0,
        background: bgImage
          ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bgImage}) center/cover`
          : `linear-gradient(135deg, ${data.colors.primary}, ${data.colors.secondary})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
      }}
    >
      {data.intake?.logoDataUrl && (
        <img
          src={data.intake.logoDataUrl}
          alt="Logo"
          style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 24 }}
        />
      )}
      <h1
        style={{
          fontFamily: data.headingFont,
          fontWeight: 800,
          fontSize: 42,
          lineHeight: 1.15,
          marginBottom: 12,
          padding: '0 48px',
        }}
      >
        {data.intake?.businessName || data.title}
      </h1>
      {tagline && (
        <p
          style={{
            fontFamily: data.bodyFont,
            fontSize: 16,
            opacity: 0.85,
            maxWidth: 420,
            marginBottom: 8,
            padding: '0 48px',
          }}
        >
          {tagline}
        </p>
      )}
      <p style={{ fontFamily: data.bodyFont, fontSize: 11, opacity: 0.5, marginTop: 4 }}>Brand Guidelines</p>
      <p
        className="absolute bottom-8"
        style={{ fontFamily: data.bodyFont, fontSize: 11, opacity: 0.45 }}
      >
        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 2. TableOfContentsPage
// ---------------------------------------------------------------------------

export function TableOfContentsPage({ data }: PageProps) {
  const sections: { label: string; show: boolean }[] = [
    { label: 'Brand Story', show: !!data.identity },
    { label: 'Mission & Vision', show: !!data.identity },
    { label: 'Core Values', show: !!data.identity?.values?.length },
    { label: 'Brand Personality', show: !!data.identity?.personality?.length },
    { label: 'Target Audience', show: !!data.audience?.personas?.length },
    { label: 'Elevator Pitch & Taglines', show: !!data.voice },
    { label: 'Voice Guidelines', show: !!data.voice },
    { label: 'Messaging Pillars', show: !!data.voice?.messagingPillars?.length },
    { label: 'Color Palette', show: true },
    { label: 'Dark Mode Palette', show: !!data.darkColors },
    { label: 'Color Psychology', show: !!data.colorPsychology },
    { label: 'Typography', show: true },
    { label: 'Mood Board', show: !!data.moodBoardImages?.length },
    { label: 'Social Media', show: true },
    { label: 'Business Card', show: true },
    { label: 'Letterhead', show: true },
    { label: 'Website Preview', show: true },
    { label: 'Motion Direction', show: !!data.motion },
    { label: 'Dos & Don\'ts', show: !!data.voice?.voiceGuide },
    { label: 'Quick Reference', show: true },
  ];

  const visible = sections.filter((s) => s.show);
  let pageNum = 3;

  return (
    <PageShell pageNumber={2}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Table of Contents
      </SectionHeading>
      <div className="flex flex-col gap-1 mt-4">
        {visible.map((s) => {
          const num = pageNum++;
          return (
            <div
              key={s.label}
              className="flex items-end gap-2"
              style={{ fontFamily: data.bodyFont, fontSize: 13, color: data.colors.text }}
            >
              <span>{s.label}</span>
              <span className="flex-1 border-b border-dotted" style={{ borderColor: data.colors.text + '30', marginBottom: 3 }} />
              <span style={{ opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>{num}</span>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 3. BrandStoryPage
// ---------------------------------------------------------------------------

export function BrandStoryPage({ data }: PageProps) {
  if (!data.identity) return null;
  return (
    <PageShell pageNumber={3}>
      <div className="flex flex-col h-full">
        {/* Decorative accent */}
        <div
          style={{
            width: 4,
            height: 80,
            backgroundColor: data.colors.accent,
            borderRadius: 2,
            marginBottom: 24,
          }}
        />
        <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
          Our Story
        </SectionHeading>
        <p
          className="flex-1"
          style={{
            fontFamily: data.bodyFont,
            fontSize: 14,
            lineHeight: 1.85,
            color: data.colors.text,
            whiteSpace: 'pre-line',
          }}
        >
          {data.identity.brandStory}
        </p>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 4. MissionVisionPage
// ---------------------------------------------------------------------------

export function MissionVisionPage({ data }: PageProps) {
  if (!data.identity) return null;
  return (
    <PageShell pageNumber={4}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Mission & Vision
      </SectionHeading>
      <div className="grid grid-cols-2 gap-10 mt-6">
        {/* Mission */}
        <div>
          <div
            className="mb-3 flex items-center gap-2"
            style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 15, color: data.colors.primary }}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: data.colors.primary + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              M
            </div>
            Mission
          </div>
          <p style={{ fontFamily: data.bodyFont, fontSize: 13, lineHeight: 1.75, color: data.colors.text }}>
            {data.identity.mission}
          </p>
        </div>
        {/* Vision */}
        <div>
          <div
            className="mb-3 flex items-center gap-2"
            style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 15, color: data.colors.secondary }}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: data.colors.secondary + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              V
            </div>
            Vision
          </div>
          <p style={{ fontFamily: data.bodyFont, fontSize: 13, lineHeight: 1.75, color: data.colors.text }}>
            {data.identity.vision}
          </p>
        </div>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 5. CoreValuesPage
// ---------------------------------------------------------------------------

export function CoreValuesPage({ data }: PageProps) {
  if (!data.identity?.values?.length) return null;
  const vals = data.identity.values;
  const cols = vals.length <= 4 ? 2 : 3;
  return (
    <PageShell pageNumber={5}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Core Values
      </SectionHeading>
      <div className={`grid gap-5 mt-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {vals.map((v, i) => (
          <div
            key={v.name}
            className="rounded-lg"
            style={{
              padding: '18px 16px',
              backgroundColor: data.colors.accent + '0a',
              border: `1px solid ${data.colors.accent}20`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: data.colors.accent,
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 14, color: data.colors.text }}>
                {v.name}
              </span>
            </div>
            <p style={{ fontFamily: data.bodyFont, fontSize: 11, lineHeight: 1.65, color: data.colors.text, opacity: 0.8 }}>
              {v.description}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 6. PersonaPage (one per persona)
// ---------------------------------------------------------------------------

export function PersonaPage({ data, index }: PageProps & { index: number }) {
  const persona = data.audience?.personas?.[index];
  if (!persona) return null;
  return (
    <PageShell pageNumber={6 + index}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Target Persona: {persona.name}
      </SectionHeading>

      {/* Demographics bar */}
      <div
        className="rounded-lg flex items-center gap-6 mb-6"
        style={{
          backgroundColor: data.colors.primary + '0c',
          padding: '14px 18px',
          fontFamily: data.bodyFont,
          fontSize: 12,
          color: data.colors.text,
        }}
      >
        <span><strong>Age:</strong> {persona.ageRange}</span>
        <span><strong>Role:</strong> {persona.occupation}</span>
        <span><strong>Location:</strong> {persona.location}</span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Pain points */}
        <div>
          <h4 style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 13, color: data.colors.primary, marginBottom: 8 }}>
            Pain Points
          </h4>
          <ul className="flex flex-col gap-1.5">
            {persona.painPoints.map((p) => (
              <li key={p} className="flex items-start gap-1.5" style={{ fontFamily: data.bodyFont, fontSize: 11, lineHeight: 1.55, color: data.colors.text }}>
                <span style={{ color: data.colors.accent, marginTop: 2 }}>&#x2022;</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        {/* Goals */}
        <div>
          <h4 style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 13, color: data.colors.primary, marginBottom: 8 }}>
            Goals
          </h4>
          <ul className="flex flex-col gap-1.5">
            {persona.goals.map((g) => (
              <li key={g} className="flex items-start gap-1.5" style={{ fontFamily: data.bodyFont, fontSize: 11, lineHeight: 1.55, color: data.colors.text }}>
                <span style={{ color: data.colors.accent, marginTop: 2 }}>&#x2022;</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
        {/* Channels */}
        <div>
          <h4 style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 13, color: data.colors.primary, marginBottom: 8 }}>
            Channels
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {persona.channels.map((c) => (
              <span
                key={c}
                className="rounded-full"
                style={{
                  fontFamily: data.bodyFont,
                  fontSize: 10,
                  padding: '3px 10px',
                  backgroundColor: data.colors.accent + '18',
                  color: data.colors.accent,
                  fontWeight: 500,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 7. BrandPersonalityPage
// ---------------------------------------------------------------------------

export function BrandPersonalityPage({ data }: PageProps) {
  if (!data.identity?.personality?.length) return null;
  const traits = data.identity.personality;
  return (
    <PageShell pageNumber={7}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Brand Personality
      </SectionHeading>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {traits.map((t, i) => (
          <div
            key={t.trait}
            className="rounded-lg"
            style={{
              padding: '16px 18px',
              border: `1px solid ${data.colors.primary}20`,
              backgroundColor: i % 2 === 0 ? data.colors.primary + '06' : data.colors.secondary + '06',
            }}
          >
            <div
              className="flex items-center gap-2 mb-2"
              style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 14, color: data.colors.primary }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: data.colors.accent,
                  flexShrink: 0,
                }}
              />
              {t.trait}
            </div>
            <p style={{ fontFamily: data.bodyFont, fontSize: 11, lineHeight: 1.65, color: data.colors.text, opacity: 0.8 }}>
              {t.description}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 8. ElevatorPitchPage
// ---------------------------------------------------------------------------

export function ElevatorPitchPage({ data }: PageProps) {
  if (!data.voice) return null;
  return (
    <PageShell pageNumber={8}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Elevator Pitch
      </SectionHeading>
      <div className="flex flex-col h-[60%] justify-center">
        <blockquote
          className="relative"
          style={{
            fontFamily: data.headingFont,
            fontWeight: 500,
            fontSize: 20,
            lineHeight: 1.7,
            color: data.colors.text,
            paddingLeft: 28,
            borderLeft: `4px solid ${data.colors.accent}`,
          }}
        >
          {data.voice.elevatorPitch}
        </blockquote>
      </div>

      {data.voice.taglines.length > 0 && (
        <div className="mt-8">
          <h3
            style={{
              fontFamily: data.headingFont,
              fontWeight: 600,
              fontSize: 14,
              color: data.colors.primary,
              marginBottom: 12,
            }}
          >
            Taglines
          </h3>
          <div className="flex flex-col gap-2">
            {data.voice.taglines.map((t) => (
              <div
                key={t}
                className="flex items-center gap-3"
                style={{ fontFamily: data.bodyFont, fontSize: 13, color: data.colors.text }}
              >
                <span style={{ color: data.colors.accent, fontSize: 18 }}>&ldquo;</span>
                {t}
                <span style={{ color: data.colors.accent, fontSize: 18 }}>&rdquo;</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 9. VoiceGuidePage
// ---------------------------------------------------------------------------

export function VoiceGuidePage({ data }: PageProps) {
  if (!data.voice) return null;
  return (
    <PageShell pageNumber={9}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Voice Guidelines
      </SectionHeading>

      {/* Tone attributes */}
      <div className="flex flex-wrap gap-2 mb-6">
        {data.voice.toneAttributes.map((a) => (
          <span
            key={a}
            className="rounded-full"
            style={{
              fontFamily: data.bodyFont,
              fontSize: 11,
              padding: '5px 14px',
              backgroundColor: data.colors.accent + '15',
              color: data.colors.accent,
              fontWeight: 600,
            }}
          >
            {a}
          </span>
        ))}
      </div>

      {/* Dos & Don'ts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 13, color: '#16a34a', marginBottom: 8 }}>
            Do
          </h4>
          <ul className="flex flex-col gap-1.5">
            {data.voice.voiceGuide.dos.map((d) => (
              <li key={d} className="flex items-start gap-2" style={{ fontFamily: data.bodyFont, fontSize: 11, lineHeight: 1.55, color: data.colors.text }}>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>+</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 13, color: '#dc2626', marginBottom: 8 }}>
            Don&apos;t
          </h4>
          <ul className="flex flex-col gap-1.5">
            {data.voice.voiceGuide.donts.map((d) => (
              <li key={d} className="flex items-start gap-2" style={{ fontFamily: data.bodyFont, fontSize: 11, lineHeight: 1.55, color: data.colors.text }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>&minus;</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Example phrases */}
      {data.voice.examplePhrases.length > 0 && (
        <div>
          <h4 style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 13, color: data.colors.primary, marginBottom: 8 }}>
            Example Phrases
          </h4>
          <div className="flex flex-col gap-1.5">
            {data.voice.examplePhrases.map((p) => (
              <div
                key={p}
                className="rounded"
                style={{
                  fontFamily: data.bodyFont,
                  fontSize: 11,
                  fontStyle: 'italic',
                  color: data.colors.text,
                  opacity: 0.8,
                  padding: '6px 12px',
                  backgroundColor: data.colors.primary + '08',
                }}
              >
                &ldquo;{p}&rdquo;
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 10. MessagingPillarsPage
// ---------------------------------------------------------------------------

export function MessagingPillarsPage({ data }: PageProps) {
  if (!data.voice?.messagingPillars?.length) return null;
  const pillars = data.voice.messagingPillars;
  return (
    <PageShell pageNumber={10}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Messaging Pillars
      </SectionHeading>
      <div className="grid grid-cols-2 gap-5 mt-6">
        {pillars.map((p, i) => {
          const bgColors = [data.colors.primary, data.colors.secondary, data.colors.accent, data.colors.primary];
          const bg = bgColors[i % bgColors.length];
          return (
            <div
              key={p.title}
              className="rounded-lg"
              style={{
                padding: '20px',
                backgroundColor: bg + '0c',
                borderTop: `3px solid ${bg}`,
              }}
            >
              <h4 style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 14, color: bg, marginBottom: 8 }}>
                {p.title}
              </h4>
              <p style={{ fontFamily: data.bodyFont, fontSize: 11, lineHeight: 1.65, color: data.colors.text, opacity: 0.8 }}>
                {p.description}
              </p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 11. ColorPalettePage
// ---------------------------------------------------------------------------

function ColorSwatch({
  label,
  hex,
  font,
  textColor,
}: {
  label: string;
  hex: string;
  font: string;
  textColor: string;
}) {
  const rgb = hexToRgb(hex);
  const isLight = parseInt(hex.replace('#', '').substring(0, 2), 16) > 180;
  return (
    <div className="flex flex-col rounded-lg overflow-hidden" style={{ border: '1px solid #e4e4e7' }}>
      <div style={{ backgroundColor: hex, height: 80, display: 'flex', alignItems: 'flex-end', padding: '0 12px 8px' }}>
        <span style={{ fontFamily: font, fontWeight: 600, fontSize: 12, color: isLight ? '#27272a' : '#fff' }}>
          {label}
        </span>
      </div>
      <div style={{ padding: '10px 12px', fontFamily: font, fontSize: 11, color: textColor }}>
        <div style={{ fontWeight: 600 }}>{hex.toUpperCase()}</div>
        <div style={{ opacity: 0.6, marginTop: 2 }}>RGB {rgb}</div>
      </div>
    </div>
  );
}

export function ColorPalettePage({ data }: PageProps) {
  const c = data.colors;
  const entries: { label: string; hex: string }[] = [
    { label: 'Primary', hex: c.primary },
    { label: 'Secondary', hex: c.secondary },
    { label: 'Accent', hex: c.accent },
    { label: 'Background', hex: c.background },
    { label: 'Text', hex: c.text },
  ];
  return (
    <PageShell pageNumber={11}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Color Palette
      </SectionHeading>
      <div className="grid grid-cols-5 gap-4 mt-6">
        {entries.map((e) => (
          <ColorSwatch key={e.label} label={e.label} hex={e.hex} font={data.bodyFont} textColor={data.colors.text} />
        ))}
      </div>
      {/* Gradient preview */}
      <div className="mt-8">
        <p style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 12, color: data.colors.text, marginBottom: 8 }}>
          Gradient Preview
        </p>
        <div
          className="rounded-lg"
          style={{
            height: 48,
            background: `linear-gradient(135deg, ${c.primary}, ${c.secondary}, ${c.accent})`,
          }}
        />
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 12. DarkModePalettePage
// ---------------------------------------------------------------------------

export function DarkModePalettePage({ data }: PageProps) {
  if (!data.darkColors) return null;
  const c = data.darkColors;
  const entries: { label: string; hex: string }[] = [
    { label: 'Primary', hex: c.primary },
    { label: 'Secondary', hex: c.secondary },
    { label: 'Accent', hex: c.accent },
    { label: 'Background', hex: c.background },
    { label: 'Text', hex: c.text },
  ];
  return (
    <PageShell bg={c.background} pageNumber={12}>
      {/* Side label */}
      <div
        className="absolute top-6 right-7 rounded-full"
        style={{
          fontFamily: data.bodyFont,
          fontSize: 10,
          fontWeight: 600,
          padding: '3px 12px',
          backgroundColor: c.accent + '25',
          color: c.accent,
        }}
      >
        Dark Mode
      </div>
      <SectionHeading color={c.text} font={data.headingFont} accent={c.accent}>
        Dark Mode Palette
      </SectionHeading>
      <div className="grid grid-cols-5 gap-4 mt-6">
        {entries.map((e) => (
          <ColorSwatch key={e.label} label={e.label} hex={e.hex} font={data.bodyFont} textColor={c.text} />
        ))}
      </div>
      <div className="mt-8">
        <p style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 12, color: c.text, marginBottom: 8 }}>
          Gradient Preview
        </p>
        <div
          className="rounded-lg"
          style={{
            height: 48,
            background: `linear-gradient(135deg, ${c.primary}, ${c.secondary}, ${c.accent})`,
          }}
        />
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 13. ColorPsychologyPage
// ---------------------------------------------------------------------------

export function ColorPsychologyPage({ data }: PageProps) {
  if (!data.colorPsychology) return null;
  return (
    <PageShell pageNumber={13}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Color Psychology
      </SectionHeading>
      {/* Palette bar */}
      <div className="flex rounded-lg overflow-hidden mb-8" style={{ height: 32 }}>
        {[data.colors.primary, data.colors.secondary, data.colors.accent, data.colors.background].map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
      <p
        style={{
          fontFamily: data.bodyFont,
          fontSize: 13,
          lineHeight: 1.85,
          color: data.colors.text,
          whiteSpace: 'pre-line',
        }}
      >
        {data.colorPsychology}
      </p>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 14. TypographyPage
// ---------------------------------------------------------------------------

export function TypographyPage({ data }: PageProps) {
  const sizes = [
    { label: 'H1', size: 32, weight: 800 },
    { label: 'H2', size: 24, weight: 700 },
    { label: 'H3', size: 20, weight: 600 },
    { label: 'H4', size: 16, weight: 600 },
    { label: 'H5', size: 14, weight: 600 },
    { label: 'H6', size: 12, weight: 600 },
  ];
  return (
    <PageShell pageNumber={14}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Typography
      </SectionHeading>

      <div className="grid grid-cols-2 gap-8 mt-4">
        {/* Heading font */}
        <div>
          <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Heading Font
          </p>
          <p style={{ fontFamily: data.headingFont, fontWeight: 700, fontSize: 28, color: data.colors.text, marginBottom: 8 }}>
            {data.headingFont}
          </p>
          <p style={{ fontFamily: data.headingFont, fontSize: 13, color: data.colors.text, opacity: 0.6, lineHeight: 1.6 }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
            abcdefghijklmnopqrstuvwxyz<br />
            0123456789 !@#$%&amp;*
          </p>
        </div>

        {/* Body font */}
        <div>
          <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Body Font
          </p>
          <p style={{ fontFamily: data.bodyFont, fontWeight: 400, fontSize: 28, color: data.colors.text, marginBottom: 8 }}>
            {data.bodyFont}
          </p>
          <p style={{ fontFamily: data.bodyFont, fontSize: 13, color: data.colors.text, opacity: 0.6, lineHeight: 1.6 }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
            abcdefghijklmnopqrstuvwxyz<br />
            0123456789 !@#$%&amp;*
          </p>
        </div>
      </div>

      {/* Size scale */}
      <div className="mt-8">
        <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Type Scale
        </p>
        <div className="flex flex-col gap-2">
          {sizes.map((s) => (
            <div key={s.label} className="flex items-baseline gap-3">
              <span style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text, opacity: 0.4, width: 20 }}>
                {s.label}
              </span>
              <span style={{ fontFamily: data.headingFont, fontSize: s.size, fontWeight: s.weight, color: data.colors.text, lineHeight: 1.2 }}>
                {data.intake?.businessName || data.title}
              </span>
            </div>
          ))}
          <div className="flex items-baseline gap-3 mt-2">
            <span style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text, opacity: 0.4, width: 20 }}>
              Body
            </span>
            <span style={{ fontFamily: data.bodyFont, fontSize: 14, color: data.colors.text, lineHeight: 1.6 }}>
              The quick brown fox jumps over the lazy dog.
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text, opacity: 0.4, width: 20 }}>
              Sm
            </span>
            <span style={{ fontFamily: data.bodyFont, fontSize: 11, color: data.colors.text, opacity: 0.7, lineHeight: 1.6 }}>
              Caption text or fine print appears at this size.
            </span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 15. MoodBoardPage
// ---------------------------------------------------------------------------

export function MoodBoardPage({ data }: PageProps) {
  if (!data.moodBoardImages?.length) return null;
  const images = data.moodBoardImages;
  return (
    <PageShell pageNumber={15}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Mood Board
      </SectionHeading>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {images.map((img, i) => (
          <div key={img.url} className="rounded-lg overflow-hidden" style={{ gridRow: i === 0 ? 'span 2' : undefined }}>
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover"
              style={{ minHeight: i === 0 ? 200 : 96 }}
            />
          </div>
        ))}
      </div>
      {data.photoNotes && (
        <div className="mt-5">
          <h4 style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 12, color: data.colors.primary, marginBottom: 6 }}>
            Photography Notes
          </h4>
          <p style={{ fontFamily: data.bodyFont, fontSize: 11, lineHeight: 1.65, color: data.colors.text, opacity: 0.75 }}>
            {data.photoNotes}
          </p>
        </div>
      )}
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 16. SocialMediaPage
// ---------------------------------------------------------------------------

export function SocialMediaPage({ data }: PageProps) {
  const brandName = data.intake?.businessName || data.title;
  const tagline = data.voice?.taglines?.[0] || '';
  const bgImage = data.moodBoardImages[0]?.url;
  return (
    <PageShell pageNumber={16}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Social Media
      </SectionHeading>
      <div className="grid grid-cols-2 gap-5 mt-4">
        {/* IG Post mockup */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #e4e4e7' }}>
          <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid #f4f4f5' }}>
            <BrandInitial name={brandName} colors={data.colors} size={20} />
            <span style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 10, color: data.colors.text }}>
              {brandName}
            </span>
          </div>
          {bgImage ? (
            <img src={bgImage} alt="Post" className="w-full aspect-square object-cover" />
          ) : (
            <div
              className="w-full aspect-square"
              style={{ background: `linear-gradient(135deg, ${data.colors.primary}, ${data.colors.secondary})` }}
            />
          )}
          <div className="px-3 py-2">
            <span style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text }}>
              <strong>{brandName}</strong> {tagline}
            </span>
          </div>
        </div>

        {/* FB Cover mockup */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #e4e4e7' }}>
          <div
            style={{
              aspectRatio: '820/312',
              background: bgImage
                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage}) center/cover`
                : `linear-gradient(135deg, ${data.colors.primary}, ${data.colors.accent})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: data.headingFont,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {brandName}
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <BrandInitial name={brandName} colors={data.colors} size={28} />
            <div>
              <div style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 11, color: data.colors.text }}>
                {brandName}
              </div>
              <div style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text, opacity: 0.5 }}>
                {data.intake?.industry || 'Brand Page'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 17. BusinessCardPage
// ---------------------------------------------------------------------------

export function BusinessCardPage({ data }: PageProps) {
  const brandName = data.intake?.businessName || data.title;
  const tagline = data.voice?.taglines?.[0];
  return (
    <PageShell pageNumber={17}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Business Card
      </SectionHeading>
      <div className="flex flex-col gap-6 items-center mt-6">
        {/* Front */}
        <div
          className="rounded-lg shadow-sm overflow-hidden w-full max-w-[420px]"
          style={{
            aspectRatio: '3.5 / 2',
            backgroundColor: data.colors.background,
            color: data.colors.text,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '28px 32px',
            position: 'relative',
          }}
        >
          {data.intake?.logoDataUrl ? (
            <img src={data.intake.logoDataUrl} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain', marginBottom: 12 }} />
          ) : (
            <BrandInitial name={brandName} colors={data.colors} size={36} />
          )}
          <div style={{ fontFamily: data.headingFont, fontWeight: 700, fontSize: 18, marginTop: 8, marginBottom: 4 }}>
            {brandName}
          </div>
          {tagline && (
            <div style={{ fontFamily: data.bodyFont, fontSize: 10, opacity: 0.7 }}>
              {tagline}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, backgroundColor: data.colors.accent }} />
        </div>

        {/* Back */}
        <div
          className="rounded-lg shadow-sm overflow-hidden w-full max-w-[420px]"
          style={{
            aspectRatio: '3.5 / 2',
            backgroundColor: data.colors.primary,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '28px 32px',
            position: 'relative',
          }}
        >
          <div style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 12, marginBottom: 14 }}>
            Contact
          </div>
          <div className="flex flex-col gap-1.5" style={{ fontFamily: data.bodyFont, fontSize: 10, opacity: 0.9 }}>
            <div>Jane Doe, Founder</div>
            <div>hello@{brandName.toLowerCase().replace(/\s+/g, '')}.com</div>
            <div>(555) 123-4567</div>
            <div>www.{brandName.toLowerCase().replace(/\s+/g, '')}.com</div>
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: data.colors.secondary }} />
        </div>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 18. LetterheadPage
// ---------------------------------------------------------------------------

export function LetterheadPage({ data }: PageProps) {
  const brandName = data.intake?.businessName || data.title;
  return (
    <PageShell pageNumber={18}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Letterhead
      </SectionHeading>
      <div
        className="rounded-lg shadow-sm overflow-hidden mx-auto mt-4"
        style={{
          maxWidth: 380,
          aspectRatio: '1 / 1.414',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 18px 14px',
          border: '1px solid #e4e4e7',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          {data.intake?.logoDataUrl ? (
            <img src={data.intake.logoDataUrl} alt="Logo" style={{ width: 20, height: 20, objectFit: 'contain' }} />
          ) : null}
          <div style={{ fontFamily: data.headingFont, fontWeight: 700, fontSize: 14, color: data.colors.primary }}>
            {brandName}
          </div>
        </div>
        <div style={{ height: 2, backgroundColor: data.colors.accent, borderRadius: 2, marginBottom: 16 }} />

        {/* Body lines */}
        <div className="flex flex-col gap-2 flex-1" style={{ fontFamily: data.bodyFont }}>
          <PlaceholderLine width="40%" color={data.colors.text + '30'} />
          <div style={{ height: 4 }} />
          <PlaceholderLine width="100%" color={data.colors.text + '18'} />
          <PlaceholderLine width="95%" color={data.colors.text + '18'} />
          <PlaceholderLine width="88%" color={data.colors.text + '18'} />
          <PlaceholderLine width="92%" color={data.colors.text + '18'} />
          <PlaceholderLine width="60%" color={data.colors.text + '18'} />
          <div style={{ height: 4 }} />
          <PlaceholderLine width="100%" color={data.colors.text + '18'} />
          <PlaceholderLine width="97%" color={data.colors.text + '18'} />
          <PlaceholderLine width="85%" color={data.colors.text + '18'} />
          <PlaceholderLine width="45%" color={data.colors.text + '18'} />
          <div style={{ height: 4 }} />
          <PlaceholderLine width="30%" color={data.colors.text + '30'} />
          <PlaceholderLine width="25%" color={data.colors.text + '18'} />
        </div>

        {/* Footer */}
        <div style={{ height: 2, backgroundColor: data.colors.primary, borderRadius: 2, opacity: 0.35, marginTop: 10 }} />
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 19. WebsitePreviewPage
// ---------------------------------------------------------------------------

export function WebsitePreviewPage({ data }: PageProps) {
  const brandName = data.intake?.businessName || data.title;
  const tagline = data.voice?.taglines?.[0] || data.voice?.elevatorPitch || '';
  const bgImage = data.moodBoardImages[0]?.url;
  return (
    <PageShell pageNumber={19}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Website Preview
      </SectionHeading>
      <div className="rounded-lg shadow-sm overflow-hidden mx-auto mt-4" style={{ maxWidth: 460, border: '1px solid #e4e4e7' }}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: '#f4f4f5', borderBottom: '1px solid #e4e4e7' }}>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded text-xs text-zinc-400 px-2 py-0.5 truncate" style={{ fontFamily: data.bodyFont, fontSize: 9 }}>
            www.{brandName.toLowerCase().replace(/\s+/g, '')}.com
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: data.colors.background, borderBottom: `1px solid ${data.colors.text}10` }}>
          <span style={{ fontFamily: data.headingFont, fontWeight: 700, fontSize: 12, color: data.colors.primary }}>
            {brandName}
          </span>
          <div className="flex gap-3">
            {['About', 'Services', 'Contact'].map((n) => (
              <span key={n} style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text, opacity: 0.6 }}>{n}</span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div
          className="flex flex-col items-center justify-center text-center px-6 py-10"
          style={{
            background: bgImage
              ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bgImage}) center/cover`
              : `linear-gradient(135deg, ${data.colors.primary}, ${data.colors.secondary})`,
            minHeight: 140,
          }}
        >
          <h3 style={{ fontFamily: data.headingFont, fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 6 }}>
            {brandName}
          </h3>
          <p style={{ fontFamily: data.bodyFont, fontSize: 10, color: 'rgba(255,255,255,0.85)', maxWidth: 280, marginBottom: 14 }}>
            {tagline}
          </p>
          <button
            style={{
              fontFamily: data.bodyFont,
              fontWeight: 600,
              fontSize: 10,
              backgroundColor: data.colors.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 18px',
            }}
          >
            Get Started
          </button>
        </div>

        {/* Body hint */}
        <div className="px-6 py-4 flex flex-col gap-1.5">
          <PlaceholderLine width="50%" color={data.colors.text + '20'} height={6} />
          <PlaceholderLine width="100%" color={data.colors.text + '10'} height={5} />
          <PlaceholderLine width="90%" color={data.colors.text + '10'} height={5} />
        </div>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 20. MotionDirectionPage
// ---------------------------------------------------------------------------

export function MotionDirectionPage({ data }: PageProps) {
  if (!data.motion) return null;
  const speedMap: Record<string, string> = {
    slow: '1.2s',
    medium: '0.6s',
    fast: '0.3s',
  };
  const duration = speedMap[data.motion.speed] || '0.6s';
  return (
    <PageShell pageNumber={20}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Motion Direction
      </SectionHeading>

      <div className="grid grid-cols-2 gap-8 mt-4">
        {/* Style */}
        <div>
          <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Style
          </p>
          <p style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 20, color: data.colors.text, textTransform: 'capitalize' }}>
            {data.motion.style}
          </p>
        </div>
        {/* Speed */}
        <div>
          <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Speed
          </p>
          <p style={{ fontFamily: data.headingFont, fontWeight: 600, fontSize: 20, color: data.colors.text, textTransform: 'capitalize' }}>
            {data.motion.speed}
          </p>
          <p style={{ fontFamily: data.bodyFont, fontSize: 11, color: data.colors.text, opacity: 0.5, marginTop: 4 }}>
            ~{duration} duration
          </p>
        </div>
      </div>

      {/* Visual indicator */}
      <div className="mt-8 mb-6">
        <div className="flex gap-3 items-end">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded"
              style={{
                width: 40,
                height: 16 + i * 14,
                backgroundColor: data.colors.accent,
                opacity: 0.2 + i * 0.16,
              }}
            />
          ))}
        </div>
      </div>

      {data.motion.notes && (
        <div className="mt-4">
          <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Notes
          </p>
          <p style={{ fontFamily: data.bodyFont, fontSize: 12, lineHeight: 1.7, color: data.colors.text, opacity: 0.8 }}>
            {data.motion.notes}
          </p>
        </div>
      )}
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 21. DosAndDontsPage
// ---------------------------------------------------------------------------

export function DosAndDontsPage({ data }: PageProps) {
  if (!data.voice?.voiceGuide) return null;
  return (
    <PageShell pageNumber={21}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Brand Dos & Don&apos;ts
      </SectionHeading>
      <div className="grid grid-cols-2 gap-8 mt-4">
        {/* Dos */}
        <div
          className="rounded-lg"
          style={{ padding: '20px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <h4
            className="flex items-center gap-2 mb-4"
            style={{ fontFamily: data.headingFont, fontWeight: 700, fontSize: 16, color: '#16a34a' }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              &#x2713;
            </span>
            Do
          </h4>
          <ul className="flex flex-col gap-2">
            {data.voice.voiceGuide.dos.map((d) => (
              <li key={d} className="flex items-start gap-2" style={{ fontFamily: data.bodyFont, fontSize: 12, lineHeight: 1.55, color: '#15803d' }}>
                <span style={{ fontWeight: 700, marginTop: 1 }}>+</span>
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts */}
        <div
          className="rounded-lg"
          style={{ padding: '20px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
        >
          <h4
            className="flex items-center gap-2 mb-4"
            style={{ fontFamily: data.headingFont, fontWeight: 700, fontSize: 16, color: '#dc2626' }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              &#x2717;
            </span>
            Don&apos;t
          </h4>
          <ul className="flex flex-col gap-2">
            {data.voice.voiceGuide.donts.map((d) => (
              <li key={d} className="flex items-start gap-2" style={{ fontFamily: data.bodyFont, fontSize: 12, lineHeight: 1.55, color: '#991b1b' }}>
                <span style={{ fontWeight: 700, marginTop: 1 }}>&minus;</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 22. QuickReferencePage
// ---------------------------------------------------------------------------

export function QuickReferencePage({ data }: PageProps) {
  const brandName = data.intake?.businessName || data.title;
  return (
    <PageShell pageNumber={22}>
      <SectionHeading color={data.colors.text} font={data.headingFont} accent={data.colors.accent}>
        Quick Reference
      </SectionHeading>

      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Colors */}
        <div className="rounded-lg" style={{ padding: '16px', border: `1px solid ${data.colors.text}15` }}>
          <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Colors
          </p>
          <div className="flex gap-2">
            {[data.colors.primary, data.colors.secondary, data.colors.accent].map((c) => (
              <div key={c} className="flex flex-col items-center gap-1">
                <div className="rounded" style={{ width: 36, height: 36, backgroundColor: c }} />
                <span style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text, opacity: 0.6 }}>
                  {c.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div className="rounded-lg" style={{ padding: '16px', border: `1px solid ${data.colors.text}15` }}>
          <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Fonts
          </p>
          <div className="flex flex-col gap-2">
            <div>
              <span style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text, opacity: 0.5 }}>Heading: </span>
              <span style={{ fontFamily: data.headingFont, fontWeight: 700, fontSize: 14, color: data.colors.text }}>
                {data.headingFont}
              </span>
            </div>
            <div>
              <span style={{ fontFamily: data.bodyFont, fontSize: 9, color: data.colors.text, opacity: 0.5 }}>Body: </span>
              <span style={{ fontFamily: data.bodyFont, fontSize: 14, color: data.colors.text }}>
                {data.bodyFont}
              </span>
            </div>
          </div>
        </div>

        {/* Voice */}
        {data.voice && (
          <div className="rounded-lg" style={{ padding: '16px', border: `1px solid ${data.colors.text}15` }}>
            <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Voice
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.voice.toneAttributes.slice(0, 5).map((a) => (
                <span
                  key={a}
                  className="rounded-full"
                  style={{
                    fontFamily: data.bodyFont,
                    fontSize: 9,
                    padding: '3px 10px',
                    backgroundColor: data.colors.accent + '15',
                    color: data.colors.accent,
                    fontWeight: 500,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tagline */}
        {data.voice?.taglines?.[0] && (
          <div className="rounded-lg" style={{ padding: '16px', border: `1px solid ${data.colors.text}15` }}>
            <p style={{ fontFamily: data.bodyFont, fontSize: 10, fontWeight: 600, color: data.colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Tagline
            </p>
            <p style={{ fontFamily: data.headingFont, fontWeight: 500, fontSize: 14, color: data.colors.text, fontStyle: 'italic' }}>
              &ldquo;{data.voice.taglines[0]}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Brand name lockup */}
      <div className="mt-6 rounded-lg flex items-center justify-center py-6" style={{ backgroundColor: data.colors.primary + '08' }}>
        {data.intake?.logoDataUrl && (
          <img src={data.intake.logoDataUrl} alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain', marginRight: 12 }} />
        )}
        <span style={{ fontFamily: data.headingFont, fontWeight: 800, fontSize: 28, color: data.colors.primary }}>
          {brandName}
        </span>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// 23. CreditsPage
// ---------------------------------------------------------------------------

export function CreditsPage({ data }: PageProps) {
  return (
    <PageShell
      style={{
        padding: 0,
        background: `linear-gradient(135deg, ${data.colors.primary}, ${data.colors.secondary})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
      }}
    >
      <p style={{ fontFamily: data.bodyFont, fontSize: 12, opacity: 0.65, marginBottom: 8 }}>
        Brand Guidelines for
      </p>
      <h2 style={{ fontFamily: data.headingFont, fontWeight: 800, fontSize: 32, marginBottom: 24 }}>
        {data.intake?.businessName || data.title}
      </h2>
      <div style={{ width: 48, height: 2, backgroundColor: '#fff', opacity: 0.3, marginBottom: 24, borderRadius: 1 }} />
      <p style={{ fontFamily: data.bodyFont, fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
        Created with
      </p>
      <p style={{ fontFamily: data.headingFont, fontWeight: 700, fontSize: 16, opacity: 0.85 }}>
        Sunshine Brand Studio
      </p>
      <p style={{ fontFamily: data.bodyFont, fontSize: 11, opacity: 0.4, marginTop: 16 }}>
        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Compositor: BrandDeckPages
// ---------------------------------------------------------------------------

export function BrandDeckPages({ data }: { data: DeckData }) {
  const pages: React.ReactNode[] = [];

  // Cover
  pages.push(<CoverPage key="cover" data={data} />);

  // Table of Contents
  pages.push(<TableOfContentsPage key="toc" data={data} />);

  // Brand Story
  if (data.identity) {
    pages.push(<BrandStoryPage key="story" data={data} />);
  }

  // Mission & Vision
  if (data.identity) {
    pages.push(<MissionVisionPage key="mission-vision" data={data} />);
  }

  // Core Values
  if (data.identity?.values?.length) {
    pages.push(<CoreValuesPage key="values" data={data} />);
  }

  // Brand Personality
  if (data.identity?.personality?.length) {
    pages.push(<BrandPersonalityPage key="personality" data={data} />);
  }

  // Personas (one page per persona)
  if (data.audience?.personas?.length) {
    data.audience.personas.forEach((_, i) => {
      pages.push(<PersonaPage key={`persona-${i}`} data={data} index={i} />);
    });
  }

  // Elevator Pitch & Taglines
  if (data.voice) {
    pages.push(<ElevatorPitchPage key="pitch" data={data} />);
  }

  // Voice Guidelines
  if (data.voice) {
    pages.push(<VoiceGuidePage key="voice" data={data} />);
  }

  // Messaging Pillars
  if (data.voice?.messagingPillars?.length) {
    pages.push(<MessagingPillarsPage key="pillars" data={data} />);
  }

  // Color Palette
  pages.push(<ColorPalettePage key="colors" data={data} />);

  // Dark Mode Palette
  if (data.darkColors) {
    pages.push(<DarkModePalettePage key="dark-colors" data={data} />);
  }

  // Color Psychology
  if (data.colorPsychology) {
    pages.push(<ColorPsychologyPage key="color-psych" data={data} />);
  }

  // Typography
  pages.push(<TypographyPage key="typography" data={data} />);

  // Mood Board
  if (data.moodBoardImages?.length) {
    pages.push(<MoodBoardPage key="mood" data={data} />);
  }

  // Social Media
  pages.push(<SocialMediaPage key="social" data={data} />);

  // Business Card
  pages.push(<BusinessCardPage key="biz-card" data={data} />);

  // Letterhead
  pages.push(<LetterheadPage key="letterhead" data={data} />);

  // Website Preview
  pages.push(<WebsitePreviewPage key="website" data={data} />);

  // Motion Direction
  if (data.motion) {
    pages.push(<MotionDirectionPage key="motion" data={data} />);
  }

  // Dos & Don'ts
  if (data.voice?.voiceGuide) {
    pages.push(<DosAndDontsPage key="dos-donts" data={data} />);
  }

  // Quick Reference
  pages.push(<QuickReferencePage key="quick-ref" data={data} />);

  // Credits
  pages.push(<CreditsPage key="credits" data={data} />);

  return <>{pages}</>;
}
