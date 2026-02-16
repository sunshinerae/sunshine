#!/usr/bin/env npx tsx
/**
 * Event Promo — The Sunshine Effect
 *
 * Generate a multi-post event campaign from a natural language description.
 * Creates announcement, reminder, and recap posts for both platforms.
 *
 * Usage:
 *   npx tsx scripts/social/event-promo.ts --event "breathwork at the loft this saturday 7pm, $25, bring a mat"
 *   npx tsx scripts/social/event-promo.ts --event "sound bath + tacos, march 1, echo park, free" --dry-run
 *   npx tsx scripts/social/event-promo.ts --event "women's circle, full moon, march 14, silverlake" --phase reminder
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { generateContent } from '../../lib/social/voice';
import { buildPostHashtags } from '../../lib/social/hashtags';
import { getTwitterService } from '../../lib/social/twitter.service';
import { InstagramService } from '../../lib/social/instagram.service';
import { logPublishedPost } from '../../lib/social/published-log';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PromoPhase = 'announcement' | 'reminder' | 'dayof' | 'recap';

interface Args {
  event: string;
  phase: PromoPhase | 'all';
  platform: 'twitter' | 'instagram' | 'both';
  imageUrl?: string;
  dryRun: boolean;
}

// ---------------------------------------------------------------------------
// Phase Prompts
// ---------------------------------------------------------------------------

const PHASE_PROMPTS: Record<PromoPhase, { twitter: string; instagram: string }> = {
  announcement: {
    twitter: [
      'Write a tweet announcing this event for the first time.',
      'Make it feel exciting but chill — like telling your group chat.',
      'Include the key details (what, when, where) naturally, not in a list.',
    ].join('\n'),
    instagram: [
      'Write an Instagram caption announcing this event.',
      'Lead with the vibe or feeling, then give the details.',
      'Make someone want to screenshot it and send to their friend.',
      '2-3 short paragraphs max.',
    ].join('\n'),
  },
  reminder: {
    twitter: [
      'Write a tweet reminding people about this upcoming event.',
      'Add urgency but keep it casual — "this is your sign" energy.',
      'Assume they already know about it, just need a nudge.',
    ].join('\n'),
    instagram: [
      'Write an Instagram caption reminding people about the event.',
      'Different angle than the original announcement.',
      'Maybe share what happened last time, or what to expect.',
      'Keep it short and punchy.',
    ].join('\n'),
  },
  dayof: {
    twitter: [
      'Write a tweet for the day of the event.',
      'Excited, last-minute energy. "today\'s the day" vibes.',
      'Keep it short and hype.',
    ].join('\n'),
    instagram: [
      'Write an Instagram caption for the day of the event.',
      'Excited, real-time energy. Maybe a behind-the-scenes setup vibe.',
      'Short — people are busy, just remind them to show up.',
    ].join('\n'),
  },
  recap: {
    twitter: [
      'Write a tweet recapping this event after it happened.',
      'Pick one specific moment or feeling that captures it.',
      'Make people who missed it feel FOMO.',
    ].join('\n'),
    instagram: [
      'Write an Instagram caption recapping this event.',
      'Tell a mini story — one moment, one feeling, one thing someone said.',
      'End with something that makes people want to come next time.',
      'This would accompany event photos.',
    ].join('\n'),
  },
};

// ---------------------------------------------------------------------------
// CLI Args
// ---------------------------------------------------------------------------

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const args: Args = { event: '', phase: 'all', platform: 'both', dryRun: false };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--event':
        args.event = argv[++i];
        break;
      case '--phase':
        args.phase = argv[++i] as Args['phase'];
        break;
      case '--platform':
        args.platform = argv[++i] as Args['platform'];
        break;
      case '--image-url':
        args.imageUrl = argv[++i];
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
    }
  }

  if (!args.event) {
    console.error('Usage: npx tsx scripts/social/event-promo.ts --event "description of your event"');
    process.exit(1);
  }

  return args;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function generatePhase(
  phase: PromoPhase,
  eventDescription: string,
  platform: 'twitter' | 'instagram' | 'both',
): Promise<{ tweet?: string; igCaption?: string }> {
  const prompts = PHASE_PROMPTS[phase];
  let tweet: string | undefined;
  let igCaption: string | undefined;

  if (platform === 'twitter' || platform === 'both') {
    tweet = await generateContent({
      format: 'tweet',
      prompt: prompts.twitter,
      context: `Event details: ${eventDescription}`,
      maxLength: 280,
    });
  }

  if (platform === 'instagram' || platform === 'both') {
    igCaption = await generateContent({
      format: 'ig_caption',
      prompt: prompts.instagram,
      context: `Event details: ${eventDescription}`,
    });
  }

  return { tweet, igCaption };
}

async function main() {
  const args = parseArgs();
  const phases: PromoPhase[] =
    args.phase === 'all'
      ? ['announcement', 'reminder', 'dayof', 'recap']
      : [args.phase];

  console.log(`Event: ${args.event}`);
  console.log(`Phases: ${phases.join(', ')}`);
  console.log(`Platform: ${args.platform}`);
  if (args.dryRun) console.log('DRY RUN\n');

  const hashtags = buildPostHashtags(['events', 'wellness', 'community']);

  for (const phase of phases) {
    console.log(`\n========== ${phase.toUpperCase()} ==========\n`);

    const content = await generatePhase(phase, args.event, args.platform);

    if (content.tweet) {
      console.log('--- TWEET ---');
      console.log(content.tweet);
      console.log(`(${content.tweet.length} chars)\n`);
    }

    if (content.igCaption) {
      console.log('--- INSTAGRAM ---');
      console.log(content.igCaption);
      console.log(`\n${hashtags}\n`);
    }

    if (args.dryRun) continue;

    // Only post announcement phase automatically; others are previews
    if (phase !== 'announcement' && phases.length > 1) {
      console.log(`(${phase} — preview only, use --phase ${phase} to post)\n`);
      continue;
    }

    // Post
    let twitterResult: { id: string; text: string; url: string } | undefined;
    let igResult: { id: string; permalink?: string } | undefined;

    if (content.tweet && (args.platform === 'twitter' || args.platform === 'both')) {
      console.log('Posting tweet...');
      const twitter = getTwitterService();
      twitterResult = await twitter.postTweet(content.tweet);
      console.log(`  Posted: ${twitterResult.url}`);
    }

    if (content.igCaption && args.imageUrl && (args.platform === 'instagram' || args.platform === 'both')) {
      console.log('Posting to Instagram...');
      const ig = new InstagramService();
      igResult = await ig.publishFeedPost(args.imageUrl, `${content.igCaption}\n\n${hashtags}`);
      console.log(`  Posted: ${igResult.permalink || igResult.id}`);
    }

    logPublishedPost({
      date: new Date().toISOString(),
      contentType: 'event_promo',
      platform: args.platform,
      twitter: twitterResult
        ? { id: twitterResult.id, text: twitterResult.text, url: twitterResult.url }
        : undefined,
      instagram: igResult
        ? { id: igResult.id, permalink: igResult.permalink, caption: content.igCaption || '' }
        : undefined,
      hashtags,
    });
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
