import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import JSZip from 'jszip';

export const maxDuration = 30;

// ─── Helpers ────────────────────────────────────────────────────────────────

type ColorMap = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

const DEFAULTS: ColorMap = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#f59e0b',
  background: '#ffffff',
  text: '#18181b',
};

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '0, 0, 0';
  return `${r}, ${g}, ${b}`;
}

function buildCssVars(light: ColorMap, dark: ColorMap | null): string {
  const lightVars = [
    `  --brand-primary: ${light.primary};`,
    `  --brand-secondary: ${light.secondary};`,
    `  --brand-accent: ${light.accent};`,
    `  --brand-background: ${light.background};`,
    `  --brand-text: ${light.text};`,
  ].join('\n');

  let css = `:root {\n${lightVars}\n}\n`;

  if (dark) {
    const darkVars = [
      `  --brand-primary: ${dark.primary};`,
      `  --brand-secondary: ${dark.secondary};`,
      `  --brand-accent: ${dark.accent};`,
      `  --brand-background: ${dark.background};`,
      `  --brand-text: ${dark.text};`,
    ].join('\n');
    css += `\n[data-theme="dark"] {\n${darkVars}\n}\n`;
  }

  return css;
}

function buildColorsJson(
  light: ColorMap,
  dark: ColorMap | null
): Record<string, unknown> {
  function expand(c: ColorMap) {
    return {
      primary: { hex: c.primary, rgb: hexToRgb(c.primary) },
      secondary: { hex: c.secondary, rgb: hexToRgb(c.secondary) },
      accent: { hex: c.accent, rgb: hexToRgb(c.accent) },
      background: { hex: c.background, rgb: hexToRgb(c.background) },
      text: { hex: c.text, rgb: hexToRgb(c.text) },
    };
  }
  const result: Record<string, unknown> = { light: expand(light) };
  if (dark) result.dark = expand(dark);
  return result;
}

function buildFontsTxt(font: { heading?: string; body?: string; name?: string; rationale?: string } | null | undefined): string {
  if (!font) {
    return [
      'Fonts',
      '=====',
      '',
      'No font pairing selected.',
    ].join('\n');
  }

  const heading = font.heading || 'Inter';
  const body = font.body || 'Inter';
  const headingUrl = `https://fonts.google.com/specimen/${encodeURIComponent(heading.replace(/ /g, '+'))}`;
  const bodyUrl = `https://fonts.google.com/specimen/${encodeURIComponent(body.replace(/ /g, '+'))}`;

  const lines = [
    'Fonts',
    '=====',
    '',
  ];

  if (font.name) lines.push(`Pairing: ${font.name}`, '');

  lines.push(
    `Heading Font: ${heading}`,
    `  Google Fonts: ${headingUrl}`,
    `  Import: @import url('https://fonts.googleapis.com/css2?family=${heading.replace(/ /g, '+')}:wght@400;600;700&display=swap');`,
    '',
    `Body Font: ${body}`,
    `  Google Fonts: ${bodyUrl}`,
    `  Import: @import url('https://fonts.googleapis.com/css2?family=${body.replace(/ /g, '+')}:wght@400;500&display=swap');`,
  );

  if (font.rationale) {
    lines.push('', 'Rationale', '---------', font.rationale);
  }

  return lines.join('\n');
}

function buildBrandInfoTxt(
  deck: { title: string },
  intake: Record<string, unknown> | null,
  identity: Record<string, unknown> | null,
  voice: Record<string, unknown> | null,
): string {
  const lines: string[] = [
    `Brand: ${deck.title}`,
    '='.repeat(Math.min(deck.title.length + 7, 60)),
    '',
  ];

  // Basic info from intake
  if (intake?.businessName) lines.push(`Business Name: ${intake.businessName}`);
  if (intake?.industry) lines.push(`Industry: ${intake.industry}`);
  lines.push('');

  // Tagline — first from voice taglines array
  const taglines = voice?.taglines as string[] | undefined;
  if (taglines?.length) {
    lines.push('Taglines', '--------');
    taglines.forEach((t, i) => lines.push(`  ${i + 1}. ${t}`));
    lines.push('');
  }

  // Elevator pitch
  if (voice?.elevatorPitch) {
    lines.push('Elevator Pitch', '--------------', String(voice.elevatorPitch), '');
  }

  // Mission / Vision
  if (identity?.mission) {
    lines.push('Mission', '-------', String(identity.mission), '');
  }
  if (identity?.vision) {
    lines.push('Vision', '------', String(identity.vision), '');
  }

  // Values
  type Value = { name?: string; description?: string };
  const values = identity?.values as Value[] | undefined;
  if (values?.length) {
    lines.push('Values', '------');
    values.forEach((v) => {
      lines.push(`  • ${v.name || ''}${v.description ? ': ' + v.description : ''}`);
    });
    lines.push('');
  }

  // Brand story
  if (identity?.brandStory) {
    lines.push('Brand Story', '-----------', String(identity.brandStory), '');
  }

  // Tone attributes
  const tone = voice?.toneAttributes as string[] | undefined;
  if (tone?.length) {
    lines.push('Tone of Voice', '-------------', tone.join(', '), '');
  }

  return lines.join('\n');
}

