import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { db } from '@/db';
import { people } from '@/db/schema';
import { eq } from 'drizzle-orm';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const personId = formData.get('personId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!personId) {
      return NextResponse.json({ error: 'personId is required' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 });
    }

    const id = parseInt(personId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid person ID' }, { status: 400 });
    }

    // Verify the person exists
    const [person] = await db
      .select({ id: people.id })
      .from(people)
      .where(eq(people.id, id));

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Upload to Vercel Blob with safe extension from MIME type
    const extension = EXTENSION_MAP[file.type] || 'jpg';
    const blob = await put(`admin/photos/${personId}-${Date.now()}.${extension}`, file, {
      access: 'public',
    });

    // Update the person's photo URL
    await db
      .update(people)
      .set({ photoUrl: blob.url, updatedAt: new Date() })
      .where(eq(people.id, id));

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}
