# Priority 2 → Step 5 Part 2: Client Wiring (Next Steps)

## 🎯 What's Next

The **backend is now complete**. We have:
- ✅ `/api/drafts/metadata` - Get server state
- ✅ `/api/drafts/save` with conflict detection (409)
- ✅ `/api/drafts/merge` - Merge strategies
- ✅ `MergeConflictAlert` component

**Now we need to wire the client side** into `NoteBoxCreatorModern.tsx` to:
1. Fetch metadata on mount and compare with local
2. Include `clientUpdatedAt` when saving
3. Show alert when 409 conflict occurs
4. Implement merge action handlers

---

## 📋 Implementation Checklist (Part D)

### D.1: Add State for Conflict Management
In `NoteBoxCreatorModern.tsx`, add to component state:

```tsx
const [conflictServerMeta, setConflictServerMeta] = useState<any>(null);
const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
```

### D.2: Fetch Metadata on Mount
Add effect to check server state on component mount:

```tsx
useEffect(() => {
  if (!noteDraftKey) return;
  
  const savedTime = localStorage.getItem(`draft:${noteDraftKey}:updatedAt`);
  if (savedTime) {
    setLastSavedAt(savedTime);
  }
  
  // Fetch metadata to check for remote changes
  (async () => {
    try {
      const res = await fetch(`/api/drafts/metadata?noteKey=${encodeURIComponent(noteDraftKey)}`, {
        credentials: 'include',
      });
      const meta = await res.json();
      if (meta.exists && savedTime) {
        const serverUpdated = new Date(meta.updatedAt).getTime();
        const localUpdated = new Date(savedTime).getTime();
        if (serverUpdated > localUpdated) {
          // Remote version is newer
          setConflictServerMeta(meta);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch draft metadata:', err);
    }
  })();
}, [noteDraftKey]);
```

### D.3: Update Save Function to Include `clientUpdatedAt`

When calling `/api/drafts/save`, add `clientUpdatedAt`:

```tsx
async function saveDraft() {
  try {
    const payload = getEditorPayload(); // your method to get current editor content
    const clientUpdatedAt = lastSavedAt || new Date().toISOString();
    
    const res = await fetch('/api/drafts/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        noteKey: noteDraftKey,
        subjectId,
        topicId,
        subtopicId,
        type,
        payload,
        clientUpdatedAt, // ← NEW: For conflict detection
      }),
    });

    if (res.status === 409) {
      // Conflict detected
      const body = await res.json();
      setConflictServerMeta(body.serverMeta);
      console.warn('Merge conflict detected');
      return { ok: false, conflict: true };
    }

    if (!res.ok) {
      const err = await res.json();
      console.error('Save failed:', err);
      return { ok: false };
    }

    const data = await res.json();
    // Update local timestamp after successful save
    const serverUpdatedAt = data?.data?.[0]?.updated_at || new Date().toISOString();
    localStorage.setItem(`draft:${noteDraftKey}:updatedAt`, serverUpdatedAt);
    setLastSavedAt(serverUpdatedAt);
    setConflictServerMeta(null); // Clear any pending conflict
    
    return { ok: true };
  } catch (err) {
    console.error('Save error:', err);
    return { ok: false };
  }
}
```

### D.4: Implement Merge Handlers

Add functions to handle each merge action:

```tsx
// Handler 1: Load server version (discard local changes)
async function handleApplyServer() {
  if (!conflictServerMeta) return;
  
  try {
    const serverPayload = conflictServerMeta.payload;
    // Load server payload into editor (your editor's load method)
    loadEditorContent(serverPayload);
    
    // Update local state
    localStorage.setItem(`draft:${noteDraftKey}:updatedAt`, conflictServerMeta.updatedAt);
    setLastSavedAt(conflictServerMeta.updatedAt);
    setConflictServerMeta(null);
    
    console.log('Applied server version');
  } catch (err) {
    console.error('Failed to apply server version:', err);
  }
}

// Handler 2: Overwrite server (force save local changes)
async function handleApplyClient() {
  if (!conflictServerMeta) return;
  
  try {
    const clientPayload = getEditorPayload();
    
    const res = await fetch('/api/drafts/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        noteKey: noteDraftKey,
        strategy: 'accept_client',
        clientPayload,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Merge failed:', err);
      return;
    }

    const result = await res.json();
    if (result.ok) {
      const serverUpdatedAt = result?.data?.[0]?.updated_at || new Date().toISOString();
      localStorage.setItem(`draft:${noteDraftKey}:updatedAt`, serverUpdatedAt);
      setLastSavedAt(serverUpdatedAt);
      setConflictServerMeta(null);
      console.log('Overwrote server with client version');
    }
  } catch (err) {
    console.error('Failed to overwrite server:', err);
  }
}

// Handler 3: Attempt auto-merge
async function handleAttemptMerge() {
  if (!conflictServerMeta) return;
  
  try {
    const clientPayload = getEditorPayload();
    
    const res = await fetch('/api/drafts/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        noteKey: noteDraftKey,
        strategy: 'auto_merge',
        clientPayload,
      }),
    });

    if (!res.ok) {
      console.error('Auto-merge failed');
      return;
    }

    const result = await res.json();
    if (result.ok) {
      // Load the merged result (if available)
      if (result.payload) {
        loadEditorContent(result.payload);
      }
      const serverUpdatedAt = result?.data?.[0]?.updated_at || new Date().toISOString();
      localStorage.setItem(`draft:${noteDraftKey}:updatedAt`, serverUpdatedAt);
      setLastSavedAt(serverUpdatedAt);
      setConflictServerMeta(null);
      console.log('Auto-merge completed:', result.reason);
    }
  } catch (err) {
    console.error('Failed to attempt merge:', err);
  }
}
```

