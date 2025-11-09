// lib/adminAuth.ts
// App Router friendly admin gate using Clerk's server helpers.
// No Authorization header required; reads the session from cookies.
//
// Optional: set ADMIN_USERS="you@domain.com,teammate@domain.com" to restrict admins by email.

import { auth, currentUser } from '@clerk/nextjs/server';

export async function requireAdminFromCookies() {
  const session = await auth(); // reads session from cookies
  const userId = session.userId;
  if (!userId) return { ok: false, status: 401, message: 'Not signed in' };

  // Optional email allow-list
  const allowList = (process.env.ADMIN_USERS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (allowList.length > 0) {
    const user = await currentUser();
    const email =
      (user as any)?.primaryEmailAddress?.emailAddress ||
      (user as any)?.emailAddresses?.[0]?.emailAddress ||
      '';
    if (!email || !allowList.includes(email.toLowerCase())) {
      return { ok: false, status: 403, message: 'Not an admin user' };
    }
  }

  return { ok: true, userId, sessionId: session.sessionId };
}
