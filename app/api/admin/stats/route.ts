import { NextResponse } from 'next/server';
import { db } from '@/db';
import { people, personNotes, personTags, eventCheckins } from '@/db/schema';
import { eq, sql, count, and, gte, lte, desc, not, inArray } from 'drizzle-orm';

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total people count
    const [{ totalPeople }] = await db
      .select({ totalPeople: count() })
      .from(people);

    // New this month
    const [{ newThisMonth }] = await db
      .select({ newThisMonth: count() })
      .from(people)
      .where(gte(people.createdAt, startOfMonth));

    // Events attended this month (check-ins in current month)
    const [{ eventsThisMonth }] = await db
      .select({ eventsThisMonth: count() })
      .from(eventCheckins)
      .where(gte(eventCheckins.checkedInAt, startOfMonth));

    // --- Smart Nudges ---

    // 1. People with no notes
    const peopleWithNotes = db
      .select({ personId: personNotes.personId })
      .from(personNotes)
      .groupBy(personNotes.personId);

    const noNotesPeople = await db
      .select({
        id: people.id,
        firstName: people.firstName,
        lastName: people.lastName,
        email: people.email,
      })
      .from(people)
      .where(
        sql`${people.id} NOT IN (SELECT ${personNotes.personId} FROM ${personNotes})`
      )
      .limit(5);

    const [{ noNotesCount }] = await db
      .select({ noNotesCount: count() })
      .from(people)
      .where(
        sql`${people.id} NOT IN (SELECT ${personNotes.personId} FROM ${personNotes})`
      );

    // 2. People with no tags
    const [{ noTagsCount }] = await db
      .select({ noTagsCount: count() })
      .from(people)
      .where(
        sql`${people.id} NOT IN (SELECT ${personTags.personId} FROM ${personTags})`
      );

    // 3. Starred people not reached out to in 4+ weeks
    const starredNotReachedOut = await db
      .select({
        id: people.id,
        firstName: people.firstName,
        lastName: people.lastName,
        email: people.email,
        lastReachedOut: people.lastReachedOut,
      })
      .from(people)
      .where(
        and(
          eq(people.starred, true),
          sql`(${people.lastReachedOut} IS NULL OR ${people.lastReachedOut} < ${fourWeeksAgo})`
        )
      )
      .orderBy(desc(people.lastReachedOut));

    // 4. People with 2+ check-ins but none in 30 days (gone quiet)
    // First, find emails with 2+ check-ins
    const frequentCheckinEmails = await db
      .select({
        email: eventCheckins.email,
        checkinCount: count(),
        lastCheckin: sql<Date>`MAX(${eventCheckins.checkedInAt})`,
      })
      .from(eventCheckins)
      .groupBy(eventCheckins.email)
      .having(sql`COUNT(*) >= 2`);

    const goneQuietEmails = frequentCheckinEmails
      .filter((row) => {
        const lastCheckin = new Date(row.lastCheckin);
        return lastCheckin < thirtyDaysAgo;
      })
      .map((row) => row.email);

    let goneQuiet: Array<{
      id: number;
      firstName: string | null;
      lastName: string | null;
      email: string;
    }> = [];

    if (goneQuietEmails.length > 0) {
      goneQuiet = await db
        .select({
          id: people.id,
          firstName: people.firstName,
          lastName: people.lastName,
          email: people.email,
        })
        .from(people)
        .where(inArray(people.email, goneQuietEmails));
    }

    return NextResponse.json({
      totalPeople,
      newThisMonth,
      eventsThisMonth,
      nudges: {
        noNotes: {
          count: noNotesCount,
          sample: noNotesPeople,
        },
        noTags: {
          count: noTagsCount,
        },
        starredNotReachedOut: {
          count: starredNotReachedOut.length,
          people: starredNotReachedOut,
        },
        goneQuiet: {
          count: goneQuiet.length,
          people: goneQuiet,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
