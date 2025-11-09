# Step 4 Testing Guide - Realtime UX & Collaboration

## Overview
Step 4 adds presence awareness, collaborator badges, remote draft alerts, and improved realtime UX. This guide tests all features end-to-end.

---

## Prerequisites

✅ **Build Status**: PASSED (npm run build - 10.9s)

**Environment Setup**:
- Dev server running: `npm run dev`
- Two browser windows or tabs (both signed in via Clerk)
- Network tab open in DevTools (for monitoring API calls)
- Browser console open (for debugging)

---

## Test Checklist

### Phase 1: Initial Setup (5 min)

- [ ] **Start dev server**
  ```bash
  npm run dev
  ```
  Expected: Server runs on http://localhost:3000

- [ ] **Open two browser windows**
  - Window A: http://localhost:3000/admin/notes/new
  - Window B: http://localhost:3000/admin/notes/new
  - Both signed in as same/different Clerk users

- [ ] **Open DevTools in both windows**
  - Network tab: Monitor API calls to `/api/presence/*`, `/api/drafts/*`
  - Console tab: Check for errors

---

### Phase 2: Presence Detection (10 min)

**Goal**: Verify that when Window A opens a note, Window B detects it within 1-2 seconds.

**Test A: Initial Presence Load**
1. **Window A**: 
   - Select Subject, Topic, Subtopic (e.g., Polity → Rights → Article 15)
   - Select Note Type (e.g., "Big Notes")
   - Wait 2 seconds
   - Check Network tab: Should see `POST /api/presence/heartbeat` ✅

2. **Window B**:
   - **Before switching**: No presence badge visible in toolbar
   - Select **exact same** Subject, Topic, Subtopic, Note Type
   - **Expected within 2s**: 
     - ✅ Toolbar shows presence badge with initials avatar
     - ✅ Badge shows color-coded circle with first initials of other user
     - ✅ Hover tooltip shows: "editor_xxx • just now"

**Test B: Presence Badge Updates**
1. **Window A**: Keep note open
2. **Window B**: 
   - Check Network tab for `GET /api/presence/list?noteKey=...` call ✅
   - Should show **"Active: [avatar badge]"** in toolbar
   - Badge should update every ~10 seconds as heartbeat sends

3. **Verify in Console** (both windows):
   ```js
   // In DevTools console, check presence state:
   // Should log presence data when subscription receives updates
   console.log('Active users:', window.activeUsers);
   ```

**Test C: Leave Presence**
1. **Window A**: 
   - Click note type dropdown and select different type (e.g., "Small Notes")
   - **Expected**: Presence badge disappears within 2s on Window B
   - Check Network tab: `POST /api/presence/leave` called

2. **Verify**:
   - Window B toolbar no longer shows badge ✅
   - Console shows no errors ✅

---

### Phase 3: Remote Draft Alerts (8 min)

**Goal**: When user A saves a draft, user B sees a merge alert.

**Test A: Trigger Remote Draft Change**
1. **Window A**:
   - Enter Title: "Article 15 - Rights"
   - Enter some content in editor
   - Press Ctrl+S or wait 5 seconds for autosave
   - Check Network tab: `POST /api/drafts/save` succeeds ✅

2. **Window B**:
   - Do NOT edit anything yet
   - **Expected within 1-2s**:
     - ✅ Blue banner appears below toolbar: 
       ```
       "editor_xxx saved changes at 10:23 — [Merge] [Ignore]"
       ```
   - Console shows no subscription errors ✅

**Test B: Accept Remote Changes**
1. **Window B**:
   - Click **"Merge"** button on alert banner
   - **Expected**:
     - ✅ Alert disappears
     - ✅ Title field now shows: "Article 15 - Rights"
     - ✅ Editor content matches Window A's content

2. **Verify**:
   - No errors in console ✅
   - Network shows draft sync succeeded ✅

**Test C: Dismiss Remote Changes**
1. **Window A**:
   - Change title to: "Article 14 - Equality"
   - Save (Ctrl+S)
   - Wait 1-2 seconds

