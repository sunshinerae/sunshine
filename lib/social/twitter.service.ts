/**
 * Twitter Service — The Sunshine Effect
 *
 * Twitter API v2 wrapper for posting tweets, replies, searching,
 * and uploading media. Uses OAuth 1.0a for read/write access.
 */

import { TwitterApi } from 'twitter-api-v2';
import * as fs from 'fs';
import * as path from 'path';
import { TokenBucketRateLimiter } from './rate-limiter';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TweetResult {
  id: string;
  text: string;
  url: string;
}

export interface SearchResult {
  id: string;
  text: string;
  authorId: string;
  authorUsername?: string;
  authorBio?: string;
  authorFollowers?: number;
  authorLocation?: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  retweetCount: number;
  url: string;
}

// ---------------------------------------------------------------------------
// Rate Limiter — Twitter Free tier: 17 tweets per 15 min
// ---------------------------------------------------------------------------

function createRateLimiter(): TokenBucketRateLimiter {
  return new TokenBucketRateLimiter({
    tokensPerSecond: 1 / 60,
    bucketSize: 5,
    name: 'twitter-api',
  });
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class TwitterService {
  private client: TwitterApi | null = null;
  private rateLimiter: TokenBucketRateLimiter;

  constructor() {
    this.rateLimiter = createRateLimiter();
  }

  private getClient(): TwitterApi {
    if (!this.client) {
      const apiKey = process.env.TWITTER_API_KEY || '';
      const apiSecret = process.env.TWITTER_API_SECRET || '';
      const accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
      const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET || '';

      if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
        throw new Error(
          'Twitter API credentials not configured. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET in .env.local'
        );
      }

      this.client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken,
        accessSecret: accessTokenSecret,
      });
    }
    return this.client;
  }

  isConfigured(): boolean {
    return !!(
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_TOKEN_SECRET
    );
  }

  async verifyCredentials(): Promise<{ ok: boolean; username?: string }> {
    if (!this.isConfigured()) return { ok: false };

    try {
      const me = await this.getClient().v2.me();
      return { ok: true, username: me.data.username };
    } catch {
      return { ok: false };
    }
  }

  /**
   * Post a tweet with optional image.
   */
  async postTweet(text: string, imagePath?: string): Promise<TweetResult> {
    if (text.length > 280) {
      throw new Error(`Tweet exceeds 280 chars (${text.length})`);
    }

    await this.rateLimiter.acquire();

    let mediaId: string | undefined;
    if (imagePath) {
      mediaId = await this.uploadMedia(imagePath);
    }

    const params: Record<string, unknown> = {};
    if (mediaId) {
      params.media = { media_ids: [mediaId] };
    }

    const result = await this.getClient().v2.tweet(text, params);
    const tweetId = result.data.id;

    return {
      id: tweetId,
      text: result.data.text,
      url: `https://twitter.com/i/status/${tweetId}`,
    };
  }

  /**
   * Post a reply to an existing tweet.
   */
  async postReply(text: string, replyToId: string): Promise<TweetResult> {
    if (text.length > 280) {
      throw new Error(`Reply exceeds 280 chars (${text.length})`);
    }

    await this.rateLimiter.acquire();

    const result = await this.getClient().v2.reply(text, replyToId);
    const tweetId = result.data.id;

    return {
      id: tweetId,
      text: result.data.text,
      url: `https://twitter.com/i/status/${tweetId}`,
    };
  }

  /**
   * Search for tweets matching a query.
   * Returns up to maxResults tweets with author info.
   */
  async searchTweets(query: string, maxResults = 10): Promise<SearchResult[]> {
    const response = await this.getClient().v2.search(query, {
      max_results: Math.min(maxResults, 100),
      'tweet.fields': 'created_at,author_id,text,public_metrics',
      'user.fields': 'username,description,public_metrics,location',
      expansions: 'author_id',
    });

    if (!response.data?.data) return [];

    const users = new Map<string, { username: string; bio: string; followers: number; location: string }>();
    if (response.includes?.users) {
      for (const u of response.includes.users) {
        const raw = u as unknown as Record<string, unknown>;
        users.set(u.id, {
          username: u.username,
          bio: (raw.description as string) || '',
          followers: ((raw.public_metrics as Record<string, number>)?.followers_count) || 0,
          location: (raw.location as string) || '',
        });
      }
    }

    return response.data.data.map((tweet) => {
      const author = users.get(tweet.author_id || '');
      const metrics = tweet.public_metrics || { like_count: 0, reply_count: 0, retweet_count: 0 };
      return {
        id: tweet.id,
        text: tweet.text,
        authorId: tweet.author_id || '',
        authorUsername: author?.username,
        authorBio: author?.bio,
        authorFollowers: author?.followers,
        authorLocation: author?.location,
        createdAt: tweet.created_at || '',
        likeCount: metrics.like_count || 0,
        replyCount: metrics.reply_count || 0,
        retweetCount: metrics.retweet_count || 0,
        url: `https://twitter.com/i/status/${tweet.id}`,
      };
    });
  }

  /**
   * Upload media from a file path.
   */
  async uploadMedia(filePath: string): Promise<string> {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Image file not found: ${absolutePath}`);
    }
    return this.getClient().v1.uploadMedia(absolutePath);
  }

  /**
   * Upload media from a Buffer.
   */
  async uploadMediaBuffer(buffer: Buffer, mimeType: string): Promise<string> {
    return this.getClient().v1.uploadMedia(buffer, { mimeType });
  }

  /**
   * Delete a tweet.
   */
  async deleteTweet(tweetId: string): Promise<void> {
    await this.getClient().v2.deleteTweet(tweetId);
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let _instance: TwitterService | null = null;

export function getTwitterService(): TwitterService {
  if (!_instance) {
    _instance = new TwitterService();
  }
  return _instance;
}
