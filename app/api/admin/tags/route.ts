import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tags, personTags } from '@/db/schema';
import { eq, sql, count } from 'drizzle-orm';

export async function GET() {
  try {
    const allTags = await db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        createdAt: tags.createdAt,
        count: count(personTags.id),
      })
      .from(tags)
      .leftJoin(personTags, eq(personTags.tagId, tags.id))
      .groupBy(tags.id, tags.name, tags.color, tags.createdAt)
      .orderBy(tags.name);

    return NextResponse.json({ tags: allTags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
