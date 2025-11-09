# Priority 1 Step 1 — Clerk Server Verification ✅ COMPLETED

## Summary
Successfully replaced the admin-key shim with Clerk-backed server verification. All protected API routes now require valid Clerk authentication tokens sent via `Authorization: Bearer <token>` header.

## Changes Made

### 1. Created `lib/adminAuth.ts`
- **Purpose**: Server-side middleware to verify Clerk session tokens
- **Features**:
  - Prefers local JWT verification using `CLERK_JWT_KEY` (fast, no network)
  - Fallback to Clerk API verification using `CLERK_API_KEY` (if JWT key not available)
  - Optional admin email list check via `ADMIN_USERS` env var for role-based access
  - Returns `{ ok: true, userId, sessionId }` on success or `{ ok: false, status, message }` on failure

### 2. Updated 5 Protected API Routes
All routes now call `requireAdmin(req)` at the start and return 401 if auth fails:

- ✅ `app/api/drafts/save/route.ts` — saves draft notes
- ✅ `app/api/drafts/delete/route.ts` — deletes draft notes
- ✅ `app/api/presence/heartbeat/route.ts` — updates presence (active editors)
- ✅ `app/api/presence/leave/route.ts` — removes presence on logout
- ✅ `app/api/upload/image/route.ts` — uploads images to Cloudinary

### 3. Updated Client Components to Send Bearer Tokens
- ✅ `components/admin/NoteBoxCreator.tsx`
  - Added `useAuth()` hook from `@clerk/nextjs`
  - `saveDraft()` now calls `getToken()` and includes `Authorization: Bearer ${token}` header
  - Presence heartbeat and leave calls also include Bearer token
  
- ✅ `components/admin/RichTextEditor.tsx`
  - Added `useAuth()` hook
  - Image upload fetch to `/api/upload/image` includes Bearer token

### 4. Environment Configuration

#### `.env.local.example` — Comprehensive Guide
Updated with detailed instructions on where to find each key:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Frontend (safe to expose)
- `CLERK_SECRET_KEY` — Server secret
- `CLERK_JWT_KEY` — JWT public key (PEM format) for fast local verification
- `CLERK_API_KEY` — Fallback API key
- `CLERK_FRONTEND_API` — Clerk app domain (e.g., `capital-cobra-50.clerk.accounts.dev`)
- `NEXT_PUBLIC_CLERK_FRONTEND_API` — Same as above for frontend
- `ADMIN_USERS` — Optional comma-separated admin emails

#### `.env.local` — Your Development Secrets
Populated with your actual Clerk credentials:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2FwaXRhbC1jb2JyYS01MC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_GurNSDeNiOgmFeZEy8DnZkeLEl43MdXbcoBKqR8qZh
CLERK_JWT_KEY=-----BEGIN PUBLIC KEY----- ... -----END PUBLIC KEY-----
CLERK_FRONTEND_API=capital-cobra-50.clerk.accounts.dev
```

## How It Works

### Flow Diagram
```
1. User logs in via Clerk UI
2. Clerk SDK on client calls getToken() → Bearer token
3. Client sends: fetch('/api/drafts/save', { Authorization: `Bearer ${token}` })
4. Server route calls requireAdmin(req)
5. requireAdmin extracts Bearer token from header
6. Verifies with JWT locally OR via Clerk API
7. Returns userId if valid, 401 if invalid
8. Route handler uses userId for tracking/logging
```

### Error Responses
- **401 Unauthorized**: No token in header or invalid/expired token
- **403 Forbidden**: Token valid but user not in ADMIN_USERS list (if configured)
- **500 Internal Error**: No CLERK_JWT_KEY or CLERK_API_KEY configured on server

## Testing Checklist

### Local Development
- [ ] `npm run dev` starts without errors
- [ ] No TypeScript errors in editor or `npm run typecheck`
- [ ] Log in to admin UI with Clerk credentials
- [ ] Create a draft note → check Network tab for `/api/drafts/save` request with `Authorization` header
- [ ] See success response (200) with draft saved to Supabase
- [ ] Test presence heartbeat (should include Bearer token)
- [ ] Test image upload (should include Bearer token)

### Manual API Testing (curl)
```bash
# Should FAIL (no token)
curl -X POST http://localhost:3000/api/drafts/save \
  -H "Content-Type: application/json" \
  -d '{"noteKey":"test"}'
# Returns: 401 Unauthorized

# Should SUCCEED (with valid Clerk token)
curl -X POST http://localhost:3000/api/drafts/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-clerk-token>" \
  -d '{"noteKey":"test","payload":{}}'
# Returns: 200 OK
```

## Next Steps

**Priority 1 Step 2**: Verify & apply Supabase migrations
- Ensure `note_drafts` and `note_edit_presence` tables exist with proper constraints
- Create migration files in `migrations/`
- Validate upsert operations work without errors

**Priority 1 Step 3**: Add rate-limiting to protected routes
- Prevent brute force / spam attacks
- Configure per-endpoint limits (drafts, presence, upload)

## Files Changed
- ✅ `lib/adminAuth.ts` (NEW)
- ✅ `app/api/drafts/save/route.ts`
- ✅ `app/api/drafts/delete/route.ts`
- ✅ `app/api/presence/heartbeat/route.ts`
- ✅ `app/api/presence/leave/route.ts`
- ✅ `app/api/upload/image/route.ts`
- ✅ `components/admin/NoteBoxCreator.tsx`
- ✅ `components/admin/RichTextEditor.tsx`
- ✅ `.env.local.example`
- ✅ `.env.local`

## Dependencies Installed
- ✅ `@clerk/clerk-sdk-node` (server-side verification)
- ✅ `@clerk/nextjs` (client-side auth hooks)

## Commit Message
```
chore(auth): replace admin-key shim with Clerk server verification

- Add lib/adminAuth.ts with JWT & API key verification
- Update 5 protected routes to require Clerk auth
- Update NoteBoxCreator & RichTextEditor to send Bearer tokens
- Add Clerk env vars to .env.local.example with setup guide
- Populate .env.local with Clerk credentials (dev only)
```

---

## Status: ✅ COMPLETE & READY FOR TESTING

The implementation is complete. Next, test the flows locally and then proceed to **Priority 1 Step 2** (Supabase migrations).
