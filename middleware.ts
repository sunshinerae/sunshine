import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

function verifySessionToken(token: string, secret: string): boolean {
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.ADMIN_PASSWORD || '';

  // Protect admin pages (except login) and admin API routes (except auth)
  const isAdminPage = pathname === '/admin' || (pathname.startsWith('/admin/') && !pathname.startsWith('/admin/login'));
  const isAdminApi = pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth');

  if (isAdminPage || isAdminApi) {
    const session = request.cookies.get('admin_session');

    if (!session || !verifySessionToken(session.value, secret)) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/((?!login).*)',
    '/api/admin/((?!auth).*)',
  ],
};
