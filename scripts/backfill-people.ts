/**
 * Backfill script: populate the `people` table from existing
 * subscriptions, eventCheckins, and contacts data.
 *
 * Run with: npx tsx scripts/backfill-people.ts
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { people, subscriptions, eventCheckins, contacts } from '../db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

interface PersonData {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

async function backfill() {
  console.log('Starting people backfill...\n');

  // Collect all unique emails with their best available data
  const emailMap = new Map<string, PersonData>();

  // 1. Pull from subscriptions
  const subs = await db.select().from(subscriptions);
  console.log(`Found ${subs.length} subscription records`);
  for (const sub of subs) {
    if (!sub.email) continue;
    const email = sub.email.toLowerCase();
    const existing = emailMap.get(email);
    emailMap.set(email, {
      email,
      firstName: existing?.firstName || sub.firstName,
      lastName: existing?.lastName || sub.lastName,
      phone: existing?.phone || sub.phone,
    });
  }

  // 2. Pull from event check-ins (richer data — always has name + phone)
  const checkins = await db.select().from(eventCheckins);
  console.log(`Found ${checkins.length} event check-in records`);
  for (const ci of checkins) {
    const email = ci.email.toLowerCase();
    const existing = emailMap.get(email);
    emailMap.set(email, {
      email,
      firstName: ci.firstName || existing?.firstName,
      lastName: ci.lastName || existing?.lastName,
      phone: ci.phone || existing?.phone,
    });
  }

  // 3. Pull from contacts (name only, no phone)
  const contactList = await db.select().from(contacts);
  console.log(`Found ${contactList.length} contact records`);
  for (const c of contactList) {
    const email = c.email.toLowerCase();
    const existing = emailMap.get(email);
    if (!existing) {
      // Try to split name into first/last
      const parts = c.name.trim().split(/\s+/);
      emailMap.set(email, {
        email,
        firstName: parts[0] || null,
        lastName: parts.slice(1).join(' ') || null,
        phone: null,
      });
    }
  }

  console.log(`\nFound ${emailMap.size} unique people to sync\n`);

  let created = 0;
  let skipped = 0;

  for (const person of emailMap.values()) {
    const existing = await db
      .select()
      .from(people)
      .where(eq(people.email, person.email))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(people).values({
      email: person.email,
      firstName: person.firstName || null,
      lastName: person.lastName || null,
      phone: person.phone || null,
    });
    created++;
  }

  console.log(`Done! Created ${created} people records, skipped ${skipped} (already existed)`);
  process.exit(0);
}

backfill().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
