import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const subscribeSchema = z.object({
  type: z.enum(['newsletter', 'sms', 'glow-notes', 'guide', 'waitlist', 'launch']),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).superRefine((val, ctx) => {
  const needsPhone = val.type === 'sms';
  const needsEmail = val.type !== 'sms';

  if (needsPhone && !val.phone) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Phone is required for SMS.' });
  }
  if (needsEmail && !val.email) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Email is required.' });
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = subscribeSchema.parse(body);

    // Check if already subscribed
    if (data.email) {
      const existing = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.email, data.email),
            eq(subscriptions.type, data.type)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'Thanks for joining.',
          alreadySubscribed: true
        });
      }
    }

    // Check if phone already subscribed
    if (data.phone) {
      const existingPhone = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.phone, data.phone),
            eq(subscriptions.type, data.type)
          )
        )
        .limit(1);

      if (existingPhone.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'Thanks for joining.',
          alreadySubscribed: true
        });
      }
    }

    // Save to database
    await db.insert(subscriptions).values({
      type: data.type,
      email: data.email || null,
      phone: data.phone || null,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
    });

    // TODO: wire to real email/SMS provider (Resend, Postmark, Twilio, etc.)
    console.log('New subscription:', { type: data.type });

    return NextResponse.json({ success: true, message: 'Thanks for joining.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    console.error('Subscription error:', error);
    return NextResponse.json({ success: false, error: 'Unable to subscribe' }, { status: 500 });
  }
}
