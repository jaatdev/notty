# 🧪 Priority 2 → Step 5: LWW Merge Strategy — Testing Guide

## ✅ Implementation Status

| Component | Status | Commit |
|-----------|--------|--------|
| Backend: Metadata endpoint | ✅ COMPLETE | d756750 |
| Backend: Merge endpoint | ✅ COMPLETE | d756750 |
| Backend: Conflict detection (409) | ✅ COMPLETE | d756750 |
| Client: State management | ✅ COMPLETE | 86dcc16 |
| Client: saveDraft with clientUpdatedAt | ✅ COMPLETE | 86dcc16 |
| Client: Merge handlers | ✅ COMPLETE | 86dcc16 |
| Client: Alert rendering | ✅ COMPLETE | 86dcc16 |
| Build status | ✅ VERIFIED | 86dcc16 (8.7s, 0 errors) |

---

## 🎯 Test Scenarios

### Scenario 1: Concurrent Edits → Conflict → Load Server

**Setup**:
- Window A: `http://localhost:3000/admin/notes/new`
- Window B: Same URL in another browser window/tab

**Steps**:
1. **Both windows**: Select same Subject → Topic → Subtopic
2. **Both windows**: Select same NoteBox Type (e.g., "Big Notes")
3. **Window A**: 
   - Type title: `"Test Note A"`
   - Type body: `"Content from A"`
   - Press `Ctrl+S` or wait 5s (autosave)
   - ✅ Observe: "Saved {timestamp}"
4. **Window B**: 
   - Type title: `"Test Note B"`
   - Type body: `"Content from B"`
   - Press `Ctrl+S` or wait 5s (autosave)
   - ⚠️ **Expected**: Yellow alert appears: **"Merge Conflict Detected"**
   - Shows: "Saved by {userId}" + timestamp
5. **Window B**: Click **"Load Server Version"**
   - ✅ Expected: Editor shows "Test Note A" (from Window A)
   - ✅ Alert disappears
   - ✅ Console: `✅ Applied server version`

**Acceptance**:
- [ ] Conflict alert appears with correct user + timestamp
- [ ] "Load Server" restores Window A's content
- [ ] Alert disappears after action
- [ ] No console errors

---

### Scenario 2: Concurrent Edits → Conflict → Overwrite

**Setup**: Same as Scenario 1

**Steps**:
1. **Window A**: Save `"Test Note A"` ✅
2. **Window B**: Type `"Test Note B"` and save
   - ⚠️ Gets 409 conflict alert
3. **Window B**: Click **"Overwrite with Mine"**
   - ✅ Expected: Alert disappears
   - ✅ Local editor still shows "Test Note B"
   - ✅ Console: `✅ Overwrote server with local version`
