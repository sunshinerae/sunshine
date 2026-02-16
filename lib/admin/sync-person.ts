import { db } from '@/db';
import { people } from '@/db/schema';
import { sql } from 'drizzle-orm';

/**
 * Ensure a person record exists for the given email.
 * Creates one if missing, backfills name/phone if the new data has them.
 * Never overwrites existing enrichment data (notes, tags, photos, stars).
 * Uses upsert to avoid race conditions.
 */
export async function syncPerson(data: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}) {
  if (!data.email) return;

  try {
    await db
      .insert(people)
      .values({
        email: data.email.toLowerCase(),
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phone: data.phone || null,
      })
      .onConflictDoUpdate({
        target: people.email,
        set: {
          // Only backfill missing fields — never overwrite existing data
          firstName: sql`COALESCE(${people.firstName}, ${data.firstName || null})`,
          lastName: sql`COALESCE(${people.lastName}, ${data.lastName || null})`,
          phone: sql`COALESCE(${people.phone}, ${data.phone || null})`,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    // Never block the original operation
    console.error('Failed to sync person:', error);
  }
}
