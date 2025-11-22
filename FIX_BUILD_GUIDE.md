# Quick Guide: Fix Remaining Build Errors

## Problem
Build fails with: `Error: supabaseUrl is required` during page data collection phase.

## Root Cause
API routes create Supabase clients at module level, which runs during build time when environment variables may not be available.

## Solution
Move Supabase client creation inside route handlers using the provided helper functions.

## Files to Fix (9 total)

### 1. `/app/api/drafts/delete/route.ts`
### 2. `/app/api/drafts/list/route.ts`
### 3. `/app/api/drafts/merge/route.ts`
### 4. `/app/api/presence/heartbeat/route.ts`
### 5. `/app/api/presence/leave/route.ts`
### 6. `/app/api/presence/list/route.ts`
### 7. `/app/api/published/notes/list/route.ts`
### 8. `/app/api/published/notes/[noteKey]/route.ts`
### 9. `/app/api/published/publish/route.ts`

## Pattern to Apply

### Before (❌ Causes build error):
```typescript
import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supa = createClient(SUPA_URL, SUPA_SERVICE_ROLE, { 
  auth: { persistSession: false } 
});

export async function POST(req: Request) {
  // uses supa here
}
```

### After (✅ Build-safe):
```typescript
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const supa = createServerSupabaseClient();
  
  if (!supa) {
    return NextResponse.json(
      { error: 'Database unavailable' }, 
      { status: 500 }
    );
  }
  
  // uses supa here
}
```

## Step-by-Step Fix

1. **Open each file** listed above
2. **Remove** the module-level Supabase client creation
3. **Add** import: `import { createServerSupabaseClient } from '@/lib/supabaseServer';`
4. **Add** client creation at the start of each route handler
5. **Add** null check for the client
6. **Test** with `npm run build`

## Example: Complete Fix for `/app/api/drafts/list/route.ts`

```typescript
// app/api/drafts/list/route.ts
import { NextResponse } from 'next/server';
import { requireAdminFromCookies } from '@/lib/adminAuth';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  // Auth check
  const auth = await requireAdminFromCookies();
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message }, 
      { status: auth.status || 401 }
    );
  }

  // Create client inside handler
  const supa = createServerSupabaseClient();
  if (!supa) {
    return NextResponse.json(
      { error: 'Database configuration missing' }, 
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { noteKey, limit = 10 } = body;

    if (!noteKey) {
      return NextResponse.json(
        { error: 'noteKey required' }, 
        { status: 400 }
      );
    }

    const { data, error } = await supa
      .from('note_drafts')
      .select('*')
      .eq('note_key', noteKey)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('list drafts error', error);
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    console.error('list route error', err);
    return NextResponse.json(
      { error: err?.message || 'Server error' }, 
      { status: 500 }
    );
  }
}
```

## Verification

After fixing all files, run:

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Build completed successfully!
```

## Alternative: Batch Fix Script

If you want to automate this, you can create a Node.js script:

```javascript
// scripts/fix-api-routes.js
const fs = require('fs');
const path = require('path');

const files = [
  'app/api/drafts/delete/route.ts',
  'app/api/drafts/list/route.ts',
  // ... add all 9 files
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove module-level client creation
  content = content.replace(
    /const SUPA_URL.*?\n.*?const SUPA_SERVICE_ROLE.*?\n.*?const supa = createClient.*?\n/gs,
    ''
  );
  
  // Add import if not present
  if (!content.includes('createServerSupabaseClient')) {
    content = content.replace(
      "import { NextResponse } from 'next/server';",
      "import { NextResponse } from 'next/server';\nimport { createServerSupabaseClient } from '@/lib/supabaseServer';"
    );
  }
  
  // Add client creation in handler
  // (This part needs manual review for each file)
  
  fs.writeFileSync(filePath, content);
});

console.log('✅ Fixed all API routes');
```

## Testing Checklist

After applying fixes:

- [ ] Build completes without errors
- [ ] All API routes respond correctly
- [ ] Supabase operations work in development
- [ ] No console errors in browser
- [ ] Admin panel functions properly
- [ ] Draft saving/loading works
- [ ] Presence system works
- [ ] Published notes work

## Need Help?

If you encounter issues:

1. Check `.env.local` has all required variables
2. Verify Supabase credentials are correct
3. Test individual API routes with Postman/curl
4. Check server logs for detailed errors
5. Ensure Clerk authentication is configured

## Success Criteria

✅ `npm run build` completes successfully
✅ No "supabaseUrl is required" errors
✅ All pages generate static data
✅ Production build is ready for deployment

---

**Estimated Time**: 15-30 minutes
**Difficulty**: Easy (repetitive pattern)
**Impact**: Unblocks production deployment
