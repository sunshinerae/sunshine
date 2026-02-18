import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const decks = await db
      .select()
      .from(brandDecks)
      .orderBy(desc(brandDecks.createdAt));

    return NextResponse.json({ decks });
  } catch (error) {
    console.error('Failed to fetch brand decks:', error);
    return NextResponse.json({ error: 'Failed to fetch brand decks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
      `-${Date.now().toString(36)}`;

    const [deck] = await db
      .insert(brandDecks)
      .values({
        title: title.trim(),
        slug,
        status: 'draft',
        currentStep: 0,
      })
      .returning();

    return NextResponse.json({ deck }, { status: 201 });
  } catch (error) {
    console.error('Failed to create brand deck:', error);
    return NextResponse.json({ error: 'Failed to create brand deck' }, { status: 500 });
  }
}
