/**
 * Token Bucket Rate Limiter
 *
 * Prevents API rate limit violations by throttling requests.
 * Tokens refill at a steady rate; each request consumes one token.
 * If the bucket is empty, acquire() blocks until a token is available.
 * Uses a queue to prevent concurrent callers from exceeding limits.
 */

interface RateLimiterOptions {
  /** Tokens added per second (e.g. 1/60 = one per minute) */
  tokensPerSecond: number;
  /** Maximum burst size */
  bucketSize: number;
  /** Label for logging */
  name: string;
}

export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly tokensPerSecond: number;
  private readonly bucketSize: number;
  private readonly name: string;
  private pending: Promise<void> = Promise.resolve();

  constructor(options: RateLimiterOptions) {
    this.tokensPerSecond = options.tokensPerSecond;
    this.bucketSize = options.bucketSize;
    this.name = options.name;
    this.tokens = options.bucketSize;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const newTokens = elapsed * this.tokensPerSecond;
    this.tokens = Math.min(this.bucketSize, this.tokens + newTokens);
    this.lastRefill = now;
  }

  async acquire(): Promise<void> {
    this.pending = this.pending.then(() => this._acquire());
    return this.pending;
  }

  private async _acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    const deficit = 1 - this.tokens;
    const waitMs = (deficit / this.tokensPerSecond) * 1000;
    console.log(`[${this.name}] Rate limited — waiting ${Math.ceil(waitMs / 1000)}s`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));

    this.refill();
    this.tokens -= 1;
  }
}
