import { NextResponse } from 'next/server';
import { db } from '@/db';
import { personNotes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const { id, noteId } = await params;
    const personId = parseInt(id, 10);
    const noteIdNum = parseInt(noteId, 10);
    if (isNaN(personId) || isNaN(noteIdNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const [updated] = await db
      .update(personNotes)
      .set({
        content: body.content,
        updatedAt: new Date(),
      })
      .where(and(eq(personNotes.id, noteIdNum), eq(personNotes.personId, personId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ note: updated });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const { id, noteId } = await params;
    const personId = parseInt(id, 10);
    const noteIdNum = parseInt(noteId, 10);
    if (isNaN(personId) || isNaN(noteIdNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(personNotes)
      .where(and(eq(personNotes.id, noteIdNum), eq(personNotes.personId, personId)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
