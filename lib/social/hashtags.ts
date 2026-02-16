/**
 * Hashtag Bank — The Sunshine Effect
 *
 * Branded hashtags, content hashtags, and outreach vertical bank
 * for Instagram commenting pipeline.
 */

// ---------------------------------------------------------------------------
// Branded & Content Hashtags (for our own posts)
// ---------------------------------------------------------------------------

export const HASHTAG_SETS = {
  branded: [
    '#TheSunshineEffect',
    '#SunshineLA',
    '#SunshineWellness',
  ],
  wellness: [
    '#WellnessLA',
    '#LAWellness',
    '#WellnessCommunity',
    '#HolisticWellness',
    '#WomenWellness',
    '#MindBodySoul',
  ],
  community: [
    '#WomenOfLA',
    '#LACommunity',
    '#WomenSupportingWomen',
    '#Sisterhood',
    '#CommunityOverCompetition',
  ],
  events: [
    '#LAEvents',
    '#WellnessEvent',
    '#ThingsToDoInLA',
    '#LANightlife',
    '#PopUpLA',
  ],
  practices: [
    '#Breathwork',
    '#SoundBath',
    '#Meditation',
    '#YogaLA',
    '#WomensCircle',
    '#SoundHealing',
  ],
} as const;

// ---------------------------------------------------------------------------
// Outreach Vertical Bank (for IG commenting pipeline)
// ---------------------------------------------------------------------------

export type OutreachVertical =
  | 'yoga_movement'
  | 'breathwork_somatic'
  | 'sound_healing'
  | 'womens_circles'
  | 'holistic_nutrition'
  | 'la_lifestyle'
  | 'mental_health_accessible'
  | 'fitness_movement';

export interface VerticalConfig {
  sunshineConnection: string;
  hashtags: string[];
  conversationAngles: string[];
  captionKeywords: string[];
}

