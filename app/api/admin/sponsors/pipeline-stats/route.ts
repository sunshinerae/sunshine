import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sponsors, sponsorDeals } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Stage counts
    const stageCounts = await db
      .select({
        stage: sponsors.stage,
        count: sql<number>`count(*)::int`,
      })
      .from(sponsors)
      .groupBy(sponsors.stage);

    // Total confirmed deal values
    const [dealStats] = await db
      .select({
        totalValue: sql<number>`coalesce(sum(${sponsorDeals.dealValue}), 0)`,
        totalInKind: sql<number>`coalesce(sum(${sponsorDeals.inKindValue}), 0)`,
        dealCount: sql<number>`count(*)::int`,
      })
      .from(sponsorDeals)
      .where(eq(sponsorDeals.status, 'active'));

    // Pipeline value (deals in pending status)
    const [pipelineStats] = await db
      .select({
        pipelineValue: sql<number>`coalesce(sum(${sponsorDeals.dealValue}), 0)`,
      })
      .from(sponsorDeals)
      .where(eq(sponsorDeals.status, 'pending'));

    const stageMap = Object.fromEntries(stageCounts.map((s) => [s.stage, s.count]));

    return NextResponse.json({
      stages: stageMap,
      totalSponsors: stageCounts.reduce((sum, s) => sum + s.count, 0),
      confirmedDeals: dealStats?.dealCount ?? 0,
      confirmedValue: dealStats?.totalValue ?? 0,
      confirmedInKind: dealStats?.totalInKind ?? 0,
      pipelineValue: pipelineStats?.pipelineValue ?? 0,
    });
  } catch (error) {
    console.error('Failed to fetch pipeline stats:', error);
    return NextResponse.json({ error: 'Failed to fetch pipeline stats' }, { status: 500 });
  }
}
