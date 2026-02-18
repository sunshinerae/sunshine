import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deckId = parseInt(id, 10);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: 'Invalid deck ID' }, { status: 400 });
    }

    const [deck] = await db
      .select()
      .from(brandDecks)
      .where(eq(brandDecks.id, deckId));

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json({ deck });
  } catch (error) {
    console.error('Failed to fetch brand deck:', error);
    return NextResponse.json({ error: 'Failed to fetch brand deck' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deckId = parseInt(id, 10);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: 'Invalid deck ID' }, { status: 400 });
    }

    const body = await request.json();
    const allowedFields = [
      'title', 'status', 'currentStep',
      'intake', 'identity', 'audience', 'voice',
      'visuals', 'applications', 'motion', 'images',
    ] as const;

    const jsonFields = [
      'intake', 'identity', 'audience', 'voice',
      'visuals', 'applications', 'motion', 'images',
    ];

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowedFields) {
      if (field in body) {
        let value = body[field];
        if (jsonFields.includes(field) && value !== null && typeof value === 'object') {
          value = JSON.stringify(value);
        }
        updates[field] = value;
      }
    }

    const [updated] = await db
      .update(brandDecks)
      .set(updates)
      .where(eq(brandDecks.id, deckId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json({ deck: updated });
  } catch (error) {
    console.error('Failed to update brand deck:', error);
    return NextResponse.json({ error: 'Failed to update brand deck' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deckId = parseInt(id, 10);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: 'Invalid deck ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(brandDecks)
      .where(eq(brandDecks.id, deckId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete brand deck:', error);
    return NextResponse.json({ error: 'Failed to delete brand deck' }, { status: 500 });
  }
}