function buildReadmeTxt(brandName: string): string {
  return [
    `${brandName} — Brand Assets`,
    '='.repeat(Math.min(brandName.length + 16, 60)),
    '',
    'Contents',
    '--------',
    '  colors.json    — Brand color values (light + dark mode) with hex and RGB',
    '  colors.css     — CSS custom properties for all brand colors',
    '  fonts.txt      — Google Fonts names and import links',
    '  brand-info.txt — Brand name, taglines, mission, vision, values',
    '  README.txt     — This file',
    '',
    'Usage',
    '-----',
    '',
    '1. CSS Variables',
    '   Copy the contents of colors.css into your stylesheet.',
    '   Reference colors with var(--brand-primary), var(--brand-accent), etc.',
    '',
    '2. Google Fonts',
    '   Copy the @import lines from fonts.txt into your CSS <head> or stylesheet.',
    '',
    '3. Dark Mode',
    '   Add data-theme="dark" to your <html> element to activate dark mode colors.',
    '',
    '4. Brand Voice',
    '   Refer to brand-info.txt for taglines, mission, vision, and values.',
    '',
    `Generated from The Sunshine Effect Brand Deck Builder.`,
  ].join('\n');
}

// ─── Route ──────────────────────────────────────────────────────────────────

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deckId = parseInt(id, 10);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const [deck] = await db
      .select()
      .from(brandDecks)
      .where(eq(brandDecks.id, deckId));

    if (!deck) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Parse JSON columns
    const visuals = deck.visuals ? JSON.parse(deck.visuals) : null;
    const voice = deck.voice ? JSON.parse(deck.voice) : null;
    const identity = deck.identity ? JSON.parse(deck.identity) : null;
    const intake = deck.intake ? JSON.parse(deck.intake) : null;

    // Resolve light colors (same logic as brand page)
    const selectedIdx = visuals?.selectedPalette ?? 0;
    const base = visuals?.colorPalettes?.[selectedIdx];
    const custom = visuals?.customColors ?? {};
    const colors: ColorMap = base
      ? {
          primary: custom.primary || base.primary,
          secondary: custom.secondary || base.secondary,
          accent: custom.accent || base.accent,
          background: custom.background || base.background,
          text: custom.text || base.text,
        }
      : { ...DEFAULTS };

    // Resolve dark colors
    const darkAuto = visuals?.darkMode?.auto ?? {};
    const darkCustom = visuals?.darkMode?.custom ?? {};
    const darkColors: ColorMap | null =
      Object.keys(darkAuto).length > 0
        ? {
            primary: darkCustom.primary || darkAuto.primary,
            secondary: darkCustom.secondary || darkAuto.secondary,
            accent: darkCustom.accent || darkAuto.accent,
            background: darkCustom.background || darkAuto.background,
            text: darkCustom.text || darkAuto.text,
          }
        : null;

    // Resolve font pairing
    const fontIdx = visuals?.selectedFont ?? 0;
    const font = visuals?.fontPairings?.[fontIdx] ?? null;

    // Build zip
    const zip = new JSZip();

    zip.file('colors.json', JSON.stringify(buildColorsJson(colors, darkColors), null, 2));
    zip.file('colors.css', buildCssVars(colors, darkColors));
    zip.file('fonts.txt', buildFontsTxt(font));
    zip.file('brand-info.txt', buildBrandInfoTxt(deck, intake, identity, voice));
    zip.file('README.txt', buildReadmeTxt(deck.title));

    const nodeBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    // Convert Node Buffer → ArrayBuffer so it satisfies the DOM BodyInit type
    const arrayBuffer = nodeBuffer.buffer.slice(
      nodeBuffer.byteOffset,
      nodeBuffer.byteOffset + nodeBuffer.byteLength
    ) as ArrayBuffer;

    const filename = `${deck.title
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()}-brand-assets.zip`;

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Assets export failed:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
