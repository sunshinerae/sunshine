import { NextResponse } from 'next/server';
import { db } from '@/db';
import { people, personTags, tags, personNotes, subscriptions, eventCheckins, contacts } from '@/db/schema';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'newest';
    const starred = searchParams.get('starred');

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(people.firstName, `%${search}%`),
          ilike(people.lastName, `%${search}%`),
          ilike(people.email, `%${search}%`)
        )
      );
    }

    if (starred === 'true') {
      conditions.push(eq(people.starred, true));
    }

    // If filtering by tag, get the matching person IDs first
    let tagFilterPersonIds: number[] | null = null;
    if (tag) {
      const taggedPeople = await db
        .select({ personId: personTags.personId })
        .from(personTags)
        .innerJoin(tags, eq(tags.id, personTags.tagId))
        .where(eq(tags.name, tag));
      tagFilterPersonIds = taggedPeople.map((tp) => tp.personId);
      if (tagFilterPersonIds.length === 0) {
        return NextResponse.json({ people: [], total: 0 });
      }
    }

    // Query people with conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let allPeople = await db
      .select()
      .from(people)
      .where(whereClause)
      .orderBy(
        sort === 'starred'
          ? desc(people.starred)
          : sort === 'activity'
            ? desc(people.updatedAt)
            : desc(people.createdAt)
      );

    // Apply tag filter if needed
    if (tagFilterPersonIds !== null) {
      const idSet = new Set(tagFilterPersonIds);
      allPeople = allPeople.filter((p) => idSet.has(p.id));
    }

    // Fetch tags, latest notes, and source info for all people
    const personIds = allPeople.map((p) => p.id);
    const personEmails = allPeople.map((p) => p.email);

    if (personIds.length === 0) {
      return NextResponse.json({ people: [], total: 0 });
    }

    // Get all tags for these people
    const allPersonTags = await db
      .select({
        personId: personTags.personId,
        tagId: tags.id,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(personTags)
      .innerJoin(tags, eq(tags.id, personTags.tagId))
      .where(sql`${personTags.personId} IN ${personIds}`);

    // Get latest note for each person
    const latestNotes = await db
      .select({
        personId: personNotes.personId,
        content: personNotes.content,
        createdAt: personNotes.createdAt,
      })
      .from(personNotes)
      .where(sql`${personNotes.personId} IN ${personIds}`)
      .orderBy(desc(personNotes.createdAt));

    // Deduplicate to get only the latest note per person
    const latestNoteByPerson = new Map<number, { content: string; createdAt: Date }>();
    for (const note of latestNotes) {
      if (!latestNoteByPerson.has(note.personId)) {
        latestNoteByPerson.set(note.personId, { content: note.content, createdAt: note.createdAt });
      }
    }

    // Get sources: subscriptions by email
    const allSubs = personEmails.length > 0
      ? await db
          .select({ email: subscriptions.email, type: subscriptions.type, createdAt: subscriptions.createdAt })
          .from(subscriptions)
          .where(sql`${subscriptions.email} IN ${personEmails}`)
      : [];

    // Get sources: event check-ins by email
    const allCheckins = personEmails.length > 0
      ? await db
          .select({ email: eventCheckins.email, checkedInAt: eventCheckins.checkedInAt })
          .from(eventCheckins)
          .where(sql`${eventCheckins.email} IN ${personEmails}`)
      : [];

    // Get sources: contacts by email
    const allContacts = personEmails.length > 0
      ? await db
          .select({ email: contacts.email, createdAt: contacts.createdAt })
          .from(contacts)
          .where(sql`${contacts.email} IN ${personEmails}`)
      : [];

    // Build lookup maps
    const tagsByPerson = new Map<number, Array<{ id: number; name: string; color: string | null }>>();
    for (const pt of allPersonTags) {
      if (!tagsByPerson.has(pt.personId)) {
        tagsByPerson.set(pt.personId, []);
      }
      tagsByPerson.get(pt.personId)!.push({ id: pt.tagId, name: pt.tagName, color: pt.tagColor });
    }

    const subsByEmail = new Map<string, { types: Set<string>; latestDate: Date }>();
    for (const sub of allSubs) {
      if (!sub.email) continue;
      if (!subsByEmail.has(sub.email)) {
        subsByEmail.set(sub.email, { types: new Set(), latestDate: sub.createdAt });
      }
      const entry = subsByEmail.get(sub.email)!;
      entry.types.add(sub.type);
      if (sub.createdAt > entry.latestDate) entry.latestDate = sub.createdAt;
    }

    const checkinsByEmail = new Map<string, { count: number; latestDate: Date }>();
    for (const ci of allCheckins) {
      if (!checkinsByEmail.has(ci.email)) {
        checkinsByEmail.set(ci.email, { count: 0, latestDate: ci.checkedInAt });
      }
      const entry = checkinsByEmail.get(ci.email)!;
      entry.count++;
      if (ci.checkedInAt > entry.latestDate) entry.latestDate = ci.checkedInAt;
    }

    const contactsByEmail = new Map<string, Date>();
    for (const c of allContacts) {
      if (!contactsByEmail.has(c.email) || c.createdAt > contactsByEmail.get(c.email)!) {
        contactsByEmail.set(c.email, c.createdAt);
      }
    }

    // Assemble the response
    const enrichedPeople = allPeople.map((person) => {
      const personTagList = tagsByPerson.get(person.id) || [];
      const latestNote = latestNoteByPerson.get(person.id);
      const notePreview = latestNote
        ? latestNote.content.split('\n')[0].substring(0, 100)
        : null;

      // Compute sources
      const sources: string[] = [];
      const subEntry = subsByEmail.get(person.email);
      if (subEntry) {
        for (const t of subEntry.types) {
          sources.push(t);
        }
      }
      if (checkinsByEmail.has(person.email)) {
        sources.push('event-checkin');
      }
      if (contactsByEmail.has(person.email)) {
        sources.push('contact-form');
      }

      // Compute lastActivity — most recent date from any table
      const dates: Date[] = [person.updatedAt];
      if (latestNote) dates.push(latestNote.createdAt);
      if (subEntry) dates.push(subEntry.latestDate);
      const ciEntry = checkinsByEmail.get(person.email);
      if (ciEntry) dates.push(ciEntry.latestDate);
      const contactDate = contactsByEmail.get(person.email);
      if (contactDate) dates.push(contactDate);
      if (person.lastReachedOut) dates.push(person.lastReachedOut);

      const lastActivity = dates.reduce((latest, d) => (d > latest ? d : latest), dates[0]);

      return {
        ...person,
        tags: personTagList,
        notePreview,
        sources,
        lastActivity,
      };
    });

    // Re-sort by activity if requested (now that we have lastActivity computed)
    if (sort === 'activity') {
      enrichedPeople.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    }

    return NextResponse.json({ people: enrichedPeople, total: enrichedPeople.length });
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
  }
}
