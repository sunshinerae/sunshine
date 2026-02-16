import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsorPackages } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const packages = await db
      .select()
      .from(sponsorPackages)
      .orderBy(asc(sponsorPackages.displayOrder));

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Failed to fetch packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, suggestedValue, benefits, isActive, displayOrder } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Package name is required' }, { status: 400 });
    }

    const [pkg] = await db
      .insert(sponsorPackages)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
        suggestedValue: suggestedValue ?? null,
        benefits: benefits ? JSON.stringify(benefits) : null,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
      })
      .returning();

    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch (error) {
    console.error('Failed to create package:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
