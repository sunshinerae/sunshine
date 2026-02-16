#!/usr/bin/env npx tsx
/**
 * Post Content — The Sunshine Effect
 *
 * Generate and post content to Twitter, Instagram, or both.
 * Uses Claude to generate content in Sunshine's voice.
 *
 * Usage:
 *   npx tsx scripts/social/post-content.ts --platform twitter --type wellness_eeat
 *   npx tsx scripts/social/post-content.ts --platform instagram --type humor_personality
 *   npx tsx scripts/social/post-content.ts --platform both --type event_promo --context "breathwork at the loft this saturday 7pm, $25"
 *   npx tsx scripts/social/post-content.ts --platform twitter --custom "your nervous system doesn't care about your to-do list"
 *   npx tsx scripts/social/post-content.ts --dry-run --platform both --type wellness_eeat
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { generateContent } from '../../lib/social/voice';
import { pickContentType, getPrompt, ContentType, CONTENT_TYPES } from '../../lib/social/content-types';
import { buildPostHashtags } from '../../lib/social/hashtags';
import { getTwitterService } from '../../lib/social/twitter.service';
import { InstagramService } from '../../lib/social/instagram.service';
import { logPublishedPost } from '../../lib/social/published-log';

// ---------------------------------------------------------------------------
// CLI Args
// ---------------------------------------------------------------------------

interface Args {
  platform: 'twitter' | 'instagram' | 'both';
  type?: ContentType;
  context?: string;
  custom?: string;
  imageUrl?: string;
  dryRun: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const args: Args = { platform: 'both', dryRun: false };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--platform':
        args.platform = argv[++i] as Args['platform'];
        break;
      case '--type':
        args.type = argv[++i] as ContentType;
        break;
      case '--context':
        args.context = argv[++i];
        break;
      case '--custom':
        args.custom = argv[++i];
        break;
      case '--image-url':
        args.imageUrl = argv[++i];
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
  const contentType = args.type || pickContentType();

  console.log(`Content type: ${contentType} (${CONTENT_TYPES[contentType].description})`);
  console.log(`Platform: ${args.platform}`);
  if (args.dryRun) console.log('DRY RUN — nothing will be posted\n');

  // Generate content
  let tweetText: string | undefined;
  let igCaption: string | undefined;

  if (args.custom) {
    // Custom text — use as-is
    tweetText = args.custom;
    igCaption = args.custom;
    console.log('\nUsing custom text.');
  } else {
    // AI-generated content
    if (args.platform === 'twitter' || args.platform === 'both') {
      const prompt = getPrompt(contentType, 'twitter');
      const fullPrompt = args.context
        ? `${prompt}\n\nEvent/topic details: ${args.context}`
        : prompt;

      console.log('\nGenerating tweet...');
      tweetText = await generateContent({
        format: 'tweet',
        prompt: fullPrompt,
        maxLength: 280,
      });
    }

    if (args.platform === 'instagram' || args.platform === 'both') {
      const prompt = getPrompt(contentType, 'instagram');
      const fullPrompt = args.context
        ? `${prompt}\n\nEvent/topic details: ${args.context}`
        : prompt;

      console.log('Generating Instagram caption...');
      igCaption = await generateContent({
        format: 'ig_caption',
        prompt: fullPrompt,
      });
    }
  }

  // Build hashtags for IG
  const hashtagCategories: (keyof typeof import('../../lib/social/hashtags').HASHTAG_SETS)[] = ['wellness'];
  if (contentType === 'event_promo') hashtagCategories.push('events', 'community');
  if (contentType === 'wellness_eeat') hashtagCategories.push('practices');
  if (contentType === 'community_recap') hashtagCategories.push('community');
  const hashtags = buildPostHashtags(hashtagCategories);

  // Preview
  if (tweetText) {
    console.log('\n--- TWEET ---');
    console.log(tweetText);
    console.log(`(${tweetText.length} chars)`);
  }
  if (igCaption) {
    console.log('\n--- INSTAGRAM ---');
    console.log(igCaption);
    console.log(`\n${hashtags}`);
  }

  if (args.dryRun) {
    console.log('\nDry run complete. Nothing posted.');
    return;
  }

  // Post
  let twitterResult: { id: string; text: string; url: string } | undefined;
  let igResult: { id: string; permalink?: string } | undefined;

  if (tweetText && (args.platform === 'twitter' || args.platform === 'both')) {
    console.log('\nPosting to Twitter...');
    const twitter = getTwitterService();
    twitterResult = await twitter.postTweet(tweetText);
    console.log(`  Posted: ${twitterResult.url}`);
  }

  if (igCaption && (args.platform === 'instagram' || args.platform === 'both')) {
    if (!args.imageUrl) {
      console.log('\nSkipping Instagram — no --image-url provided (required for IG posts)');
    } else {
      console.log('\nPosting to Instagram...');
      const ig = new InstagramService();
      const fullCaption = `${igCaption}\n\n${hashtags}`;
      igResult = await ig.publishFeedPost(args.imageUrl, fullCaption);
      console.log(`  Posted: ${igResult.permalink || igResult.id}`);
    }
  }

  // Log
  logPublishedPost({
    date: new Date().toISOString(),
    contentType,
    platform: args.platform,
    twitter: twitterResult
      ? { id: twitterResult.id, text: twitterResult.text, url: twitterResult.url }
      : undefined,
    instagram: igResult
      ? { id: igResult.id, permalink: igResult.permalink, caption: igCaption || '' }
      : undefined,
    hashtags,
  });

  console.log('\nDone. Logged to output/social-published.json');
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
