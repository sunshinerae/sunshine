import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { eq } from 'drizzle-orm';

const MODEL = 'gemini-3-flash-preview';

const SYSTEM_PROMPT = `You are an expert brand strategist and designer. Generate a complete brand foundation based on the intake information provided. Be specific and unique to this business — avoid generic corporate language. Write for real humans, not robots.

Return a single JSON object with this exact structure (no markdown, no code fences, just raw JSON):`;

const REGEN_SYSTEM_PROMPT =
  'You are an expert brand strategist. Return only valid JSON — no markdown, no code fences, just raw JSON.';

const VALID_SECTIONS = [
  'brandStory',
  'taglines',
  'personas',
  'voiceGuide',
  'colorPalettes',
  'elevatorPitch',
  'values',
] as const;

type Section = (typeof VALID_SECTIONS)[number];

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

function buildRegenPrompt(
  section: Section,
  intake: {
    businessName: string;
    industry: string;
    keywords: string;
    about: string;
    targetCustomer: string;
  },
  identity: Record<string, unknown>,
  voice: Record<string, unknown>
): string {
  const personality = Array.isArray(identity.personality)
    ? (identity.personality as Array<{ trait: string }>).map((p) => p.trait).join(', ')
    : intake.keywords;

  switch (section) {
    case 'brandStory':
      return `Generate a new brand story (2-3 paragraphs) for "${intake.businessName}", a ${intake.industry} business.

About: ${intake.about}
Target customer: ${intake.targetCustomer}
Brand personality: ${personality}

Make it compelling, human, and specific. No generic corporate language.

Return JSON: { "brandStory": "..." }`;

    case 'taglines':
      return `Generate 3 new tagline options for "${intake.businessName}" (${intake.industry}).

Brand personality: ${personality}
About: ${intake.about}
Target customer: ${intake.targetCustomer}

Taglines should be memorable, distinct, and on-brand. No clichés.

Return JSON: { "taglines": ["...", "...", "..."] }`;

    case 'personas':
      return `Generate 2-3 customer personas for "${intake.businessName}" (${intake.industry}).

Target customer: ${intake.targetCustomer}
About: ${intake.about}
Brand personality: ${personality}

Return JSON: { "personas": [{ "name": "...", "ageRange": "...", "occupation": "...", "location": "...", "painPoints": ["..."], "goals": ["..."], "channels": ["..."] }] }`;

    case 'voiceGuide':
      return `Generate a brand voice guide for "${intake.businessName}" (${intake.industry}).

Brand personality: ${personality}
About: ${intake.about}
Target customer: ${intake.targetCustomer}

Include tone attributes, do/don't writing rules, and example phrases in this voice.

Return JSON: { "voiceGuide": { "dos": ["..."], "donts": ["..."] }, "toneAttributes": ["...", "...", "..."], "examplePhrases": ["...", "...", "..."] }`;

    case 'colorPalettes':
      return `Generate 3 color palette options for "${intake.businessName}" (${intake.industry}).

Brand personality: ${personality}
About: ${intake.about}

Each palette should have a distinct mood. Use exact hex codes.

Return JSON: { "colorPalettes": [{ "name": "...", "primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex", "psychology": "..." }] }`;

    case 'elevatorPitch':
      return `Write a new 2-3 sentence elevator pitch for "${intake.businessName}" (${intake.industry}).

Mission: ${(identity.mission as string) || ''}
Target customer: ${intake.targetCustomer}
About: ${intake.about}
Brand personality: ${personality}

Be conversational and compelling, not corporate.

Return JSON: { "elevatorPitch": "..." }`;

    case 'values':
      return `Generate 5 core brand values for "${intake.businessName}" (${intake.industry}).

Brand personality: ${personality}
About: ${intake.about}
Target customer: ${intake.targetCustomer}

Make values specific and meaningful to this brand. Avoid generic values like integrity, innovation, or excellence.

Return JSON: { "values": [{ "name": "...", "description": "..." }] }`;
  }
}

