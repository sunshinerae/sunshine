import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Browser } from 'puppeteer-core';

// Allow up to 60s for PDF generation (Vercel serverless)
export const maxDuration = 60;

async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = await import('@sparticuz/chromium');
    const puppeteerCore = await import('puppeteer-core');
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: { width: 816, height: 1056 },
    });
  }

  const puppeteer = await import('puppeteer');
  return puppeteer.launch({
    headless: true,
    defaultViewport: { width: 816, height: 1056 },
  }) as unknown as Browser;
}

export async function POST(
  _request: Request,
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

    // Determine base URL for the public brand view
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    // The public page returns 404 for drafts, so temporarily mark as completed
    const originalStatus = deck.status;
    if (originalStatus !== 'completed') {
      await db
        .update(brandDecks)
        .set({ status: 'completed' })
        .where(eq(brandDecks.id, deckId));
    }

    try {
      const url = `${baseUrl}/brand/${deck.slug}`;
      const browser = await launchBrowser();

      try {
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });

        // Wait for Google Fonts to finish loading
        await page.waitForFunction(
          () => document.fonts.ready.then(() => true),
          { timeout: 10000 }
        );

        // Extra wait for images (mood board, backgrounds) to render
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const pdfBuffer = await page.pdf({
          format: 'Letter',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });

        const filename = `${deck.title
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase()}-brand-deck.pdf`;

        return new Response(Buffer.from(pdfBuffer), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-store',
          },
        });
      } finally {
        await browser.close();
      }
    } finally {
      // Always restore original status
      if (originalStatus !== 'completed') {
        await db
          .update(brandDecks)
          .set({ status: originalStatus })
          .where(eq(brandDecks.id, deckId));
      }
    }
  } catch (error) {
    console.error('PDF export failed:', error);
    return NextResponse.json(
      { error: 'PDF export failed' },
      { status: 500 }
    );
  }
}
