import { NextResponse } from 'next/server';
import { db } from '@/db';
import { prospects, sponsors } from '@/db/schema';
import { eq } from 'drizzle-orm';

const VALID_STATUSES = ['new', 'contacted', 'responded', 'converted', 'dismissed'] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prospectId = parseInt(id, 10);
    if (isNaN(prospectId)) {
      return NextResponse.json({ error: 'Invalid prospect ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status, contactName, email, phone, website, instagram, category, location } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (status !== undefined) updates.status = status;
    if (contactName !== undefined) updates.contactName = contactName?.trim() || null;
    if (email !== undefined) updates.email = email?.trim() || null;
    if (phone !== undefined) updates.phone = phone?.trim() || null;
    if (website !== undefined) updates.website = website?.trim() || null;
    if (instagram !== undefined) updates.instagram = instagram?.trim() || null;
    if (category !== undefined) updates.category = category?.trim() || null;
    if (location !== undefined) updates.location = location?.trim() || null;

    const [updated] = await db
      .update(prospects)
      .set(updates)
      .where(eq(prospects.id, prospectId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    return NextResponse.json({ prospect: updated });
  } catch (error) {
    console.error('Failed to update prospect:', error);
    return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prospectId = parseInt(id, 10);
    if (isNaN(prospectId)) {
      return NextResponse.json({ error: 'Invalid prospect ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(prospects)
      .where(eq(prospects.id, prospectId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete prospect:', error);
    return NextResponse.json({ error: 'Failed to delete prospect' }, { status: 500 });
  }
}

// Convert a prospect to a sponsor
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prospectId = parseInt(id, 10);
    if (isNaN(prospectId)) {
      return NextResponse.json({ error: 'Invalid prospect ID' }, { status: 400 });
    }

    // Get the prospect
    const [prospect] = await db
      .select()
      .from(prospects)
      .where(eq(prospects.id, prospectId));

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    // Create a sponsor from the prospect
    const [sponsor] = await db
      .insert(sponsors)
      .values({
        businessName: prospect.businessName,
        contactName: prospect.contactName,
        email: prospect.email,
        phone: prospect.phone,
        website: prospect.website,
        instagram: prospect.instagram,
        category: prospect.category,
        location: prospect.location,
        stage: 'prospect',
        brandFitScore: prospect.relevanceScore,
        brandFitRationale: prospect.aiRationale,
      })
      .returning();

    // Update the prospect with the sponsor link
    await db
      .update(prospects)
      .set({
        status: 'converted',
        convertedToSponsorId: sponsor.id,
        updatedAt: new Date(),
      })
      .where(eq(prospects.id, prospectId));

    return NextResponse.json({ sponsor }, { status: 201 });
  } catch (error) {
    console.error('Failed to convert prospect to sponsor:', error);
    return NextResponse.json({ error: 'Failed to convert prospect' }, { status: 500 });
  }
}