### D.5: Render the Alert

In your JSX, add the alert component at the top of the editor area:

```tsx
import MergeConflictAlert from '@/components/ui/MergeConflictAlert';

// In render:
{conflictServerMeta && (
  <MergeConflictAlert
    serverMeta={conflictServerMeta}
    onApplyServer={handleApplyServer}
    onApplyClient={handleApplyClient}
    onAttemptMerge={handleAttemptMerge}
  />
)}
```

---

## 🧪 Testing the Full Flow

### Scenario: Concurrent Edits

**Setup**:
1. Open two browser windows (A and B) with Clerk login (same or different users)
2. Both navigate to `/admin/notes/new` on the same subject/topic/note

**Test Flow**:

**Step 1: Window A makes a change**
- A: Type title "Version A"
- A: Click Save (or wait for autosave)
- Expected: Save succeeds, localStorage updated with new `updatedAt`

**Step 2: Window B makes a conflicting change**
- B: Type title "Version B" (different from A)
- B: Do NOT save yet
- B should still have old `updatedAt` in localStorage

**Step 3: B attempts to save**
- B: Click Save
- Expected: 
  - Network shows 409 response
  - `conflictServerMeta` state updates
  - **Blue alert banner appears** with buttons:
    - "Load Server Version"
    - "Overwrite with Mine"
    - "Attempt Auto-Merge"

**Step 4: Test "Load Server Version"**
- B: Click "Load Server Version" button
- Expected:
  - Editor in B shows A's content ("Version A")
  - Alert disappears
  - localStorage updated with server's `updatedAt`

**Step 5: Test "Overwrite with Mine"**
- Repeat steps 1-3
- B: Click "Overwrite with Mine"
- Expected:
  - Alert disappears
  - localStorage updated with new time
  - Server now has "Version B"
  - Window A: When it fetches metadata, sees B's version

**Step 6: Test Auto-Merge (bonus)**
- Repeat steps 1-3
- B: Click "Attempt Auto-Merge"
- Expected:
  - Currently returns "auto-merge not implemented" but succeeds
  - Can be enhanced later with smarter merge logic

---

## 📋 Code Integration Locations

### Where to Add State (NoteBoxCreatorModern.tsx)

Around **line 144** (with other state):
```tsx
const [conflictServerMeta, setConflictServerMeta] = useState<any>(null);
const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
```

### Where to Add Metadata Fetch Effect

Around **line 258** (with other useEffect hooks):
```tsx
useEffect(() => {
  // metadata fetch code here
}, [noteDraftKey]);
```

### Where to Update Save Function

Around **line 300+** (in saveDraft or your autosave handler):
```tsx
async function saveDraft() {
  // include clientUpdatedAt and handle 409
}
```

### Where to Add Handlers

Around **line 400+** (add new functions):
```tsx
async function handleApplyServer() { ... }
async function handleApplyClient() { ... }
async function handleAttemptMerge() { ... }
```

### Where to Render Alert

Around **line 750+** (in the JSX return):
```tsx
{conflictServerMeta && (
  <MergeConflictAlert ... />
)}
```

---

## 🎯 Acceptance Criteria (After Client Wiring)

- [ ] Metadata is fetched on mount
- [ ] `clientUpdatedAt` is included in save requests
- [ ] 409 conflicts are detected and state updated
- [ ] Alert banner shows when conflict detected
- [ ] "Load Server Version" loads remote content
- [ ] "Overwrite with Mine" force-saves local content
- [ ] "Attempt Auto-Merge" processes without error
- [ ] After any merge action, alert disappears
- [ ] localStorage timestamps stay in sync with server

---

## 🚀 Recommended Implementation Order

1. **Add state** (5 min)
2. **Add metadata fetch effect** (5 min)
3. **Update saveDraft to include clientUpdatedAt** (5 min)
4. **Add 409 handling** (5 min)
5. **Implement handlers** (15 min)
6. **Render alert** (5 min)
7. **Test with two windows** (15 min)

**Total**: ~55 minutes for full implementation

---

## 💡 Tips & Gotchas

1. **localStorage keys**: Keep consistent format: `draft:${noteKey}:updatedAt`
2. **Credentials**: Always include `credentials: 'include'` on fetch calls
3. **Editor content**: Make sure `getEditorPayload()` and `loadEditorContent()` work correctly
4. **Error handling**: Log conflicts but don't break - show alert gracefully
5. **Race conditions**: If user saves while alert is showing, new save should clear alert if successful
6. **Reload safety**: localStorage persists, so after page reload B will know about the conflict

---

## ✅ Status

**Part 1 (Backend)**: ✅ **COMPLETE & PUSHED**
- Metadata endpoint ✅
- Merge endpoint ✅
- Conflict detection in save ✅
- Build verified ✅

**Part 2 (Client Wiring)**: 📋 **READY FOR IMPLEMENTATION**
- Checklist prepared
- Code examples provided
- Test scenarios documented

**Next Action**: Apply Part D to `NoteBoxCreatorModern.tsx` → Test with two windows → Commit

---

Let me know when you're ready to proceed with Part D! 🚀
