import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tags, personTags, people } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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
    if (!body.tagName || typeof body.tagName !== 'string') {
      return NextResponse.json({ error: 'tagName is required' }, { status: 400 });
    }

    const tagName = body.tagName.trim().toLowerCase();
    const color = body.color || null;

    // Find or create the tag
    let [existingTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.name, tagName));

    if (!existingTag) {
      [existingTag] = await db
        .insert(tags)
        .values({ name: tagName, color })
        .returning();
    }

    // Check if the person already has this tag
    const [existingPersonTag] = await db
      .select()
      .from(personTags)
      .where(and(eq(personTags.personId, personId), eq(personTags.tagId, existingTag.id)));

    if (existingPersonTag) {
      return NextResponse.json({ tag: existingTag, message: 'Tag already assigned' });
    }

    // Create the join record
    await db
      .insert(personTags)
      .values({ personId, tagId: existingTag.id });

    return NextResponse.json({ tag: existingTag }, { status: 201 });
  } catch (error) {
    console.error('Error adding tag:', error);
    return NextResponse.json({ error: 'Failed to add tag' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = parseInt(id, 10);
    if (isNaN(personId)) {
      return NextResponse.json({ error: 'Invalid person ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const tagIdParam = searchParams.get('tagId');
    if (!tagIdParam) {
      return NextResponse.json({ error: 'tagId query parameter is required' }, { status: 400 });
    }

    const tagId = parseInt(tagIdParam, 10);
    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(personTags)
      .where(and(eq(personTags.personId, personId), eq(personTags.tagId, tagId)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Tag assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing tag:', error);
    return NextResponse.json({ error: 'Failed to remove tag' }, { status: 500 });
  }
}
