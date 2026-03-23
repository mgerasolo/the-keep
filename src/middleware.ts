/**
 * Next.js Middleware
 * Handles session management for MVP single-user mode
 * Future: Will validate Authentik JWT tokens
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Seeded user ID - must match database
const SEEDED_USER_ID = 'e08cc546-fa29-4559-93f9-ceb658f66668';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check for existing session
  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie) {
    // Create session with seeded user (MVP single-user mode)
    const session = {
      userId: SEEDED_USER_ID,
      createdAt: Date.now(),
    };

    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // Add trace ID for request tracing (Story 0-6)
  const traceId = crypto.randomUUID();
  response.headers.set('X-Trace-ID', traceId);

  return response;
}

export const config = {
  // Match all routes except static files and API health check
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/health).*)',
  ],
};
