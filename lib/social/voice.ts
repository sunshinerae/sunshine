/**
 * Sunshine Voice — Content Generation Engine
 *
 * System prompt and validation for generating content that sounds
 * like a real person, not a brand or ChatGPT.
 */

import Anthropic from '@anthropic-ai/sdk';

// ---------------------------------------------------------------------------
// Voice Definition
// ---------------------------------------------------------------------------

export const SUNSHINE_VOICE_PROMPT = `You are the voice of The Sunshine Effect — a wellness community for women in LA run by a real woman who's funny, warm, and direct.

Rules:
- Write like a text from a friend, not a brand
- Use lowercase when it feels natural
- Humor > polish. Imperfect > corporate
- Short punchy sentences. One-liners welcome
- LA-specific references (neighborhoods, spots, vibes)
- If promoting an event, make it sound like an invite from a friend
- Wellness knowledge should feel like "oh I learned this cool thing" not "studies show that..."
- No hashtags in the main text — those get added separately
- Match the platform's vibe (Twitter = punchy and concise, IG = slightly longer but still casual)`;

// ---------------------------------------------------------------------------
// Forbidden Phrases
// ---------------------------------------------------------------------------

const FORBIDDEN_PHRASES = [
  'journey',
  'transform',
  'transformative',
  'empower',
  'empowering',
  'self-care sunday',
  'queen',
  'goddess energy',
  'divine feminine',
  'link in bio',
  'check out our',
  'dm me',
  'click the link',
  'use code',
  'discount',
  'limited time',
  'don\'t miss out',
  'act now',
  'swipe up',
  'tap the link',
];

export function containsForbiddenPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return FORBIDDEN_PHRASES.filter((phrase) => lower.includes(phrase));
}

// ---------------------------------------------------------------------------
// Emoji Spam Check
// ---------------------------------------------------------------------------

const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

export function hasEmojiSpam(text: string): boolean {
  const matches = text.match(EMOJI_REGEX);
  if (!matches) return false;

  // Check for 3+ consecutive emojis
  const consecutive = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]{3,}/gu);
  return !!consecutive;
}

// ---------------------------------------------------------------------------
// Content Generation
// ---------------------------------------------------------------------------

function extractText(response: Anthropic.Message): string {
  const block = response.content[0];
  if (!block || block.type !== 'text') {
    throw new Error('Unexpected Anthropic response: no text block returned');
  }
  let text = block.text.trim();
  // Strip wrapping quotes
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim();
  }
  return text;
}

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic();
  }
  return _client;
}

export interface GenerateOptions {
  /** What kind of content: tweet, ig_caption, reply, comment */
  format: 'tweet' | 'ig_caption' | 'reply' | 'comment';
  /** The main prompt/instruction */
  prompt: string;
  /** Extra context (e.g. tweet being replied to, post caption) */
  context?: string;
  /** Max character length */
  maxLength?: number;
}

export async function generateContent(options: GenerateOptions): Promise<string> {
  const { format, prompt, context, maxLength } = options;

  const formatInstructions: Record<string, string> = {
    tweet: 'Write a tweet. Max 280 characters. No hashtags.',
    ig_caption: 'Write an Instagram caption. Can be 1-3 short paragraphs. No hashtags (added separately).',
    reply: 'Write a Twitter reply. Max 280 characters. Reference something specific from the original tweet.',
    comment: 'Write an Instagram comment. Max 400 characters. Reference something specific from the post.',
  };

  const systemPrompt = [
    SUNSHINE_VOICE_PROMPT,
    '',
    'Format: ' + formatInstructions[format],
    '',
    'Output ONLY the text. No quotes, no meta-commentary, no explanations.',
  ].join('\n');

  const userMessage = context
    ? `Context:\n${context}\n\nInstruction:\n${prompt}`
    : prompt;

  const client = getClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  let text = extractText(response);

  // Validate
  const violations = containsForbiddenPhrases(text);
  if (violations.length > 0 || hasEmojiSpam(text)) {
    // Regenerate once
    const retryLines = [userMessage, ''];
    if (violations.length > 0) {
      retryLines.push('IMPORTANT: Do NOT use these words/phrases: ' + violations.join(', '));
    }
    if (hasEmojiSpam(text)) {
      retryLines.push('Do NOT use more than 2 emojis in a row.');
    }

    const retry = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: retryLines.join('\n') }],
    });

    text = extractText(retry);
  }

  // Enforce length limit
  const limit = maxLength || (format === 'tweet' || format === 'reply' ? 280 : format === 'comment' ? 400 : 2200);
  if (text.length > limit) {
    text = text.substring(0, limit - 3) + '...';
  }

  return text;
}
