import { NextResponse } from 'next/server';

const FRONTEND_SESSION_COOKIE = 'queuera_frontend_session';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  const user = await request.json().catch(() => null);

  if (!user?.id || !user?.email) {
    console.warn('[frontend-session] create failed: invalid payload');
    return NextResponse.json({ error: 'Invalid session payload' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(FRONTEND_SESSION_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  console.info(`[frontend-session] created userId=${user.id} secure=${process.env.NODE_ENV === 'production'}`);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(FRONTEND_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  console.info('[frontend-session] cleared');
  return response;
}
