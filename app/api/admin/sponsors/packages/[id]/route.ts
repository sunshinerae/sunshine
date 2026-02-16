import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsorPackages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = parseInt(id, 10);
    if (isNaN(packageId)) {
      return NextResponse.json({ error: 'Invalid package ID' }, { status: 400 });
    }

    const body = await request.json();
    const allowedFields = ['name', 'description', 'suggestedValue', 'benefits', 'isActive', 'displayOrder'] as const;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = field === 'benefits' && Array.isArray(body[field])
          ? JSON.stringify(body[field])
          : body[field];
      }
    }

    const [updated] = await db
      .update(sponsorPackages)
      .set(updates)
      .where(eq(sponsorPackages.id, packageId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ package: updated });
  } catch (error) {
    console.error('Failed to update package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = parseInt(id, 10);
    if (isNaN(packageId)) {
      return NextResponse.json({ error: 'Invalid package ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(sponsorPackages)
      .where(eq(sponsorPackages.id, packageId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete package:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
