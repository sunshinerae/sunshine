import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsors, sponsorActivities } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sponsorId = parseInt(id, 10);
    if (isNaN(sponsorId)) {
      return NextResponse.json({ error: 'Invalid sponsor ID' }, { status: 400 });
    }

    const activities = await db
      .select()
      .from(sponsorActivities)
      .where(eq(sponsorActivities.sponsorId, sponsorId))
      .orderBy(desc(sponsorActivities.createdAt));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sponsorId = parseInt(id, 10);
    if (isNaN(sponsorId)) {
      return NextResponse.json({ error: 'Invalid sponsor ID' }, { status: 400 });
    }

    // Verify sponsor exists
    const [sponsor] = await db.select({ id: sponsors.id }).from(sponsors).where(eq(sponsors.id, sponsorId));
    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    const body = await request.json();
    const { type, title, description } = body;

    const validTypes = ['email', 'call', 'meeting', 'note', 'stage-change', 'proposal-sent'];
    if (!type || !title) {
      return NextResponse.json({ error: 'Type and title are required' }, { status: 400 });
    }
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid activity type' }, { status: 400 });
    }

    const [activity] = await db
      .insert(sponsorActivities)
      .values({
        sponsorId,
        type,
        title: title.trim(),
        description: description?.trim() || null,
      })
      .returning();

    // Update sponsor's updatedAt and lastContactedAt for contact types
    const contactTypes = ['email', 'call', 'meeting'];
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (contactTypes.includes(type)) {
      updates.lastContactedAt = new Date();
    }
    await db.update(sponsors).set(updates).where(eq(sponsors.id, sponsorId));

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('Failed to create activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
