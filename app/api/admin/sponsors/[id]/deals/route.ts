import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsors, sponsorDeals, sponsorPackages, sponsorActivities } from '@/db/schema';
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

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
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

    const [sponsor] = await db.select({ id: sponsors.id, businessName: sponsors.businessName }).from(sponsors).where(eq(sponsors.id, sponsorId));
    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    const body = await request.json();
    const { packageId, dealValue, inKindValue, inKindDescription, status, notes } = body;

    if (dealValue == null || typeof dealValue !== 'number') {
      return NextResponse.json({ error: 'Deal value is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'active', 'fulfilled', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid deal status' }, { status: 400 });
    }

    const [deal] = await db
      .insert(sponsorDeals)
      .values({
        sponsorId,
        packageId: packageId || null,
        dealValue,
        inKindValue: inKindValue || 0,
        inKindDescription: inKindDescription?.trim() || null,
        status: status || 'pending',
        notes: notes?.trim() || null,
      })
      .returning();

    // Log activity
    await db.insert(sponsorActivities).values({
      sponsorId,
      type: 'note',
      title: `Deal created: $${dealValue.toLocaleString()}`,
    });

    // Update sponsor updatedAt
    await db.update(sponsors).set({ updatedAt: new Date() }).where(eq(sponsors.id, sponsorId));

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error('Failed to create deal:', error);
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}
