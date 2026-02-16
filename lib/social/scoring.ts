/**
 * Engagement Scoring — The Sunshine Effect
 *
 * Score potential engagement targets on Twitter and Instagram
 * to prioritize high-quality interactions.
 */

import type { SearchResult } from './twitter.service';
import type { HashtagPost } from './instagram.service';

// ---------------------------------------------------------------------------
// Twitter Scoring
// ---------------------------------------------------------------------------

export interface TwitterScore {
  total: number;
  breakdown: Record<string, number>;
}

const LA_KEYWORDS = [
  'los angeles', 'l.a.', 'hollywood', 'silverlake', 'silver lake',
  'echo park', 'highland park', 'venice beach', 'santa monica', 'west hollywood',
  'weho', 'dtla', 'downtown la', 'culver city', 'mar vista', 'los feliz',
  'atwater', 'pasadena', 'burbank', 'glendale', 'koreatown', 'ktown',
];

// Short keywords that need word-boundary matching to avoid false positives
const LA_SHORT_KEYWORDS = ['la', 'venice'];

function matchesLAKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  if (LA_KEYWORDS.some((kw) => lower.includes(kw))) return true;
  return LA_SHORT_KEYWORDS.some((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(text);
  });
}

const WELLNESS_KEYWORDS = [
  'wellness', 'yoga', 'meditation', 'breathwork', 'sound bath', 'healing',
  'holistic', 'mindfulness', 'self-care', 'mental health', 'somatic',
  'nervous system', 'therapy', 'coach', 'facilitator', 'reiki',
  'acupuncture', 'herbalist', 'nutritionist',
];

export function scoreTwitterTarget(tweet: SearchResult): TwitterScore {
  const breakdown: Record<string, number> = {};
  let total = 0;

  // Follower count: 500-50k sweet spot
  const followers = tweet.authorFollowers || 0;
  if (followers >= 500 && followers <= 50000) {
    breakdown.follower_range = 3;
    total += 3;
  }

  // LA location in bio or location
  const bioAndLocation = `${tweet.authorBio || ''} ${tweet.authorLocation || ''}`;
  if (matchesLAKeyword(bioAndLocation)) {
    breakdown.la_location = 5;
    total += 5;
  }

  // Fresh tweet (within 6 hours)
  if (tweet.createdAt) {
    const ageMs = Date.now() - new Date(tweet.createdAt).getTime();
    const sixHours = 6 * 60 * 60 * 1000;
    if (ageMs < sixHours) {
      breakdown.fresh = 3;
      total += 3;
    }
  }

  // Has engagement (5+ likes)
  if (tweet.likeCount >= 5) {
    breakdown.engagement = 2;
    total += 2;
  }

  // Bio mentions wellness
  if (WELLNESS_KEYWORDS.some((kw) => bioAndLocation.toLowerCase().includes(kw))) {
    breakdown.wellness_bio = 3;
    total += 3;
  }

  return { total, breakdown };
}

export const TWITTER_SCORE_THRESHOLD = 8;
export const TWITTER_MAX_REPLIES_PER_HOUR = 5;
export const TWITTER_MAX_REPLIES_PER_DAY = 15;

// ---------------------------------------------------------------------------
// Instagram Scoring
// ---------------------------------------------------------------------------

export interface InstagramScore {
  total: number;
  breakdown: Record<string, number>;
}

export function scoreInstagramTarget(
  post: HashtagPost,
  keywordMatches: number,
  authorInfo?: {
    followersCount?: number;
    biography?: string;
    isBusinessAccount?: boolean;
  },
): InstagramScore {
  const breakdown: Record<string, number> = {};
  let total = 0;

  // Follower count: 1k-100k
  const followers = authorInfo?.followersCount || 0;
  if (followers >= 1000 && followers <= 100000) {
    breakdown.follower_range = 3;
    total += 3;
  }

  // Post engagement (50+ likes)
  if (post.likeCount >= 50) {
    breakdown.engagement = 2;
    total += 2;
  }

  // Caption keyword matches (2+ from vertical)
  if (keywordMatches >= 2) {
    breakdown.keyword_match = 4;
    total += 4;
  }

  // Fresh post (within 24 hours)
  if (post.timestamp) {
    const ageMs = Date.now() - new Date(post.timestamp).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (ageMs < twentyFourHours) {
      breakdown.fresh = 3;
      total += 3;
    }
  }

  // LA mention in bio or caption
  const text = `${post.caption} ${authorInfo?.biography || ''}`;
  if (matchesLAKeyword(text)) {
    breakdown.la_mention = 5;
    total += 5;
  }

  // Business/creator account
  if (authorInfo?.isBusinessAccount) {
    breakdown.business_account = 2;
    total += 2;
  }

  return { total, breakdown };
}

export const IG_SCORE_THRESHOLD = 10;
export const IG_MAX_COMMENTS_PER_DAY = 12;
export const IG_MIN_GAP_MS = 3 * 60 * 1000; // 3 minutes
export const IG_AUTHOR_COOLDOWN_DAYS = 7;