export const OUTREACH_VERTICALS: Record<OutreachVertical, VerticalConfig> = {
  yoga_movement: {
    sunshineConnection: 'group yoga at events, movement workshops',
    hashtags: ['layoga', 'yogalosangeles', 'vinyasaflow', 'yogateacher', 'morningyoga', 'yogalife', 'yogapractice', 'yogaeveryday'],
    conversationAngles: [
      'how different styles target different nervous system states',
      'fascia release and why your body shakes in deep holds',
      'the vagus nerve connection between breath and flexibility',
    ],
    captionKeywords: ['flow', 'practice', 'mat', 'alignment', 'breathe', 'stretch', 'vinyasa', 'restore', 'yin', 'open'],
  },

  breathwork_somatic: {
    sunshineConnection: 'breathwork sessions, somatic workshops',
    hashtags: ['breathworkhealing', 'breathworkjourney', 'somatichealing', 'somaticexperiencing', 'nervousystemregulation', 'polyvagal', 'traumarelease', 'breathworkfacilitator', 'holotropic'],
    conversationAngles: [
      'CO2 tolerance and why you feel dizzy (it\'s not oxygen)',
      'sympathetic vs parasympathetic activation patterns',
      'why emotional release happens during specific breath patterns',
    ],
    captionKeywords: ['nervous system', 'regulate', 'activate', 'exhale', 'hold', 'round', 'release', 'shake', 'tremor', 'freeze', 'fight or flight'],
  },

  sound_healing: {
    sunshineConnection: 'sound bath events, singing bowl sessions',
    hashtags: ['soundbathla', 'soundhealing', 'singingbowls', 'soundbath', 'crystalbowls', 'soundtherapy', 'vibrationalhealing', 'gongbath', 'soundjourney'],
    conversationAngles: [
      'frequency entrainment and why your brain syncs to bowls',
      'the difference between Tibetan and crystal bowl frequencies',
      'why sound baths make people cry (limbic system bypass)',
    ],
    captionKeywords: ['frequency', 'vibration', 'hertz', 'bowl', 'gong', 'tone', 'resonance', 'tuning', 'overtone', 'binaural'],
  },

  womens_circles: {
    sunshineConnection: 'core Sunshine offering, monthly circles',
    hashtags: ['womenscircle', 'sacredfeminine', 'sisterhood', 'wombhealing', 'moonceremony', 'redtent', 'womensretreat', 'circlekeeper', 'feminineenergy', 'womensgathering'],
    conversationAngles: [
      'the neuroscience of co-regulation in group settings',
      'oxytocin release patterns in women-only spaces',
      'why ritual and rhythm matter for nervous system safety',
    ],
    captionKeywords: ['circle', 'sisters', 'gather', 'hold space', 'witnessed', 'share', 'moon', 'ceremony', 'intention', 'sacred', 'container'],
  },

  holistic_nutrition: {
    sunshineConnection: 'wellness education, event refreshments, partnerships',
    hashtags: ['holisticnutrition', 'guthealth', 'functionalnutrition', 'foodismedicine', 'antiinflammatory', 'adaptogen', 'nervousfood', 'nutritioncoach'],
    conversationAngles: [
      'gut-brain axis and why your stomach affects your mood',
      'adaptogen basics without the woo (ashwagandha cortisol studies)',
      'magnesium types and which one actually helps sleep',
    ],
    captionKeywords: ['gut', 'microbiome', 'cortisol', 'adaptogen', 'inflammation', 'supplement', 'mineral', 'vitamin', 'nourish', 'heal'],
  },

  la_lifestyle: {
    sunshineConnection: 'local community building, event attendance',
    hashtags: ['lalife', 'losangeleslife', 'thingstodoinla', 'laevents', 'silverlake', 'echoparkla', 'highlandparkla', 'westhollywood', 'venicela', 'santamonicavibes', 'lawellness'],
    conversationAngles: [
      'hidden wellness spots in different LA neighborhoods',
      'seasonal wellness in LA (marine layer blues, fire season stress)',
      'why LA\'s wellness scene is different from anywhere else',
    ],
    captionKeywords: ['LA', 'los angeles', 'neighborhood', 'local', 'community', 'weekend', 'pop-up', 'market', 'gathering', 'rooftop'],
  },

  mental_health_accessible: {
    sunshineConnection: 'destigmatizing, community as care',
    hashtags: ['therapyisnotweird', 'mentalhealthmatters', 'anxietyrelief', 'burnoutrecovery', 'mentalhealthawareness', 'healingjourney', 'itsokaytotalk', 'mentalhealthtips'],
    conversationAngles: [
      'community as a mental health intervention (loneliness research)',
      'nervous system basics that make therapy make more sense',
      'the difference between coping and actually processing',
    ],
    captionKeywords: ['anxiety', 'burnout', 'therapy', 'overwhelm', 'regulate', 'cope', 'talk', 'feel', 'safe', 'support', 'struggle'],
  },

  fitness_movement: {
    sunshineConnection: 'movement workshops, active event components',
    hashtags: ['pilatesla', 'lagym', 'barreclass', 'hiitworkout', 'outdoorworkoutla', 'runningla', 'hikingla', 'trailrunla', 'fitnesscommunity'],
    conversationAngles: [
      'why group movement builds social bonds (mirror neurons)',
      'outdoor exercise and vitamin D synthesis in LA sun',
      'the cortisol paradox of overtraining vs undermoving',
    ],
    captionKeywords: ['class', 'workout', 'hike', 'run', 'sweat', 'group', 'outdoor', 'morning', 'studio', 'train'],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Build hashtag string for an Instagram post.
 * Includes branded + category tags. Max 30 (IG limit).
 */
export function buildPostHashtags(categories: (keyof typeof HASHTAG_SETS)[]): string {
  const tags: string[] = [];

  // Always 2 branded
  tags.push(...HASHTAG_SETS.branded.slice(0, 2));

  // Add from requested categories
  for (const category of categories) {
    const set = HASHTAG_SETS[category];
    if (set) {
      tags.push(...shuffle(set).slice(0, 3));
    }
  }

  // Dedupe and enforce IG limit
  const unique = [...new Set(tags)];
  return unique.slice(0, 30).join(' ');
}

/**
 * Pick a random outreach vertical.
 */
export function pickOutreachVertical(): OutreachVertical {
  const verticals = Object.keys(OUTREACH_VERTICALS) as OutreachVertical[];
  return verticals[Math.floor(Math.random() * verticals.length)];
}

/**
 * Score a caption against a vertical's keywords.
 * Returns number of matching keywords found.
 */
export function scoreCaptionForVertical(caption: string, vertical: OutreachVertical): number {
  const config = OUTREACH_VERTICALS[vertical];
  const lower = caption.toLowerCase();
  return config.captionKeywords.filter((kw) => lower.includes(kw.toLowerCase())).length;
}
