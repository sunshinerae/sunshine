import { NextResponse } from 'next/server';
import { timingSafeEqual, createHmac, randomBytes } from 'crypto';

function generateSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD || '';
  const nonce = randomBytes(16).toString('hex');
  const timestamp = Date.now().toString();
  const payload = `${nonce}.${timestamp}`;
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  const secret = process.env.ADMIN_PASSWORD || '';
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [nonce, timestamp, sig] = parts;
  const payload = `${nonce}.${timestamp}`;
  const expectedSig = createHmac('sha256', secret).update(payload).digest('hex');

  try {
    const sigBuffer = Buffer.from(sig, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');
    if (sigBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ success: false, error: 'Admin not configured' }, { status: 500 });
    }

    // Constant-time password comparison
    const passwordBuffer = Buffer.from(password || '');
    const adminBuffer = Buffer.from(adminPassword);

    if (passwordBuffer.length !== adminBuffer.length ||
        !timingSafeEqual(passwordBuffer, adminBuffer)) {
      return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 });
    }

    const token = generateSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