function parseGeminiJson(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
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

    if (body.step !== 'foundation' && body.step !== 'regenerate') {
      return NextResponse.json(
        { error: 'Invalid step. Expected "foundation" or "regenerate"' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'No intake data found. Complete the intake form first.' },
        { status: 400 }
      );
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
      return NextResponse.json(
        {
          error:
            'Incomplete intake data. businessName, industry, about, and targetCustomer are required.',
        },
        { status: 400 }
      );
    }

    const client = new GoogleGenAI({ apiKey });

    // -------------------------------------------------------------------------
    // REGENERATE: refresh a single section
    // -------------------------------------------------------------------------
    if (body.step === 'regenerate') {
      const section = body.section as Section | undefined;

      if (!section) {
        return NextResponse.json({ error: 'Section required' }, { status: 400 });
      }

      if (!(VALID_SECTIONS as readonly string[]).includes(section)) {
        return NextResponse.json(
          { error: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}` },
          { status: 400 }
        );
      }

      // Parse existing column data for context
      const identity: Record<string, unknown> = deck.identity
        ? JSON.parse(deck.identity)
        : {};
      const voice: Record<string, unknown> = deck.voice ? JSON.parse(deck.voice) : {};
      const visuals: Record<string, unknown> = deck.visuals ? JSON.parse(deck.visuals) : {};
      const audience: Record<string, unknown> = deck.audience
        ? JSON.parse(deck.audience)
        : {};

      const prompt = buildRegenPrompt(section, intake, identity, voice);

      const regenResponse = await client.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction: REGEN_SYSTEM_PROMPT,
          maxOutputTokens: 2048,
          temperature: 0.9,
        },
      });

      const regenText = regenResponse.text ?? '';
      const regen = parseGeminiJson(regenText);

      if (!regen) {
        console.error(`Failed to parse Gemini regenerate response for "${section}":`, regenText.slice(0, 500));
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
      }

      // Determine which DB column to update and merge regenerated fields
      type TargetColumn = 'identity' | 'voice' | 'visuals' | 'audience';
      let targetColumn: TargetColumn;
      let updatedColumnData: Record<string, unknown>;

      switch (section) {
        case 'brandStory':
          targetColumn = 'identity';
          updatedColumnData = { ...identity, brandStory: regen.brandStory };
          break;
        case 'taglines':
          targetColumn = 'voice';
          updatedColumnData = { ...voice, taglines: regen.taglines };
          break;
        case 'personas':
          targetColumn = 'audience';
          updatedColumnData = { ...audience, personas: regen.personas };
          break;
        case 'voiceGuide':
          targetColumn = 'voice';
          updatedColumnData = {
            ...voice,
            voiceGuide: regen.voiceGuide,
            toneAttributes: regen.toneAttributes,
            examplePhrases: regen.examplePhrases,
          };
          break;
        case 'colorPalettes':
          targetColumn = 'visuals';
          updatedColumnData = { ...visuals, colorPalettes: regen.colorPalettes };
          break;
        case 'elevatorPitch':
          targetColumn = 'voice';
          updatedColumnData = { ...voice, elevatorPitch: regen.elevatorPitch };
          break;
        case 'values':
          targetColumn = 'identity';
          updatedColumnData = { ...identity, values: regen.values };
          break;
      }

      await db
        .update(brandDecks)
        .set({
          [targetColumn]: JSON.stringify(updatedColumnData),
          updatedAt: new Date(),
        })
        .where(eq(brandDecks.id, deckId));

      return NextResponse.json({ section, data: regen });
    }

    // -------------------------------------------------------------------------
    // FOUNDATION: generate everything at once
    // -------------------------------------------------------------------------
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

    let parsed: {
      identity: Record<string, unknown>;
      audience: Record<string, unknown>;
      voice: Record<string, unknown>;
      visuals: Record<string, unknown>;
    };

    const rawParsed = parseGeminiJson(text);
    if (!rawParsed) {
      console.error('Failed to parse Gemini response:', text.slice(0, 500));
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }
    parsed = rawParsed as typeof parsed;

    // Validate required top-level keys
    if (!parsed.identity || !parsed.voice || !parsed.visuals || !parsed.audience) {
      console.error('AI response missing required sections:', Object.keys(parsed));
      return NextResponse.json(
        { error: 'AI response missing required sections' },
        { status: 500 }
      );
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
