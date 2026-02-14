import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { eventCheckins, subscriptions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { EVENT_CONFIG } from '@/lib/constants';

const checkinSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(255),
  lastName: z.string().trim().min(1, 'Last name is required').max(255),
  email: z.string().trim().toLowerCase().email('Valid email is required').max(255),
  phone: z.string().trim().min(7, 'Valid phone number is required').max(50)
    .regex(/^[+\d][\d\s\-().]+$/, 'Please enter a valid phone number'),
  joinMailingList: z.boolean().optional().default(false),
});

async function syncMailingList(data: z.infer<typeof checkinSchema>) {
  if (!data.joinMailingList) return;

  // Keep DB source of truth for newsletter opt-ins.
  const existingNewsletter = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.email, data.email),
        eq(subscriptions.type, 'newsletter')
      )
    )
    .limit(1);

  if (existingNewsletter.length === 0) {
    await db.insert(subscriptions).values({
      type: 'newsletter',
      email: data.email,
      phone: null,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }

  if (!process.env.FLODESK_API_KEY) return;

  const flodeskPayload: Record<string, unknown> = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
  };

  if (process.env.FLODESK_SEGMENT_ID) {
    flodeskPayload.segment_ids = [process.env.FLODESK_SEGMENT_ID];
  }

  const flodeskRes = await fetch('https://api.flodesk.com/v1/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(process.env.FLODESK_API_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flodeskPayload),
  });

  if (!flodeskRes.ok) {
    const errBody = await flodeskRes.text().catch(() => '');
    throw new Error(`Flodesk sync failed (${flodeskRes.status}): ${errBody}`);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }

  try {
    const data = checkinSchema.parse(body);

    // Check for duplicate check-in
    const existing = await db
      .select()
      .from(eventCheckins)
      .where(
        and(
          eq(eventCheckins.email, data.email),
          eq(eventCheckins.eventName, EVENT_CONFIG.name)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      if (data.joinMailingList) {
        try {
          await syncMailingList(data);
        } catch (flodeskError) {
          console.error('Flodesk sync failed for existing check-in', {
            email: data.email,
            message: flodeskError instanceof Error ? flodeskError.message : 'Unknown error',
          });
        }
      }

      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
      });
    }

    // Save to database
    await db.insert(eventCheckins).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      eventName: EVENT_CONFIG.name,
    });

    // Best effort external sync: never block successful check-in.
    if (data.joinMailingList) {
      try {
        await syncMailingList(data);
      } catch (flodeskError) {
        console.error('Flodesk sync failed for check-in', {
          email: data.email,
          message: flodeskError instanceof Error ? flodeskError.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data' },
        { status: 400 }
      );
    }

    console.error('Check-in error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, error: 'Unable to check in' },
      { status: 500 }
    );
  }
}
