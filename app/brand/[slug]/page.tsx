import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { BrandDeckView } from './brand-deck-view';
import type { Metadata } from 'next';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildDeckData(deck: typeof brandDecks.$inferSelect) {
  const intake = deck.intake ? JSON.parse(deck.intake) : null;
  const identity = deck.identity ? JSON.parse(deck.identity) : null;
  const audience = deck.audience ? JSON.parse(deck.audience) : null;
  const voice = deck.voice ? JSON.parse(deck.voice) : null;
  const visuals = deck.visuals ? JSON.parse(deck.visuals) : null;
  const images = deck.images ? JSON.parse(deck.images) : null;
  const motion = deck.motion ? JSON.parse(deck.motion) : null;

  const selectedIdx = visuals?.selectedPalette ?? 0;
  const base = visuals?.colorPalettes?.[selectedIdx];
  const custom = visuals?.customColors ?? {};
  const colors = base
    ? {
        primary: custom.primary || base.primary,
        secondary: custom.secondary || base.secondary,
        accent: custom.accent || base.accent,
        background: custom.background || base.background,
        text: custom.text || base.text,
      }
    : {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#18181b',
      };

  const darkAuto = visuals?.darkMode?.auto ?? {};
  const darkCustom = visuals?.darkMode?.custom ?? {};
  const darkColors =
    Object.keys(darkAuto).length > 0
      ? {
          primary: darkCustom.primary || darkAuto.primary,
          secondary: darkCustom.secondary || darkAuto.secondary,
          accent: darkCustom.accent || darkAuto.accent,
          background: darkCustom.background || darkAuto.background,
          text: darkCustom.text || darkAuto.text,
        }
      : null;

  const fontIdx = visuals?.selectedFont ?? 0;
  const font = visuals?.fontPairings?.[fontIdx];

  return {
    title: deck.title,
    intake,
    identity,
    audience,
    voice,
    colors,
    darkColors,
    colorPsychology: base?.psychology,
    headingFont: font?.heading || 'Inter',
    bodyFont: font?.body || 'Inter',
    moodBoardImages: (images?.moodBoard || []).map((img: Record<string, unknown>) => ({
      url: (img.urls as Record<string, string>)?.regular || (img.url as string) || '',
      alt: (img.alt as string) || '',
      photographer: (img.photographer as string) || '',
    })),
    photoNotes: images?.photoNotes,
    motion,
  };
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [deck] = await db
    .select()
    .from(brandDecks)
    .where(eq(brandDecks.slug, slug));

  if (!deck) {
    return { title: 'Brand Deck Not Found' };
  }

  return {
    title: `${deck.title} — Brand Deck`,
    description: `Brand guidelines for ${deck.title}`,
  };
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function BrandDeckPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [deck] = await db
    .select()
    .from(brandDecks)
    .where(eq(brandDecks.slug, slug));

  if (!deck || deck.status === 'draft') {
    return notFound();
  }

  const deckData = buildDeckData(deck);

  return <BrandDeckView data={deckData} />;
}
