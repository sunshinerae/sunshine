import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/db';
import { sponsors, sponsorPackages, sponsorDeals } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const { id } = await params;
    const sponsorId = parseInt(id, 10);
    if (isNaN(sponsorId)) {
      return NextResponse.json({ error: 'Invalid sponsor ID' }, { status: 400 });
    }

    const [sponsor] = await db.select().from(sponsors).where(eq(sponsors.id, sponsorId));
    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }

    // Get active packages for context
    const packages = await db
      .select()
      .from(sponsorPackages)
      .where(eq(sponsorPackages.isActive, true))
      .orderBy(asc(sponsorPackages.displayOrder));

    const packageInfo = packages.map((p) => {
      let benefits: string[] = [];
      try { benefits = p.benefits ? JSON.parse(p.benefits) : []; } catch { /* skip */ }
      return `- ${p.name} ($${p.suggestedValue?.toLocaleString() ?? 'custom'}): ${benefits.join(', ')}`;
    }).join('\n');

    const client = new Anthropic({ apiKey });

    const sponsorContext = [
      `Business: ${sponsor.businessName}`,
      sponsor.category ? `Category: ${sponsor.category}` : null,
      sponsor.website ? `Website: ${sponsor.website}` : null,
      sponsor.instagram ? `Instagram: @${sponsor.instagram}` : null,
      sponsor.contactName ? `Contact: ${sponsor.contactName}` : null,
      sponsor.brandFitRationale ? `Brand fit notes: ${sponsor.brandFitRationale}` : null,
    ].filter(Boolean).join('\n');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      system: `You are a partnership development specialist for The Sunshine Effect, a wellness community for ambitious women in Los Angeles. The community hosts wellness events (sound baths, breathwork, yoga, meditation), networking brunches, and personal development workshops. The audience is women ages 25-40 in LA who value wellness, personal growth, community, and self-care.

Available sponsorship packages:
${packageInfo || 'No packages defined yet - suggest custom arrangements.'}

Write a personalized sponsorship proposal in markdown format. Include:
1. A warm, professional opening that shows you understand their brand
2. Why partnering with The Sunshine Effect makes sense for them specifically
3. A recommended package or custom arrangement
4. Specific activation ideas tailored to their business
5. Key talking points for the outreach conversation

Keep the tone warm, professional, and specific to their brand. Avoid generic language.`,
      messages: [
        {
          role: 'user',
          content: `Generate a sponsorship proposal for:\n${sponsorContext}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({ proposal: textBlock.text });
  } catch (error) {
    console.error('Failed to generate proposal:', error);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}
