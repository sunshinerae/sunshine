import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { eventCheckins } from '@/db/schema';

const checkinSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = checkinSchema.parse(body);

    // Save to database
    await db.insert(eventCheckins).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });

    // Sync to Flodesk (same pattern as subscribe route)
    if (process.env.FLODESK_API_KEY) {
      try {
        const flodeskPayload: Record<string, unknown> = {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
        };

        if (process.env.FLODESK_SEGMENT_ID) {
          flodeskPayload.segment_ids = [process.env.FLODESK_SEGMENT_ID];
        }

        await fetch('https://api.flodesk.com/v1/subscribers', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.FLODESK_API_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flodeskPayload),
        });
      } catch (flodeskError) {
        console.error('Flodesk API error:', flodeskError);
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

    console.error('Check-in error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to check in' },
      { status: 500 }
    );
  }
}
