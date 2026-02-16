/**
 * Published Log — Track all social media activity
 *
 * Append-only JSON logs for published posts, Twitter replies,
 * and Instagram outreach comments.
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PublishedPost {
  date: string;
  contentType: string;
  platform: 'twitter' | 'instagram' | 'both';
  twitter?: {
    id: string;
    text: string;
    url: string;
  };
  instagram?: {
    id: string;
    permalink?: string;
    caption: string;
  };
  image?: string;
  hashtags?: string;
}

export interface TwitterEngagement {
  date: string;
  tweetId: string;
  authorUsername: string;
  authorId: string;
  authorFollowers: number;
  originalText: string;
  replyId: string;
  replyText: string;
  replyUrl: string;
  searchTier: string;
  score: number;
}

export interface IGOutreachEntry {
  date: string;
  mediaId: string;
  authorUsername?: string;
  vertical: string;
  hashtag: string;
  captionSnippet: string;
  commentId: string;
  commentText: string;
  score: number;
}

// ---------------------------------------------------------------------------
// File Paths
// ---------------------------------------------------------------------------

const OUTPUT_DIR = path.join(process.cwd(), 'output');
const PUBLISHED_PATH = path.join(OUTPUT_DIR, 'social-published.json');
const TWITTER_ENGAGED_PATH = path.join(OUTPUT_DIR, 'twitter-engaged.json');
const IG_OUTREACH_PATH = path.join(OUTPUT_DIR, 'ig-outreach-log.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function readJsonArray<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function appendToJsonArray<T>(filePath: string, entry: T): void {
  ensureOutputDir();
  const entries = readJsonArray<T>(filePath);
  entries.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
}

// ---------------------------------------------------------------------------
// Published Posts
// ---------------------------------------------------------------------------

export function logPublishedPost(post: PublishedPost): void {
  appendToJsonArray(PUBLISHED_PATH, post);
}

export function getPublishedPosts(): PublishedPost[] {
  return readJsonArray(PUBLISHED_PATH);
}

// ---------------------------------------------------------------------------
// Twitter Engagements
// ---------------------------------------------------------------------------

export function logTwitterEngagement(entry: TwitterEngagement): void {
  appendToJsonArray(TWITTER_ENGAGED_PATH, entry);
}

export function getTwitterEngagements(): TwitterEngagement[] {
  return readJsonArray(TWITTER_ENGAGED_PATH);
}

/**
 * Check if we've already replied to this author recently (within days).
 */
export function hasEngagedAuthorRecently(authorUsername: string, withinDays = 7): boolean {
  const entries = getTwitterEngagements();
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;

  return entries.some(
    (e) =>
      e.authorUsername === authorUsername &&
      new Date(e.date).getTime() > cutoff
  );
}

/**
 * Check if we've already replied to this specific tweet.
 */
export function hasRepliedToTweet(tweetId: string): boolean {
  return getTwitterEngagements().some((e) => e.tweetId === tweetId);
}

/**
 * Count engagements today.
 */
export function countTwitterEngagementsToday(): number {
  const today = new Date().toISOString().split('T')[0];
  return getTwitterEngagements().filter((e) => e.date.startsWith(today)).length;
}

// ---------------------------------------------------------------------------
// Instagram Outreach
// ---------------------------------------------------------------------------

export function logIGOutreach(entry: IGOutreachEntry): void {
  appendToJsonArray(IG_OUTREACH_PATH, entry);
}

export function getIGOutreach(): IGOutreachEntry[] {
  return readJsonArray(IG_OUTREACH_PATH);
}

/**
 * Check if we've commented on this author recently.
 */
export function hasCommentedOnAuthorRecently(authorUsername: string, withinDays = 7): boolean {
  const entries = getIGOutreach();
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;

  return entries.some(
    (e) =>
      e.authorUsername === authorUsername &&
      new Date(e.date).getTime() > cutoff
  );
}

/**
 * Count IG outreach comments today.
 */
export function countIGOutreachToday(): number {
  const today = new Date().toISOString().split('T')[0];
  return getIGOutreach().filter((e) => e.date.startsWith(today)).length;
}
