import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsors, sponsorDeals } from '@/db/schema';
import { eq, and, desc, ilike, or, sql } from 'drizzle-orm';

const VALID_STAGES = ['prospect', 'contacted', 'negotiating', 'confirmed', 'completed', 'declined'] as const;

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const stage = searchParams.get('stage');
    const category = searchParams.get('category');
    const starred = searchParams.get('starred');

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(sponsors.businessName, `%${search}%`),
          ilike(sponsors.contactName, `%${search}%`),
          ilike(sponsors.email, `%${search}%`)
        )
      );
    }

    if (stage) {
      conditions.push(eq(sponsors.stage, stage));
    }

    if (category) {
      conditions.push(eq(sponsors.category, category));
    }

    if (starred === 'true') {
      conditions.push(eq(sponsors.starred, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const allSponsors = await db
      .select()
      .from(sponsors)
      .where(whereClause)
      .orderBy(desc(sponsors.updatedAt));

    // Get deal totals per sponsor
    const dealTotals = await db
      .select({
        sponsorId: sponsorDeals.sponsorId,
        totalValue: sql<number>`coalesce(sum(${sponsorDeals.dealValue}), 0)`,
        totalInKind: sql<number>`coalesce(sum(${sponsorDeals.inKindValue}), 0)`,
      })
      .from(sponsorDeals)
      .where(eq(sponsorDeals.status, 'active'))
      .groupBy(sponsorDeals.sponsorId);

    const dealMap = new Map(dealTotals.map((d) => [d.sponsorId, d]));

    const enriched = allSponsors.map((s) => ({
      ...s,
      dealTotal: dealMap.get(s.id)?.totalValue ?? 0,
      inKindTotal: dealMap.get(s.id)?.totalInKind ?? 0,
    }));

    return NextResponse.json({ sponsors: enriched });
  } catch (error) {
    console.error('Failed to fetch sponsors:', error);
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, contactName, email, phone, website, instagram, category, location, stage, brandFitScore, brandFitRationale } = body;

    if (!businessName || typeof businessName !== 'string') {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }

    const sanitizedWebsite = website?.trim() || null;
    if (sanitizedWebsite && !isValidUrl(sanitizedWebsite)) {
      return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 });
    }

    if (stage && !VALID_STAGES.includes(stage)) {
      return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
    }

    if (brandFitScore != null && (typeof brandFitScore !== 'number' || brandFitScore < 0 || brandFitScore > 100)) {
      return NextResponse.json({ error: 'Brand fit score must be 0-100' }, { status: 400 });
    }

    const [sponsor] = await db
      .insert(sponsors)
      .values({
        businessName: businessName.trim(),
        contactName: contactName?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        website: sanitizedWebsite,
        instagram: instagram?.trim() || null,
        category: category?.trim() || null,
        location: location?.trim() || null,
        stage: stage || 'prospect',
        brandFitScore: brandFitScore ?? null,
        brandFitRationale: brandFitRationale?.trim() || null,
      })
      .returning();

    return NextResponse.json({ sponsor }, { status: 201 });
  } catch (error) {
    console.error('Failed to create sponsor:', error);
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 });
  }
}
