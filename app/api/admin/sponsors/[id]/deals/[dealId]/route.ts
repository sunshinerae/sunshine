import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsorDeals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; dealId: string }> }
) {
  try {
    const { id, dealId } = await params;
    const sponsorId = parseInt(id, 10);
    const parsedDealId = parseInt(dealId, 10);
    if (isNaN(sponsorId) || isNaN(parsedDealId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();

    const validStatuses = ['pending', 'active', 'fulfilled', 'cancelled'];
    if ('status' in body && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid deal status' }, { status: 400 });
    }

    const allowedFields = ['packageId', 'dealValue', 'inKindValue', 'inKindDescription', 'status', 'notes'] as const;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    const [updated] = await db
      .update(sponsorDeals)
      .set(updates)
      .where(and(eq(sponsorDeals.id, parsedDealId), eq(sponsorDeals.sponsorId, sponsorId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ deal: updated });
  } catch (error) {
    console.error('Failed to update deal:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; dealId: string }> }
) {
  try {
    const { id, dealId } = await params;
    const sponsorId = parseInt(id, 10);
    const parsedDealId = parseInt(dealId, 10);
    if (isNaN(sponsorId) || isNaN(parsedDealId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(sponsorDeals)
      .where(and(eq(sponsorDeals.id, parsedDealId), eq(sponsorDeals.sponsorId, sponsorId)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete deal:', error);
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }
}
