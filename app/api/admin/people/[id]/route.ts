import { NextResponse } from 'next/server';
import { db } from '@/db';
import { people, personTags, tags, personNotes, subscriptions, eventCheckins, contacts } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = parseInt(id, 10);
    if (isNaN(personId)) {
      return NextResponse.json({ error: 'Invalid person ID' }, { status: 400 });
    }

    // Get the person record
    const [person] = await db
      .select()
      .from(people)
      .where(eq(people.id, personId));

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Get their tags
    const personTagList = await db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        personTagId: personTags.id,
      })
      .from(personTags)
      .innerJoin(tags, eq(tags.id, personTags.tagId))
      .where(eq(personTags.personId, personId));

    // Get all their notes
    const notes = await db
      .select()
      .from(personNotes)
      .where(eq(personNotes.personId, personId))
      .orderBy(desc(personNotes.createdAt));

    // Get subscription history
    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, person.email));

    // Get event check-in history
    const checkins = await db
      .select()
      .from(eventCheckins)
      .where(eq(eventCheckins.email, person.email))
      .orderBy(desc(eventCheckins.checkedInAt));

    // Get contact form submissions
    const contactForms = await db
      .select()
      .from(contacts)
      .where(eq(contacts.email, person.email))
      .orderBy(desc(contacts.createdAt));

    // Build timeline
    type TimelineEntry = {
      type: string;
      date: Date;
      detail: string;
    };
    const timeline: TimelineEntry[] = [];

    // Subscription events
    for (const sub of subs) {
      timeline.push({
        type: 'subscription',
        date: sub.createdAt,
        detail: `Subscribed to ${sub.type}`,
      });
    }

    // Event check-in events
    for (const ci of checkins) {
      timeline.push({
        type: 'event-checkin',
        date: ci.checkedInAt,
        detail: `Checked in at ${ci.eventName}`,
      });
    }

    // Contact form events
    for (const c of contactForms) {
      timeline.push({
        type: 'contact',
        date: c.createdAt,
        detail: `Sent message about "${c.topic}"`,
      });
    }

    // Notes
    for (const note of notes) {
      timeline.push({
        type: 'note',
        date: note.createdAt,
        detail: note.content.split('\n')[0].substring(0, 100),
      });
    }

    // Reached out timestamps
    if (person.lastReachedOut) {
      timeline.push({
        type: 'reached-out',
        date: person.lastReachedOut,
        detail: 'Reached out',
      });
    }

    // Sort timeline by date descending
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Compute attendance insights
    const totalCheckins = checkins.length;
    const eventNameCounts = new Map<string, number>();
    for (const ci of checkins) {
      eventNameCounts.set(ci.eventName, (eventNameCounts.get(ci.eventName) || 0) + 1);
    }
    let favoriteEventType: string | null = null;
    let maxCount = 0;
    for (const [name, count] of eventNameCounts) {
      if (count > maxCount) {
        maxCount = count;
        favoriteEventType = name;
      }
    }

    const firstEvent = checkins.length > 0 ? checkins[checkins.length - 1].checkedInAt : null;
    const lastEvent = checkins.length > 0 ? checkins[0].checkedInAt : null;

    let streak: string;
    if (totalCheckins === 0) {
      streak = subs.length > 0 ? 'subscriber-only' : 'one-timer';
    } else if (totalCheckins === 1) {
      streak = 'one-timer';
    } else if (totalCheckins >= 4) {
      streak = 'regular';
    } else {
      streak = 'occasional';
    }

    const attendanceInsights = {
      totalCheckins,
      favoriteEventType,
      firstEvent,
      lastEvent,
      streak,
    };

    return NextResponse.json({
      person,
      tags: personTagList,
      notes,
      timeline,
      attendanceInsights,
      subscriptions: subs,
      checkins,
      contactForms,
    });
  } catch (error) {
    console.error('Error fetching person:', error);
    return NextResponse.json({ error: 'Failed to fetch person' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = parseInt(id, 10);
    if (isNaN(personId)) {
      return NextResponse.json({ error: 'Invalid person ID' }, { status: 400 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (typeof body.starred === 'boolean') {
      updateData.starred = body.starred;
    }
    if (body.lastReachedOut !== undefined) {
      updateData.lastReachedOut = body.lastReachedOut ? new Date(body.lastReachedOut) : null;
    }
    if (body.firstName !== undefined) {
      updateData.firstName = body.firstName;
    }
    if (body.lastName !== undefined) {
      updateData.lastName = body.lastName;
    }
    if (body.phone !== undefined) {
      updateData.phone = body.phone;
    }

    const [updated] = await db
      .update(people)
      .set(updateData)
      .where(eq(people.id, personId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    return NextResponse.json({ person: updated });
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}
