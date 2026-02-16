#!/usr/bin/env npx tsx
/**
 * Instagram Outreach — The Sunshine Effect
 *
 * Search hashtags across wellness verticals, score targets,
 * generate AI comments in Sunshine's voice, and post them.
 *
 * Usage:
 *   npx tsx scripts/social/ig-outreach.ts --dry-run                    # preview only
 *   npx tsx scripts/social/ig-outreach.ts --vertical yoga_movement     # specific vertical
 *   npx tsx scripts/social/ig-outreach.ts --max 5                      # limit comments
 *   npx tsx scripts/social/ig-outreach.ts                              # full pipeline
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { InstagramService, HashtagPost } from '../../lib/social/instagram.service';
import { generateContent, containsForbiddenPhrases } from '../../lib/social/voice';
import {
  OutreachVertical,
  OUTREACH_VERTICALS,
  scoreCaptionForVertical,
} from '../../lib/social/hashtags';
import {
  scoreInstagramTarget,
  IG_SCORE_THRESHOLD,
  IG_MAX_COMMENTS_PER_DAY,
  IG_MIN_GAP_MS,
} from '../../lib/social/scoring';
import {
  logIGOutreach,
  hasCommentedOnAuthorRecently,
  countIGOutreachToday,
} from '../../lib/social/published-log';

// ---------------------------------------------------------------------------
// CLI Args
// ---------------------------------------------------------------------------

interface Args {
  vertical?: OutreachVertical;
  max: number;
  dryRun: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const args: Args = { max: 8, dryRun: false };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--vertical':
        args.vertical = argv[++i] as OutreachVertical;
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
// Comment Generation with Validation
// ---------------------------------------------------------------------------

async function generateComment(
  post: HashtagPost,
  vertical: OutreachVertical,
  hashtag: string,
): Promise<string | null> {
  const config = OUTREACH_VERTICALS[vertical];

  // Pick a random conversation angle
  const angle = config.conversationAngles[
    Math.floor(Math.random() * config.conversationAngles.length)
  ];

  const prompt = [
    'Write a genuine, warm comment on this Instagram post.',
    '',
    'Rules:',
    '- 1-3 sentences, max 400 characters',
    '- Reference something SPECIFIC from the post caption',
    '- Optionally weave in this angle if it fits naturally: ' + angle,
    '- Sound like a real woman in LA, not a brand',
    '- NO brand mentions, NO links, NO "check out our..."',
    '- NO health claims',
    '- Keep it conversational and real',
    '- Do NOT start with "Love this" or "Great post"',
    '- Max 2 emojis total',
  ].join('\n');

  const context = [
    `Post caption: ${post.caption.substring(0, 600)}`,
    `Hashtag context: #${hashtag}`,
    `Vertical: ${vertical.replace(/_/g, ' ')}`,
  ].join('\n');

  let comment = await generateContent({
    format: 'comment',
    prompt,
    context,
    maxLength: 400,
  });

  // Validation
  const violations = containsForbiddenPhrases(comment);
  if (violations.length > 0) {
    console.log(`    Forbidden phrases detected (${violations.join(', ')}), skipping`);
    return null;
  }

  // Check it references the caption (at least one word overlap beyond common words)
  const captionWords = new Set(
    post.caption.toLowerCase().split(/\s+/).filter((w) => w.length > 4)
  );
  const commentWords = comment.toLowerCase().split(/\s+/);
  const overlap = commentWords.filter((w) => captionWords.has(w)).length;
  if (overlap < 1 && post.caption.length > 50) {
    console.log('    Comment doesn\'t reference caption, regenerating...');
    comment = await generateContent({
      format: 'comment',
      prompt: prompt + '\n\nIMPORTANT: You MUST reference something specific from the caption.',
      context,
      maxLength: 400,
    });
  }

  return comment;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs();

  if (!process.env.META_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
    console.error('Instagram API not configured. Run check-credentials.ts first.');
    process.exit(1);
  }

  const ig = new InstagramService();

  const verticals: OutreachVertical[] = args.vertical
    ? [args.vertical]
    : shuffleArray(Object.keys(OUTREACH_VERTICALS) as OutreachVertical[]);

  const todayCount = countIGOutreachToday();
  console.log(`Outreach comments today: ${todayCount}/${IG_MAX_COMMENTS_PER_DAY}`);
  if (todayCount >= IG_MAX_COMMENTS_PER_DAY && !args.dryRun) {
    console.log('Daily limit reached. Try again tomorrow.');
    return;
  }

  let totalCommented = 0;

  for (const vertical of verticals) {
    if (totalCommented >= args.max) break;
    if (todayCount + totalCommented >= IG_MAX_COMMENTS_PER_DAY && !args.dryRun) break;

    const config = OUTREACH_VERTICALS[vertical];
    console.log(`\n========== ${vertical.toUpperCase()} ==========`);
    console.log(`Connection: ${config.sunshineConnection}\n`);

    // Pick 2-3 random hashtags from this vertical
    const hashtags = shuffleArray(config.hashtags).slice(0, 3);

    for (const hashtag of hashtags) {
      if (totalCommented >= args.max) break;

      console.log(`  Searching #${hashtag}...`);

      const hashtagId = await ig.searchHashtag(hashtag);
      if (!hashtagId) {
        console.log('    No results');
        continue;
      }

      const posts = await ig.getTopMedia(hashtagId);
      console.log(`    Found ${posts.length} posts`);

      // Score and filter
      for (const post of posts) {
        if (totalCommented >= args.max) break;
        if (todayCount + totalCommented >= IG_MAX_COMMENTS_PER_DAY && !args.dryRun) break;

        const keywordMatches = scoreCaptionForVertical(post.caption, vertical);
        const score = scoreInstagramTarget(post, keywordMatches);

        if (score.total < IG_SCORE_THRESHOLD) continue;

        // Extract username from permalink if possible
        const usernameMatch = post.permalink.match(/instagram\.com\/([^/]+)/);
        const authorUsername = usernameMatch?.[1];

        if (authorUsername && hasCommentedOnAuthorRecently(authorUsername)) {
          console.log(`    SKIP (cooldown): @${authorUsername}`);
          continue;
        }

        console.log(`\n    Target (score: ${score.total}):`);
        console.log(`      "${post.caption.substring(0, 100)}..."`);
        console.log(`      Likes: ${post.likeCount} | Comments: ${post.commentsCount}`);
        console.log(`      Breakdown: ${JSON.stringify(score.breakdown)}`);

        // Generate comment
        const comment = await generateComment(post, vertical, hashtag);
        if (!comment) continue;

        console.log(`      Comment: ${comment}`);
        console.log(`      (${comment.length} chars)`);

        if (args.dryRun) {
          console.log('      [DRY RUN — not posted]');
          totalCommented++;
          continue;
        }

        // Post comment
        try {
          const result = await ig.postComment(post.mediaId, comment);
          console.log(`      POSTED: ${result.commentId}`);

          logIGOutreach({
            date: new Date().toISOString(),
            mediaId: post.mediaId,
            authorUsername,
            vertical,
            hashtag,
            captionSnippet: post.caption.substring(0, 200),
            commentId: result.commentId,
            commentText: comment,
            score: score.total,
          });

          totalCommented++;

          // Rate limit gap (3 min minimum)
          if (totalCommented < args.max) {
            const gapSeconds = Math.ceil(IG_MIN_GAP_MS / 1000);
            console.log(`      Waiting ${gapSeconds}s...`);
            await new Promise((r) => setTimeout(r, IG_MIN_GAP_MS));
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          console.log(`      ERROR: ${message}`);
          if (message.includes('429') || message.includes('spam')) {
            console.log('    ACTION BLOCKED — stopping for today.');
            return;
          }
        }
      }

      // Small gap between hashtags
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  console.log(`\n========== DONE ==========`);
  console.log(`Commented: ${totalCommented} | Today total: ${todayCount + (args.dryRun ? 0 : totalCommented)}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
