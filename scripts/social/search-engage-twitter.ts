#!/usr/bin/env npx tsx
/**
 * Twitter Search & Engage — The Sunshine Effect
 *
 * Search for LA wellness conversations, score targets,
 * generate replies in Sunshine's voice, and post them.
 *
 * Usage:
 *   npx tsx scripts/social/search-engage-twitter.ts --dry-run          # preview only
 *   npx tsx scripts/social/search-engage-twitter.ts --tier hot_leads   # specific tier
 *   npx tsx scripts/social/search-engage-twitter.ts --max 5            # limit replies
 *   npx tsx scripts/social/search-engage-twitter.ts                    # full pipeline
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getTwitterService, SearchResult } from '../../lib/social/twitter.service';
import { generateContent } from '../../lib/social/voice';
import {
  scoreTwitterTarget,
  TWITTER_SCORE_THRESHOLD,
  TWITTER_MAX_REPLIES_PER_DAY,
} from '../../lib/social/scoring';
import {
  logTwitterEngagement,
  hasEngagedAuthorRecently,
  hasRepliedToTweet,
  countTwitterEngagementsToday,
} from '../../lib/social/published-log';

// ---------------------------------------------------------------------------
// Search Tiers
// ---------------------------------------------------------------------------

type SearchTier = 'hot_leads' | 'conversation' | 'la_weekend' | 'wellness_humor' | 'industry_peers';

const SEARCH_TIERS: Record<SearchTier, { description: string; queries: string[]; replyStyle: string }> = {
  hot_leads: {
    description: 'People actively looking for what Sunshine offers',
    queries: [
      '"looking for" (wellness OR yoga OR breathwork OR "women\'s circle") ("LA" OR "los angeles") -is:retweet lang:en',
      '"anyone know" (wellness OR "sound bath" OR yoga) ("LA" OR "los angeles") -is:retweet lang:en',
      '"recommendations" (wellness OR healing OR breathwork) ("LA" OR "los angeles") -is:retweet lang:en',
    ],
    replyStyle: 'Warm, direct invite. Mention a specific upcoming Sunshine event if relevant. Be helpful, not salesy.',
  },
  conversation: {
    description: 'People discussing wellness topics',
    queries: [
      '("breathwork" OR "sound bath" OR "nervous system regulation") -is:retweet lang:en',
      '("vagus nerve" OR "somatic" OR "polyvagal") -is:retweet lang:en',
      '("women\'s circle" OR "full moon ceremony" OR "cacao ceremony") -is:retweet lang:en',
    ],
    replyStyle: 'Share a genuine insight or personal take. No pitch, no event mention. Just be a real person in the conversation.',
  },
  la_weekend: {
    description: 'People looking for things to do in LA',
    queries: [
      '"what to do" "los angeles" (this weekend OR tonight OR saturday OR sunday) -is:retweet lang:en',
      '"LA plans" (weekend OR saturday OR sunday) -is:retweet lang:en',
      '"bored in LA" OR "need plans LA" -is:retweet lang:en',
    ],
    replyStyle: 'Casual, friendly suggestion. "oh you should check out..." energy. Only mention Sunshine if there\'s an event soon.',
  },
  wellness_humor: {
    description: 'People being funny about wellness',
    queries: [
      '("sound bath" OR "breathwork" OR "crystal") (funny OR lol OR dead OR crying OR help) -is:retweet lang:en',
      '"hot yoga" (died OR sweating OR help OR never again) -is:retweet lang:en',
      '"wellness" ("LA" OR "los angeles") (meme OR relatable OR honestly) -is:retweet lang:en',
    ],
    replyStyle: 'Match their humor. Be funny back. Build rapport through shared jokes about wellness culture.',
  },
  industry_peers: {
    description: 'Other wellness facilitators and creators',
    queries: [
      '"hosting" (breathwork OR circle OR ceremony OR "sound bath") ("LA" OR "los angeles") -is:retweet lang:en',
      '"wellness event" "los angeles" (tickets OR rsvp OR "sign up") -is:retweet lang:en',
      '("facilitator" OR "space holder" OR "practitioner") (breathwork OR somatic OR yoga) ("LA" OR "los angeles") -is:retweet lang:en',
    ],
    replyStyle: 'Supportive, hype them up. Build genuine relationships. Never compete or one-up. "this sounds amazing" energy.',
  },
};

// ---------------------------------------------------------------------------
// CLI Args
// ---------------------------------------------------------------------------

interface Args {
  tier?: SearchTier;
  max: number;
  dryRun: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const args: Args = { max: 10, dryRun: false };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--tier':
        args.tier = argv[++i] as SearchTier;
        break;
      case '--max':
        args.max = parseInt(argv[++i], 10);
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs();
  const twitter = getTwitterService();

  if (!twitter.isConfigured()) {
    console.error('Twitter API not configured. Run check-credentials.ts first.');
    process.exit(1);
  }

  const tiers: SearchTier[] = args.tier
    ? [args.tier]
    : ['hot_leads', 'conversation', 'la_weekend', 'wellness_humor', 'industry_peers'];

  const todayCount = countTwitterEngagementsToday();
  console.log(`Engagements today: ${todayCount}/${TWITTER_MAX_REPLIES_PER_DAY}`);
  if (todayCount >= TWITTER_MAX_REPLIES_PER_DAY && !args.dryRun) {
    console.log('Daily limit reached. Try again tomorrow.');
    return;
  }

  let totalReplied = 0;

  for (const tier of tiers) {
    if (totalReplied >= args.max) break;
    if (todayCount + totalReplied >= TWITTER_MAX_REPLIES_PER_DAY && !args.dryRun) break;

    const config = SEARCH_TIERS[tier];
    console.log(`\n========== ${tier.toUpperCase()} ==========`);
    console.log(`${config.description}\n`);

    // Search across all queries for this tier
    const allResults: SearchResult[] = [];
    for (const query of config.queries) {
      try {
        const results = await twitter.searchTweets(query, 10);
        allResults.push(...results);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(`  Search failed: ${message}`);
      }
      // Small delay between searches
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Dedupe by tweet ID
    const seen = new Set<string>();
    const unique = allResults.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    console.log(`  Found ${unique.length} unique tweets\n`);

    // Score and filter
    const scored = unique
      .map((tweet) => ({ tweet, score: scoreTwitterTarget(tweet) }))
      .filter((s) => s.score.total >= TWITTER_SCORE_THRESHOLD)
      .sort((a, b) => b.score.total - a.score.total);

    console.log(`  ${scored.length} tweets above score threshold (${TWITTER_SCORE_THRESHOLD})\n`);

    for (const { tweet, score } of scored) {
      if (totalReplied >= args.max) break;
      if (todayCount + totalReplied >= TWITTER_MAX_REPLIES_PER_DAY && !args.dryRun) break;

      // Skip if already engaged
      if (hasRepliedToTweet(tweet.id)) {
        console.log(`  SKIP (already replied): ${tweet.id}`);
        continue;
      }
      if (tweet.authorUsername && hasEngagedAuthorRecently(tweet.authorUsername)) {
        console.log(`  SKIP (engaged recently): @${tweet.authorUsername}`);
        continue;
      }

      console.log(`  @${tweet.authorUsername || tweet.authorId} (score: ${score.total}):`);
      console.log(`    "${tweet.text.substring(0, 120)}..."`);
      console.log(`    Breakdown: ${JSON.stringify(score.breakdown)}`);

      // Generate reply
      const reply = await generateContent({
        format: 'reply',
        prompt: config.replyStyle,
        context: `Tweet from @${tweet.authorUsername || 'someone'}:\n${tweet.text}`,
        maxLength: 280,
      });

      console.log(`    Reply: ${reply}`);
      console.log(`    (${reply.length} chars)`);

      if (args.dryRun) {
        console.log('    [DRY RUN — not posted]\n');
        totalReplied++;
        continue;
      }

      // Post reply
      try {
        const result = await twitter.postReply(reply, tweet.id);
        console.log(`    POSTED: ${result.url}\n`);

        logTwitterEngagement({
          date: new Date().toISOString(),
          tweetId: tweet.id,
          authorUsername: tweet.authorUsername || '',
          authorId: tweet.authorId,
          authorFollowers: tweet.authorFollowers || 0,
          originalText: tweet.text,
          replyId: result.id,
          replyText: reply,
          replyUrl: result.url,
          searchTier: tier,
          score: score.total,
        });

        totalReplied++;

        // Rate limit gap
        await new Promise((r) => setTimeout(r, 15000));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(`    ERROR: ${message}\n`);
        if (message.includes('429')) {
          console.log('  RATE LIMITED — stopping.');
          break;
        }
      }
    }
  }

  console.log(`\n========== DONE ==========`);
  console.log(`Replied: ${totalReplied} | Today total: ${todayCount + (args.dryRun ? 0 : totalReplied)}`);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
