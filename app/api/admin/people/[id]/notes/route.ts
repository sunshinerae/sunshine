import { NextResponse } from 'next/server';
import { db } from '@/db';
import { personNotes, people } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = parseInt(id, 10);
    if (isNaN(personId)) {
      return NextResponse.json({ error: 'Invalid person ID' }, { status: 400 });
    }

    // Verify the person exists
    const [person] = await db
      .select({ id: people.id })
      .from(people)
      .where(eq(people.id, personId));

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    const body = await request.json();
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const [note] = await db
      .insert(personNotes)
      .values({
        personId,
        content: body.content,
      })
      .returning();

    // Update the person's updatedAt
    await db
      .update(people)
      .set({ updatedAt: new Date() })
      .where(eq(people.id, personId));

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
