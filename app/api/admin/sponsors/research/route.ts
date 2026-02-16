import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { businessName, website, instagram } = body;

    if (!businessName || typeof businessName !== 'string') {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const details = [
      `Business: ${businessName}`,
      website ? `Website: ${website}` : null,
      instagram ? `Instagram: @${instagram.replace('@', '')}` : null,
    ].filter(Boolean).join('\n');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: `You are a brand partnership analyst for The Sunshine Effect, a wellness community for ambitious women in Los Angeles. The community hosts wellness events (sound baths, breathwork, yoga, meditation), networking brunches, and personal development workshops. The audience is women ages 25-40 in LA who value wellness, personal growth, community, and self-care.

Analyze the given business for sponsorship fit with The Sunshine Effect. Respond in JSON format only with this exact structure:
{
  "brandFitScore": <number 0-100>,
  "rationale": "<2-3 sentences explaining the score>",
  "suggestedApproach": "<1-2 sentences on how to approach them>",
  "keyInsights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "category": "<one of: wellness, beauty, fitness, venue, food-beverage, fashion, tech, health, lifestyle, other>"
}`,
      messages: [
        {
          role: 'user',
          content: `Research this business for potential sponsorship:\n${details}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Parse the JSON response
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ research: { businessName, website, instagram, ...result } });
  } catch (error) {
    console.error('Failed to research sponsor:', error);
    return NextResponse.json({ error: 'Failed to research sponsor' }, { status: 500 });
  }
}
