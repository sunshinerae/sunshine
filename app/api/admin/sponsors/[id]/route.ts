import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsors, sponsorActivities, sponsorDeals, sponsorPackages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

const VALID_STAGES = ['prospect', 'contacted', 'negotiating', 'confirmed', 'completed', 'declined'] as const;

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

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

    const [sponsor] = await db
      .select()
      .from(sponsors)
      .where(eq(sponsors.id, sponsorId));

    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    const activities = await db
      .select()
      .from(sponsorActivities)
      .where(eq(sponsorActivities.sponsorId, sponsorId))
      .orderBy(desc(sponsorActivities.createdAt));

    const deals = await db
      .select({
        id: sponsorDeals.id,
        sponsorId: sponsorDeals.sponsorId,
        packageId: sponsorDeals.packageId,
        dealValue: sponsorDeals.dealValue,
        inKindValue: sponsorDeals.inKindValue,
        inKindDescription: sponsorDeals.inKindDescription,
        status: sponsorDeals.status,
        notes: sponsorDeals.notes,
        createdAt: sponsorDeals.createdAt,
        updatedAt: sponsorDeals.updatedAt,
        packageName: sponsorPackages.name,
      })
      .from(sponsorDeals)
      .leftJoin(sponsorPackages, eq(sponsorDeals.packageId, sponsorPackages.id))
      .where(eq(sponsorDeals.sponsorId, sponsorId))
      .orderBy(desc(sponsorDeals.createdAt));

    return NextResponse.json({ sponsor, activities, deals });
  } catch (error) {
    console.error('Failed to fetch sponsor:', error);
    return NextResponse.json({ error: 'Failed to fetch sponsor' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sponsorId = parseInt(id, 10);
    if (isNaN(sponsorId)) {
      return NextResponse.json({ error: 'Invalid sponsor ID' }, { status: 400 });
    }

    const body = await request.json();
    const allowedFields = [
      'businessName', 'contactName', 'email', 'phone', 'website',
      'instagram', 'category', 'location', 'stage', 'starred',
      'brandFitScore', 'brandFitRationale', 'lastContactedAt',
    ] as const;

    if ('website' in body && body.website && !isValidUrl(body.website)) {
      return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 });
    }

    if ('stage' in body && !VALID_STAGES.includes(body.stage)) {
      return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
    }

    if ('brandFitScore' in body && body.brandFitScore != null) {
      if (typeof body.brandFitScore !== 'number' || body.brandFitScore < 0 || body.brandFitScore > 100) {
        return NextResponse.json({ error: 'Brand fit score must be 0-100' }, { status: 400 });
      }
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    // If stage changed, log it as an activity
    if ('stage' in body) {
      const [current] = await db.select({ stage: sponsors.stage }).from(sponsors).where(eq(sponsors.id, sponsorId));
      if (current && current.stage !== body.stage) {
        await db.insert(sponsorActivities).values({
          sponsorId,
          type: 'stage-change',
          title: `Stage changed from ${current.stage} to ${body.stage}`,
        });
      }
    }

    const [updated] = await db
      .update(sponsors)
      .set(updates)
      .where(eq(sponsors.id, sponsorId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    return NextResponse.json({ sponsor: updated });
  } catch (error) {
    console.error('Failed to update sponsor:', error);
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sponsorId = parseInt(id, 10);
    if (isNaN(sponsorId)) {
      return NextResponse.json({ error: 'Invalid sponsor ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(sponsors)
      .where(eq(sponsors.id, sponsorId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete sponsor:', error);
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 });
  }
}
