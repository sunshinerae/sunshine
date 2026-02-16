/**
 * Instagram Service — The Sunshine Effect
 *
 * Meta Graph API wrapper for publishing feed posts, carousels, and reels,
 * plus hashtag search and commenting for outreach.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PublishResult {
  id: string;
  permalink?: string;
  timestamp: string;
}

export interface HashtagPost {
  mediaId: string;
  caption: string;
  permalink: string;
  timestamp: string;
  likeCount: number;
  commentsCount: number;
  mediaType: string;
}

export interface CommentResult {
  commentId: string;
  mediaId: string;
  message: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class InstagramService {
  private accessToken: string;
  private accountId: string;

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || '';
    this.accountId = process.env.INSTAGRAM_ACCOUNT_ID || '';

    if (!this.accessToken) {
      throw new Error('META_ACCESS_TOKEN environment variable is required');
    }
    if (!this.accountId) {
      throw new Error('INSTAGRAM_ACCOUNT_ID environment variable is required');
    }
  }

  static isConfigured(): boolean {
    return !!(process.env.META_ACCESS_TOKEN && process.env.INSTAGRAM_ACCOUNT_ID);
  }

  async checkPermissions(): Promise<{ granted: string[]; missing: string[]; ok: boolean }> {
    const required = ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'];

    const url = `${GRAPH_API_BASE}/me/permissions?access_token=${this.accessToken}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to check permissions: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as { data: Array<{ permission: string; status: string }> };
    const grantedSet = new Set(
      data.data.filter((p) => p.status === 'granted').map((p) => p.permission)
    );

    const granted = Array.from(grantedSet);
    const missing = required.filter((p) => !grantedSet.has(p));

    return { granted, missing, ok: missing.length === 0 };
  }

  // -------------------------------------------------------------------------
  // Publishing
  // -------------------------------------------------------------------------

  /**
   * Publish a single image feed post.
   * Flow: create container -> wait -> publish -> get permalink
   */
  async publishFeedPost(imageUrl: string, caption: string): Promise<PublishResult> {
    const containerId = await this.createMediaContainer({ image_url: imageUrl, caption });
    await this.waitForContainer(containerId);

    const mediaId = await this.publishContainer(containerId);
    const permalink = await this.getPermalink(mediaId);

    return { id: mediaId, permalink, timestamp: new Date().toISOString() };
  }

  /**
   * Publish a carousel (2-10 images).
   */
  async publishCarousel(imageUrls: string[], caption: string): Promise<PublishResult> {
    if (imageUrls.length < 2 || imageUrls.length > 10) {
      throw new Error(`Carousel requires 2-10 images, got ${imageUrls.length}`);
    }

    // Create child containers
    const childIds: string[] = [];
    for (const url of imageUrls) {
      const id = await this.createMediaContainer({
        image_url: url,
        is_carousel_item: 'true',
      });
      childIds.push(id);
    }

    // Wait for all children
    for (const id of childIds) {
      await this.waitForContainer(id);
    }

    // Create carousel container
    const carouselId = await this.createMediaContainer({
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption,
    });
    await this.waitForContainer(carouselId);

    // Publish with retry (carousels can lag)
    let mediaId: string | undefined;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        if (attempt === 1) {
          await new Promise((r) => setTimeout(r, 10_000));
        }
        mediaId = await this.publishContainer(carouselId);
        break;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '';
        const isNotReady = message.includes('not ready') || message.includes('9007');
        if (isNotReady && attempt < 5) {
          const wait = attempt * 5;
          console.log(`  Media not ready, retrying in ${wait}s (attempt ${attempt}/5)...`);
          await new Promise((r) => setTimeout(r, wait * 1000));
        } else {
          throw err;
        }
      }
    }

    if (!mediaId) {
      throw new Error('Carousel publish failed after 5 attempts');
    }

    const permalink = await this.getPermalink(mediaId);
    return { id: mediaId, permalink, timestamp: new Date().toISOString() };
  }

  /**
   * Publish a Reel (video).
   */
  async publishReel(videoUrl: string, caption: string, coverUrl?: string): Promise<PublishResult> {
    const params: Record<string, string> = {
      video_url: videoUrl,
      caption,
      media_type: 'REELS',
    };
    if (coverUrl) params.cover_url = coverUrl;

    const containerId = await this.createMediaContainer(params);
    await this.waitForContainer(containerId, 120_000);

    const mediaId = await this.publishContainer(containerId);
    const permalink = await this.getPermalink(mediaId);

    return { id: mediaId, permalink, timestamp: new Date().toISOString() };
  }

  // -------------------------------------------------------------------------
  // Hashtag Search (for outreach)
  // -------------------------------------------------------------------------

  /**
   * Search for a hashtag and return its IG hashtag ID.
   * Rate limit: 30 unique hashtags per 7-day window.
   */
  async searchHashtag(hashtag: string): Promise<string | null> {
    const cleanTag = hashtag.replace(/^#/, '');
    const url =
      `${GRAPH_API_BASE}/ig_hashtag_search` +
      `?q=${encodeURIComponent(cleanTag)}` +
      `&user_id=${this.accountId}` +
      `&access_token=${this.accessToken}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = (await response.json()) as { data: Array<{ id: string }> };
    return data.data?.[0]?.id || null;
  }

  /**
   * Get top media for a hashtag ID (up to 50 posts).
   */
  async getTopMedia(hashtagId: string): Promise<HashtagPost[]> {
    return this.getHashtagMedia(hashtagId, 'top_media');
  }

  /**
   * Get recent media for a hashtag ID (up to 50 posts).
   */
  async getRecentMedia(hashtagId: string): Promise<HashtagPost[]> {
    return this.getHashtagMedia(hashtagId, 'recent_media');
  }

  /**
   * Look up a Business/Creator IG account by username.
   */
  async getUserByUsername(username: string): Promise<{
    userId: string;
    username: string;
    fullName?: string;
    biography?: string;
    followersCount?: number;
    mediaCount?: number;
    website?: string;
  } | null> {
    const url =
      `${GRAPH_API_BASE}/${this.accountId}` +
      `?fields=business_discovery.username(${username}){id,username,name,biography,followers_count,media_count,website}` +
      `&access_token=${this.accessToken}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = (await response.json()) as Record<string, unknown>;
    const bd = data.business_discovery as Record<string, unknown> | undefined;
    if (!bd) return null;

    return {
      userId: bd.id as string,
      username: bd.username as string,
      fullName: bd.name as string | undefined,
      biography: bd.biography as string | undefined,
      followersCount: bd.followers_count as number | undefined,
      mediaCount: bd.media_count as number | undefined,
      website: bd.website as string | undefined,
    };
  }

  // -------------------------------------------------------------------------
  // Commenting (for outreach)
  // -------------------------------------------------------------------------

  /**
   * Post a comment on a media item.
   * Rate limit: keep to ~12/day to avoid action blocks.
   */
  async postComment(mediaId: string, message: string): Promise<CommentResult> {
    const url = `${GRAPH_API_BASE}/${mediaId}/comments`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        access_token: this.accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Comment failed on ${mediaId}: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as { id: string };
    return {
      commentId: data.id,
      mediaId,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  // -------------------------------------------------------------------------
  // Private Helpers
  // -------------------------------------------------------------------------

  private async createMediaContainer(params: Record<string, string>): Promise<string> {
    const response = await this.graphPost<{ id: string }>(`/${this.accountId}/media`, {
      ...params,
      access_token: this.accessToken,
    });
    return response.id;
  }

  private async publishContainer(containerId: string): Promise<string> {
    const response = await this.graphPost<{ id: string }>(`/${this.accountId}/media_publish`, {
      creation_id: containerId,
      access_token: this.accessToken,
    });
    return response.id;
  }

  private async waitForContainer(containerId: string, timeoutMs = 30_000): Promise<void> {
    const start = Date.now();
    const pollInterval = 3_000;

    while (Date.now() - start < timeoutMs) {
      const url =
        `${GRAPH_API_BASE}/${containerId}` +
        `?fields=status,status_code&access_token=${this.accessToken}`;

      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Container status check failed: ${response.status} - ${error}`);
      }

      const data = (await response.json()) as { status?: string; status_code?: string };

      if (data.status_code === 'FINISHED' || data.status === 'FINISHED') return;
      if (data.status_code === 'ERROR' || data.status === 'ERROR') {
        throw new Error(`Media container failed: ${JSON.stringify(data)}`);
      }

      await new Promise((r) => setTimeout(r, pollInterval));
    }

    throw new Error(`Container ${containerId} did not finish within ${timeoutMs / 1000}s`);
  }

  private async getPermalink(mediaId: string): Promise<string | undefined> {
    try {
      const url =
        `${GRAPH_API_BASE}/${mediaId}` +
        `?fields=permalink&access_token=${this.accessToken}`;
      const response = await fetch(url);
      if (!response.ok) return undefined;
      const data = (await response.json()) as { permalink?: string };
      return data.permalink;
    } catch {
      return undefined;
    }
  }

  private async getHashtagMedia(hashtagId: string, endpoint: string): Promise<HashtagPost[]> {
    const fields = 'id,caption,permalink,timestamp,like_count,comments_count,media_type';
    const url =
      `${GRAPH_API_BASE}/${hashtagId}/${endpoint}` +
      `?user_id=${this.accountId}` +
      `&fields=${fields}` +
      `&access_token=${this.accessToken}`;

    const response = await fetch(url);
    if (!response.ok) return [];

    const data = (await response.json()) as { data: Record<string, unknown>[] };
    return (data.data || []).map((m) => ({
      mediaId: m.id as string,
      caption: (m.caption as string) || '',
      permalink: (m.permalink as string) || '',
      timestamp: (m.timestamp as string) || '',
      likeCount: (m.like_count as number) || 0,
      commentsCount: (m.comments_count as number) || 0,
      mediaType: (m.media_type as string) || 'UNKNOWN',
    }));
  }

  private async graphPost<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    const url = `${GRAPH_API_BASE}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Instagram Graph API POST ${endpoint} failed: ${response.status} - ${error}`);
    }

    return response.json() as Promise<T>;
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let _instance: InstagramService | null = null;

export function getInstagramService(): InstagramService {
  if (!_instance) {
    _instance = new InstagramService();
  }
  return _instance;
}
