import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { eq } from 'drizzle-orm';

const MODEL = 'gemini-3-flash-preview';

const SYSTEM_PROMPT = `You are an expert brand strategist and designer. Generate a complete brand foundation based on the intake information provided. Be specific and unique to this business — avoid generic corporate language. Write for real humans, not robots.

Return a single JSON object with this exact structure (no markdown, no code fences, just raw JSON):`;

function buildUserPrompt(intake: {
  businessName: string;
  industry: string;
  keywords: string;
  about: string;
  targetCustomer: string;
  existingCopy?: string;
}) {
  return `Create a complete brand foundation for:

Business: ${intake.businessName}
Industry: ${intake.industry}
Vibe/Keywords: ${intake.keywords}
About: ${intake.about}
Target Customer: ${intake.targetCustomer}
${intake.existingCopy ? `Existing copy/voice sample: ${intake.existingCopy}` : ''}

Return this JSON structure:
{
  "identity": {
    "brandStory": "2-3 paragraph brand origin story, compelling and human",
    "mission": "One clear mission statement",
    "vision": "One aspirational vision statement",
    "values": [
      { "name": "Value Name", "description": "What this value means for the brand" }
    ],
    "personality": [
      { "trait": "Adjective", "description": "How this trait manifests in the brand" }
    ]
  },
  "voice": {
    "toneAttributes": ["warm", "witty", "approachable"],
    "elevatorPitch": "2-3 sentence elevator pitch",
    "taglines": ["Tagline option 1", "Tagline option 2", "Tagline option 3"],
    "messagingPillars": [
      { "title": "Pillar name", "description": "What this pillar covers" }
    ],
    "voiceGuide": {
      "dos": ["Do write like this", "Do use these words"],
      "donts": ["Don't write like this", "Don't use these words"]
    },
    "examplePhrases": ["Example phrase in brand voice 1", "Example 2", "Example 3"]
  },
  "visuals": {
    "colorPalettes": [
      {
        "name": "Palette Name",
        "primary": "#hex",
        "secondary": "#hex",
        "accent": "#hex",
        "background": "#hex",
        "text": "#hex",
        "psychology": "Why this palette works for the brand"
      }
    ],
    "fontPairings": [
      {
        "name": "Pairing Name",
        "heading": "Google Font Name",
        "body": "Google Font Name",
        "rationale": "Why these fonts work together"
      }
    ]
  },
  "audience": {
    "personas": [
      {
        "name": "Persona Name",
        "ageRange": "25-34",
        "occupation": "Their job",
        "location": "Where they live",
        "painPoints": ["Pain point 1", "Pain point 2"],
        "goals": ["Goal 1", "Goal 2"],
        "channels": ["Instagram", "TikTok"]
      }
    ]
  }
}

Generate exactly 5 values, 5 personality traits, 3 taglines, 4 messaging pillars, 3 color palettes, 3 font pairings, and 2-3 personas. Make everything specific to this business.`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const { id } = await params;
    const deckId = parseInt(id, 10);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: 'Invalid deck ID' }, { status: 400 });
    }

    const body = await request.json();
    if (body.step !== 'foundation') {
      return NextResponse.json({ error: 'Invalid step. Expected "foundation"' }, { status: 400 });
    }

    // Fetch the deck
    const [deck] = await db
      .select()
      .from(brandDecks)
      .where(eq(brandDecks.id, deckId));

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    if (!deck.intake) {
      return NextResponse.json({ error: 'No intake data found. Complete the intake form first.' }, { status: 400 });
    }

    // Parse intake data
    let intake: {
      businessName: string;
      industry: string;
      keywords: string;
      about: string;
      targetCustomer: string;
      existingCopy?: string;
    };
    try {
      intake = JSON.parse(deck.intake);
    } catch {
      return NextResponse.json({ error: 'Invalid intake data format' }, { status: 400 });
    }

    if (!intake.businessName || !intake.industry || !intake.about || !intake.targetCustomer) {
      return NextResponse.json({ error: 'Incomplete intake data. businessName, industry, about, and targetCustomer are required.' }, { status: 400 });
    }

    // Call Gemini
    const client = new GoogleGenAI({ apiKey });

    const response = await client.models.generateContent({
      model: MODEL,
      contents: buildUserPrompt(intake),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 8192,
        temperature: 0.8,
      },
    });

    const text = response.text ?? '';

    // Parse JSON from response
    let parsed: {
      identity: Record<string, unknown>;
      audience: Record<string, unknown>;
      voice: Record<string, unknown>;
      visuals: Record<string, unknown>;
    };

    try {
      // Try direct parse first
      parsed = JSON.parse(text);
    } catch {
      // Fall back to regex extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Failed to parse Gemini response:', text.slice(0, 500));
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
      }
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        console.error('Failed to parse extracted JSON:', parseErr);
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
      }
    }

    // Validate required top-level keys
    if (!parsed.identity || !parsed.voice || !parsed.visuals || !parsed.audience) {
      console.error('AI response missing required sections:', Object.keys(parsed));
      return NextResponse.json({ error: 'AI response missing required sections' }, { status: 500 });
    }

    // Save generated content to DB
    const [updated] = await db
      .update(brandDecks)
      .set({
        identity: JSON.stringify(parsed.identity),
        voice: JSON.stringify(parsed.voice),
        visuals: JSON.stringify(parsed.visuals),
        audience: JSON.stringify(parsed.audience),
        currentStep: 1,
        updatedAt: new Date(),
      })
      .where(eq(brandDecks.id, deckId))
      .returning();

    return NextResponse.json({
      deck: updated,
      generated: {
        identity: parsed.identity,
        voice: parsed.voice,
        visuals: parsed.visuals,
        audience: parsed.audience,
      },
    });
  } catch (error) {
    console.error('Failed to generate brand foundation:', error);
    return NextResponse.json({ error: 'Failed to generate brand foundation' }, { status: 500 });
  }
}