4. **Window A**: Press `Ctrl+R` (reload) or wait for next fetch
   - ✅ Expected: Loads and shows "Test Note B" (B's content now on server)

**Acceptance**:
- [ ] "Overwrite" clears the alert
- [ ] Local content remains in editor
- [ ] Other windows eventually see the overwritten content
- [ ] No console errors

---

### Scenario 3: Concurrent Edits → Conflict → Auto-Merge

**Setup**: Same as Scenario 1

**Steps**:
1. **Window A**: Save `"Test Note A"` ✅
2. **Window B**: Type `"Test Note B"` and save
   - ⚠️ Gets 409 conflict alert
3. **Window B**: Click **"Attempt Auto-Merge"**
   - ✅ Expected: Alert disappears
   - ✅ Current behavior: Falls back to server ("Test Note A")
   - ✅ Console: `✅ Auto-merge applied`

**Acceptance**:
- [ ] "Auto-Merge" executes without error
- [ ] Alert disappears
- [ ] Content updates (currently to server, enhanceable later)

---

### Scenario 4: Metadata Endpoint Test

**API Test** (using curl or Postman):

```bash
# 1. Save a draft first
curl -X POST http://localhost:3000/api/drafts/save \
  -H "Content-Type: application/json" \
  -d '{
    "noteKey": "draft::subj::topic::subtopic::big-notes",
    "payload": {"title": "Test", "bodyHtml": "<p>Body</p>"},
    "subjectId": "subj",
    "topicId": "topic",
    "subtopicId": "subtopic",
    "type": "big-notes"
  }' \
  --cookie "ory_kratos_session=..." \
  -i

# Expected: 200 OK

# 2. Fetch metadata
curl -X GET "http://localhost:3000/api/drafts/metadata?noteKey=draft::subj::topic::subtopic::big-notes" \
  -i

# Expected: 200 OK with {"exists": true, "noteKey": "...", "updatedAt": "...", "userId": "...", "payload": {...}}
```

**Acceptance**:
- [ ] Metadata returns when draft exists
- [ ] Returns `exists: false` for non-existent keys
- [ ] No 500 errors

---

### Scenario 5: 409 Conflict Response

**API Test** (manual):

```bash
# Save draft 1
curl -X POST http://localhost:3000/api/drafts/save \
  -H "Content-Type: application/json" \
  -d '{
    "noteKey": "test-conflict",
    "payload": {"title": "Version 1"},
    "clientUpdatedAt": "2025-01-01T00:00:00Z"
  }' \
  --cookie "..." \
  -i

# Returns: 200 OK with updated_at = T1

# Try to save as if client has old timestamp
curl -X POST http://localhost:3000/api/drafts/save \
  -H "Content-Type: application/json" \
  -d '{
    "noteKey": "test-conflict",
    "payload": {"title": "Version 2"},
    "clientUpdatedAt": "2024-01-01T00:00:00Z"
  }' \
  --cookie "..." \
  -i

# Expected: 409 Conflict with {"error": "conflict", "serverMeta": {...}}
```

**Acceptance**:
- [ ] 409 returned when `clientUpdatedAt < server.updated_at`
- [ ] 409 includes `serverMeta` with server payload
- [ ] 200 returned when timestamps match or client is newer

---

### Scenario 6: Full Workflow - No Conflict Case

**Setup**: Same as Scenario 1

**Steps**:
1. **Window A**: Type and save `"Note A"` ✅ (alert shows "Saved")
2. **Wait 2 seconds**
3. **Window A**: Edit to `"Note A Updated"` and save ✅ (should succeed, no conflict)
4. **Window B**: Type and save `"Note B"` → Gets 409 (expected)
5. **Window B**: Click "Load Server" → Shows "Note A Updated" ✅

**Acceptance**:
- [ ] Same user saving twice does not trigger conflict
- [ ] Timestamps propagate correctly
- [ ] Different users get conflict when saving to same draft

---

## 🛠️ Manual Testing Checklist

### Pre-Test

- [ ] Dev server running: `npm run dev`
- [ ] Browser DevTools console open (watch for errors)
- [ ] Two browser windows/tabs ready
- [ ] Clerk auth working (can login)

### Testing

- [ ] Scenario 1 (Load Server): PASS / FAIL
- [ ] Scenario 2 (Overwrite): PASS / FAIL
- [ ] Scenario 3 (Auto-Merge): PASS / FAIL
- [ ] Scenario 4 (Metadata API): PASS / FAIL
- [ ] Scenario 5 (409 API): PASS / FAIL
- [ ] Scenario 6 (No Conflict): PASS / FAIL

### Post-Test

- [ ] No console errors (❌ 404s or ❌ 500s)
- [ ] No unhandled promise rejections
- [ ] Alerts render correctly (yellow border, 3 buttons)
- [ ] Editor content updates as expected

---

## 🐛 Troubleshooting

### Alert doesn't appear on conflict

**Possible causes**:
1. Client not sending `clientUpdatedAt` → Check browser console for save request body
2. Server timestamps wrong → Check Supabase `note_drafts.updated_at` values
3. localStorage `lastSavedAt` not tracking → Check `localStorage.getItem("draft:...")`

**Debug**:
```js
// In browser console
localStorage.getItem('notty_lastSavedAt'); // Should show ISO timestamp
// Check network tab: POST /api/drafts/save should include "clientUpdatedAt"
```

---

### Handlers not working

**Possible causes**:
1. `MergeConflictAlert` component not imported → Check imports in NoteBoxCreatorModern
2. Handler functions not bound correctly → Check console for "handleApplyServer is not a function"
3. Merge endpoint returning error → Check response status in Network tab

**Debug**:
```js
// In browser console after 409
// Should trigger:
// - console.log('✅ Applied server version') or similar
// - setConflictServerMeta(null) should clear the alert
```

---

### Build errors

**If you see**:
- `Module not found` → Run `npm install`
- `TypeScript errors` → Run `npm run typecheck` to see all errors
- `Port 3000 in use` → Kill: `lsof -i :3000 | grep node | awk '{print $2}' | xargs kill`

---

## 📊 Expected Behavior Summary

| Action | Window A | Window B | Server |
|--------|----------|----------|--------|
| Save (A) at T0 | ✅ 200 OK | — | updated_at = T0 |
| Save (B) at T0+5s with T0 | — | ❌ 409 (B's T0 < server T0) | No change |
| Click Load Server | — | Shows A's content | No change |
| Post-Load Save (B) | — | ✅ 200 OK (T1) | updated_at = T1 |

---

## 🚀 Success Criteria

- ✅ 409 conflicts detected correctly (server.updated_at > client.clientUpdatedAt)
- ✅ MergeConflictAlert renders with correct data
- ✅ All 3 handlers (Load Server / Overwrite / Auto-Merge) work
- ✅ Editor updates after each action
- ✅ No console errors or warnings
- ✅ Build passes TypeScript strict mode
- ✅ Rate limiting still enforced (2 saves/2sec)

---

## 📝 Notes

- **Current Auto-Merge**: Falls back to server (safe default). Can enhance later with per-section merging (Yjs).
- **Sanitization**: Basic regex-based HTML cleaning in merge endpoint (no XSS risk).
- **Timestamp Format**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) used throughout.
- **Rate Limiting**: Preserved at `/api/drafts/save` (2 per 2 sec per user-note).

---

## 📞 Questions?

Refer to:
- **Backend Details**: `PRIORITY_2_STEP_5_PART_1.md`
- **API Documentation**: `PRIORITY_2_STEP_5_PART_1.md` → API Documentation section
- **Client Wiring Reference**: `PRIORITY_2_STEP_5_PART_2_GUIDE.md`

---

**Status**: ✅ **READY FOR TESTING**

Start with Scenario 1 (Load Server) as the simplest case, then progress through scenarios 2-6.