2. **Window B**:
   - Alert banner appears again
   - Click **"Ignore"** button
   - **Expected**:
     - ✅ Alert dismissed
     - ✅ Local draft still shows old content (not merged)

---

### Phase 4: Rate Limiting on Presence (5 min)

**Goal**: Verify heartbeat rate limiting doesn't block normal operation.

**Test A: Normal Heartbeat Rate (Should Pass)**
1. **Window A**: Keep note open for 30 seconds
2. **DevTools Network tab**:
   - Count `POST /api/presence/heartbeat` calls
   - **Expected**: ~3 calls (one every 10s) ✅
   - All should return **200 OK** ✅

**Test B: Rapid Heartbeat Spam (Should Rate Limit)**
1. **Window A DevTools Console**: Run this to simulate rapid heartbeats:
   ```js
   // Simulate 20 rapid heartbeat calls
   const noteKey = 'draft::sub::top::subtop::big-notes'; // adjust based on your selection
   for (let i = 0; i < 20; i++) {
     fetch('/api/presence/heartbeat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ 
         noteKey, 
         userId: 'test-user', 
         displayName: 'Test' 
       })
     }).then(r => console.log(`${i}: ${r.status}`));
   }
   ```

2. **Expected**:
   - First 6 calls: **200 OK** ✅
   - Calls 7-20: **429 Too Many Requests** ✅
   - Console shows rate limit error gracefully handled ✅
   - Network shows `Retry-After` header in 429 responses ✅

---

### Phase 5: PresenceBadge Component (5 min)

**Goal**: Verify avatar badges render correctly.

**Test A: Badge Visual Rendering**
1. **Window B**: With Window A in same note
2. **Toolbar**: Presence badge visible
3. **Visual Checks**:
   - ✅ Avatar circle is color-coded (not all same color)
   - ✅ Shows first letters of user display name (e.g., "e" for "editor_xxx")
   - ✅ Text is white on colored background
   - ✅ Hover shows tooltip with user name + "just now" or time

**Test B: Multiple Collaborators**
1. **Open 3rd window** with same note
2. **Expected**:
   - ✅ Up to 5 avatars show inline
   - ✅ 6th+ users show as "+N" count
   - ✅ Each avatar has distinct color

**Test C: Badge Responsiveness**
1. **Window A**: Leave note (navigate away)
2. **Window B**: 
   - **Expected within 2s**: Badge disappears or user count decreases ✅

---

### Phase 6: API Endpoint Tests (5 min)

**Test A: GET /api/presence/list**
1. **Window A**: Open note in Polity → Fundamental Rights → Article 15 → big-notes
2. **DevTools Console** (Window A):
   ```js
   fetch('/api/presence/list?noteKey=draft::sub_polity::top_fundamental_rights::subt_article_15::big-notes')
     .then(r => r.json())
     .then(d => console.log('Presence List:', d))
   ```
3. **Expected Response**:
   ```json
   {
     "ok": true,
     "presence": [
       {
         "id": "uuid",
         "note_key": "draft::...",
         "user_id": "editor_xxx",
         "display_name": "editor_xxx",
         "last_active": "2025-11-09T...",
         "cursor": null
       }
     ]
   }
   ```
   - ✅ Status 200
   - ✅ Array contains all active users for that note

**Test B: Rate Limit 429 Response**
1. **DevTools Console**:
   ```js
   // Simulate 10 rapid /api/presence/list calls
   for (let i = 0; i < 10; i++) {
     fetch('/api/presence/list?noteKey=test-key', { method: 'GET' })
       .then(r => console.log(`${i}: ${r.status} - Retry-After: ${r.headers.get('Retry-After')}`))
   }
   ```
2. **Expected**:
   - First ~2 calls: **200 OK** ✅
   - Rest: **429** with `Retry-After: 60` header ✅

**Test C: Missing noteKey**
1. **DevTools Console**:
   ```js
   fetch('/api/presence/list') // no query param
     .then(r => r.json())
     .then(d => console.log(d))
   ```
