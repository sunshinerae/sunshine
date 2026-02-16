import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return NextResponse.json({ error: 'Search query must be at least 3 characters' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    // Single Claude call with web search tool — Claude searches the web itself
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 5,
          user_location: {
            type: 'approximate',
            city: 'Los Angeles',
            region: 'California',
            country: 'US',
            timezone: 'America/Los_Angeles',
          },
        },
      ],
      system: `You are a lead generation analyst for The Sunshine Effect, a wellness community for ambitious women in Los Angeles. The community hosts wellness events (Golden Hour: networking/coaching, Lunar Room: yoga/sound baths/meditation), offers 1:1 coaching, and retreats. The audience is women ages 25-40 in LA who value wellness, personal growth, community, and self-care.

Search the web for the user's query and find potential partners, venues, influencers, and businesses. For each relevant result, provide:
- Business/person name
- Contact info (email, phone if visible)
- Website URL
- Instagram handle (if visible)
- Category
- Location
- A relevance score (0-100) based on alignment with The Sunshine Effect
- A brief rationale for the score
- A warm, personalized outreach message written in Sunshine's voice (friendly, warm, genuine, not salesy)

After searching, respond with ONLY a JSON object in this structure:
{
  "results": [
    {
      "businessName": "...",
      "contactName": null,
      "email": null,
      "phone": null,
      "website": "...",
      "instagram": null,
      "category": "yoga|fitness|wellness|venue|influencer|beauty|food|lifestyle|meditation|breathwork|coaching|other",
      "location": "...",
      "relevanceScore": 85,
      "aiRationale": "...",
      "suggestedOutreach": "..."
    }
  ]
}

Rules:
- Only include actual businesses, venues, practitioners, or influencers (skip directories, articles, review sites)
- Set relevanceScore based on alignment with The Sunshine Effect's mission and audience
- Write outreach messages as if Sunshine herself is reaching out — warm, authentic, specific to what makes them a good fit
- If you can't determine a field, set it to null
- Sort results by relevanceScore descending
- Include at most 10 results`,
      messages: [
        {
          role: 'user',
          content: `Find potential leads and partners for The Sunshine Effect: ${query.trim()}`,
        },
      ],
    });

    // Extract text blocks from the response (skip server_tool_use and web_search_tool_result blocks)
    const textBlocks = message.content.filter((block) => block.type === 'text');
    const fullText = textBlocks.map((b) => 'text' in b ? b.text : '').join('');

    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ results: parsed.results ?? [], query: query.trim() });
  } catch (error) {
    console.error('Failed to run AI search:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
