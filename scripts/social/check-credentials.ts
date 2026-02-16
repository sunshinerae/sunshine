#!/usr/bin/env npx tsx
/**
 * Check Social Media Credentials
 *
 * Verifies that Twitter and Instagram API keys are configured
 * and working. Run this before anything else.
 *
 * Usage: npx tsx scripts/social/check-credentials.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getTwitterService } from '../../lib/social/twitter.service';
import { InstagramService } from '../../lib/social/instagram.service';

async function main() {
  console.log('Checking social media credentials...\n');

  // Twitter
  console.log('=== TWITTER ===');
  const twitter = getTwitterService();
  if (!twitter.isConfigured()) {
    console.log('  NOT CONFIGURED - missing env vars');
    console.log('  Required: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET');
  } else {
    const result = await twitter.verifyCredentials();
    if (result.ok) {
      console.log(`  OK - authenticated as @${result.username}`);
    } else {
      console.log('  FAILED - credentials invalid');
    }
  }

  // Instagram
  console.log('\n=== INSTAGRAM ===');
  if (!process.env.META_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
    console.log('  NOT CONFIGURED - missing env vars');
    console.log('  Required: META_ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID');
  } else {
    try {
      const ig = new InstagramService();
      const perms = await ig.checkPermissions();
      if (perms.ok) {
        console.log(`  OK - all permissions granted: ${perms.granted.join(', ')}`);
      } else {
        console.log(`  PARTIAL - missing permissions: ${perms.missing.join(', ')}`);
        console.log(`  Granted: ${perms.granted.join(', ')}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`  FAILED - ${message}`);
    }
  }

  // Anthropic (for content generation)
  console.log('\n=== ANTHROPIC (content generation) ===');
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('  NOT CONFIGURED - missing ANTHROPIC_API_KEY');
  } else {
    console.log('  OK - ANTHROPIC_API_KEY is set');
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