2. **Expected**: 
   - ✅ Status 400
   - ✅ Error message: "noteKey query param required"

---

### Phase 7: Real-World Scenario (10 min)

**Goal**: Full end-to-end collaboration workflow.

**Scenario**: Two students editing the same note simultaneously.

1. **Setup**:
   - Window A (Student 1): Subject: Polity, Topic: Fundamental Rights, Subtopic: Article 15, Type: Big Notes
   - Window B (Student 2): Same settings

2. **Workflow**:
   - **Student 1** enters title: "Article 15 - Prohibition of Discrimination"
   - **Student 2** sees presence badge ✅
   - **Student 1** autosaves (Ctrl+S or wait 5s)
   - **Student 2** sees alert: "editor_xxx saved changes at 10:23"
   - **Student 2** clicks "Merge" ✅
   - **Student 2** now has Student 1's content
   - **Student 2** adds to content and saves
   - **Student 1** sees alert and merges ✅

3. **Verify End-to-End**:
   - ✅ No console errors in either window
   - ✅ All API calls succeeded (check Network tab)
   - ✅ Both students ended up with same latest content
   - ✅ Presence badges updated correctly

---

## Performance Checks

**While running tests, monitor**:

1. **Network Performance**:
   - Presence heartbeat: `<100ms`
   - Draft save: `<500ms`
   - Presence list: `<200ms`

2. **Console Warnings** (should be minimal):
   - ✅ "Multiple GoTrueClient instances" - OK (known warning)
   - ❌ Red errors - Should be ZERO
   - ✅ Blue rate limit warnings - Expected

3. **Memory**: 
   - Watch DevTools Memory tab
   - No steady growth = ✅

---

## Success Criteria

All of the following must be ✅:

- [ ] Presence badges appear within 1-2s when second user opens note
- [ ] Remote draft alerts show when another user saves
- [ ] Merge/Ignore buttons work as expected
- [ ] Rate limiting prevents spam (429 after 6 rapid heartbeats)
- [ ] Production build completes without errors (✅ Already verified)
- [ ] No TypeScript errors in NoteBoxCreatorModern.tsx
- [ ] All API endpoints return correct status codes
- [ ] Multiple users can collaborate on same note simultaneously
- [ ] Presence properly cleans up when user leaves

---

## Troubleshooting

**Issue**: Presence badge doesn't appear in Window B
- **Check**: 
  - Window A sending heartbeat? (Network tab should show POST to /api/presence/heartbeat)
  - Same note key? (Check URL parameters match)
  - Subscriptions active? (Console: no subscription errors)

**Issue**: Alert doesn't appear on remote save
- **Check**:
  - Window A saved successfully? (Network: POST /api/drafts/save returns 200)
  - Supabase realtime channel subscribed? (Check subscription logs)
  - Different user IDs? (Alert only shows if different user saves)

**Issue**: Rate limit triggers too early
- **Check**:
  - Heartbeat interval is 10s (should allow 6/sec without hitting limit)
  - Network tab: How many heartbeats sent? Should be ~1 per 10s

**Issue**: Build fails
- **Run**: `npm run build` again and check error output
- **Common**: Missing dependencies - run `npm install`

---

## Test Report Template

After running all tests, fill this in:

```
Date: ___________
Tester: _________

✅ Phase 1 (Setup): PASS / FAIL
✅ Phase 2 (Presence): PASS / FAIL
✅ Phase 3 (Alerts): PASS / FAIL
✅ Phase 4 (Rate Limit): PASS / FAIL
✅ Phase 5 (Badge UI): PASS / FAIL
✅ Phase 6 (API Endpoints): PASS / FAIL
✅ Phase 7 (Real-World): PASS / FAIL

Overall: PASS / FAIL
Issues Found: [list any]
Notes: [any observations]
```

---

## Next Steps (After Testing)

Once all tests pass:
1. ✅ Commit changes: `git add -A && git commit -m "..."`
2. ✅ Push to main: `git push origin main`
3. ✅ Move to Priority 2 → Step 5: Merge Strategy & Conflict Resolution

