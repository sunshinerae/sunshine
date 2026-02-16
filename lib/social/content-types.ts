/**
 * Content Types & Weights — The Sunshine Effect
 *
 * Weighted random selection for content variety.
 * Each type has a generation prompt template.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentType =
  | 'event_promo'
  | 'wellness_eeat'
  | 'humor_personality'
  | 'sponsor_spotlight'
  | 'community_recap';

export interface ContentTypeConfig {
  weight: number;
  description: string;
  twitterPrompt: string;
  instagramPrompt: string;
}

// ---------------------------------------------------------------------------
// Weights & Prompts
// ---------------------------------------------------------------------------

export const CONTENT_TYPES: Record<ContentType, ContentTypeConfig> = {
  event_promo: {
    weight: 30,
    description: 'Upcoming events as friend invites',
    twitterPrompt: [
      'Write a tweet promoting an upcoming Sunshine Effect event.',
      'Make it sound like a text from a friend inviting someone.',
      'Include the vibe, not just the logistics.',
      'Example energy: "breathwork at the loft saturday. last time someone cried and then we all got tacos. you should come"',
    ].join('\n'),
    instagramPrompt: [
      'Write an Instagram caption promoting an upcoming Sunshine Effect event.',
      'Lead with the feeling, not the details. Details can come after.',
      'Make it sound like a voice memo to a friend.',
      'Keep it 2-4 short paragraphs max.',
    ].join('\n'),
  },

  wellness_eeat: {
    weight: 25,
    description: 'Accessible wellness knowledge, E-E-A-T style',
    twitterPrompt: [
      'Write a tweet sharing a wellness insight or fact.',
      'Make it feel like "oh I just learned this cool thing" not "according to studies..."',
      'Ground it in real science or experience but keep it conversational.',
      'Example energy: "your nervous system doesn\'t know the difference between a lion and your inbox. that\'s why breathwork works"',
    ].join('\n'),
    instagramPrompt: [
      'Write an Instagram caption sharing a wellness insight.',
      'Start with something relatable, then drop the knowledge.',
      'Can be 2-3 short paragraphs. Teach without being preachy.',
      'End with something that invites reflection, not a call to action.',
    ].join('\n'),
  },

  humor_personality: {
    weight: 20,
    description: 'Relatable wellness humor, one-liners, personality',
    twitterPrompt: [
      'Write a funny, relatable tweet about wellness culture, LA life, or being a woman trying to take care of herself.',
      'It should make someone screenshot and send to a friend.',
      'One-liners or short observations work best.',
      'Example energy: "me booking another sound bath when my rent is due tomorrow"',
    ].join('\n'),
    instagramPrompt: [
      'Write a funny, relatable Instagram caption about wellness culture, LA life, or modern womanhood.',
      'Can be a one-liner or a short relatable observation.',
      'The kind of thing that gets shared to stories.',
      'Keep it short — humor dies in long captions.',
    ].join('\n'),
  },

  sponsor_spotlight: {
    weight: 15,
    description: 'Organic sponsor mention woven into real content',
    twitterPrompt: [
      'Write a tweet that organically mentions a sponsor brand.',
      'It should NOT feel like an ad. Weave the brand into a real thought or experience.',
      'Think "I tried X at the event and now I can\'t stop" not "Thanks to our sponsor X!"',
      'If given sponsor info, reference their actual product/service naturally.',
    ].join('\n'),
    instagramPrompt: [
      'Write an Instagram caption that naturally features a sponsor.',
      'Lead with a genuine experience or observation, not the brand.',
      'Mention the brand mid-caption, not at the start.',
      'Make it feel like a recommendation to a friend, not a paid post.',
    ].join('\n'),
  },

  community_recap: {
    weight: 10,
    description: 'Event recaps, member shoutouts, community moments',
    twitterPrompt: [
      'Write a tweet recapping a recent Sunshine Effect event or community moment.',
      'Focus on a specific moment or feeling, not a summary.',
      'Example energy: "last saturday 30 women sat in a circle and nobody checked their phone for 2 hours. that\'s the whole tweet"',
    ].join('\n'),
    instagramPrompt: [
      'Write an Instagram caption recapping a recent Sunshine event.',
      'Pick one moment that captures the feeling.',
      'Can mention specific things that happened (without naming people unless told to).',
      'End with gratitude that feels real, not performative.',
    ].join('\n'),
  },
};

// ---------------------------------------------------------------------------
// Weighted Random Selection
// ---------------------------------------------------------------------------

export function pickContentType(): ContentType {
  const entries = Object.entries(CONTENT_TYPES) as [ContentType, ContentTypeConfig][];
  const totalWeight = entries.reduce((sum, [, config]) => sum + config.weight, 0);
  let random = Math.random() * totalWeight;

  for (const [type, config] of entries) {
    random -= config.weight;
    if (random <= 0) return type;
  }

  return 'wellness_eeat';
}

/**
 * Get the generation prompt for a content type and platform.
 */
export function getPrompt(type: ContentType, platform: 'twitter' | 'instagram'): string {
  const config = CONTENT_TYPES[type];
  return platform === 'twitter' ? config.twitterPrompt : config.instagramPrompt;
}
