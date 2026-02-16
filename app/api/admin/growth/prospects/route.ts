import { NextResponse } from 'next/server';
import { db } from '@/db';
import { prospects, sponsors } from '@/db/schema';
import { eq, and, desc, ilike, or } from 'drizzle-orm';

const VALID_STATUSES = ['new', 'contacted', 'responded', 'converted', 'dismissed'] as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(prospects.businessName, `%${search}%`),
          ilike(prospects.contactName, `%${search}%`),
          ilike(prospects.email, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(prospects.status, status));
    }

    if (category) {
      conditions.push(eq(prospects.category, category));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const allProspects = await db
      .select()
      .from(prospects)
      .where(whereClause)
      .orderBy(desc(prospects.createdAt));

    return NextResponse.json({ prospects: allProspects });
  } catch (error) {
    console.error('Failed to fetch prospects:', error);
    return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessName, contactName, email, phone, website,
      instagram, category, location, relevanceScore,
      aiRationale, suggestedOutreach, source,
    } = body;

    if (!businessName || typeof businessName !== 'string') {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }

    const [prospect] = await db
      .insert(prospects)
      .values({
        businessName: businessName.trim(),
        contactName: contactName?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        website: website?.trim() || null,
        instagram: instagram?.trim() || null,
        category: category?.trim() || null,
        location: location?.trim() || null,
        relevanceScore: relevanceScore ?? null,
        aiRationale: aiRationale?.trim() || null,
        suggestedOutreach: suggestedOutreach?.trim() || null,
        source: source?.trim() || null,
        status: 'new',
      })
      .returning();

    return NextResponse.json({ prospect }, { status: 201 });
  } catch (error) {
    console.error('Failed to create prospect:', error);
    return NextResponse.json({ error: 'Failed to create prospect' }, { status: 500 });
  }
}
