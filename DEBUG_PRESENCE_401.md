# Quick Debug Reference - Presence 401 Fix

## ❌ If You Still See 401 Errors

### Quick Checks (30 seconds)

1. **Dev server running?**
   ```bash
   npm run dev
   ```

2. **Signed in to Clerk?**
   - Check browser: Look for Clerk user menu
   - If not signed in: Use the Sign In button

3. **Check DevTools Console** (F12):
   ```js
   // Test heartbeat endpoint directly
   fetch('/api/presence/heartbeat', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include',  // CRITICAL - must have this!
     body: JSON.stringify({
       noteKey: 'test-key',
       userId: 'test-user',
       displayName: 'Test'
     })
   }).then(r => {
     console.log('Response:', r.status, r.ok ? '✅' : '❌');
     return r.json();
   }).then(d => console.log('Data:', d))
   ```

   **Expected Response**: Status `200` with `{ok: true, data: [...]}`

4. **Check Network Tab** (F12 → Network):
   - Filter: "heartbeat"
   - Look for `POST /api/presence/heartbeat` requests
   - Click each request:
     - **Request Headers** tab: Should see `Cookie` header with `__session=xxx`
     - **Response** tab: Should be `{ok: true, data: [...]}`

---

## 🔍 Common Issues & Fixes

### Issue: Still Getting 401

**Check 1: Credentials Header Present?**
```typescript
// ❌ WRONG - Missing credentials
fetch('/api/presence/heartbeat', {
  method: 'POST',
  body: JSON.stringify({...})
})

// ✅ CORRECT - Includes credentials
fetch('/api/presence/heartbeat', {
  method: 'POST',
  credentials: 'include',  // THIS IS REQUIRED!
  body: JSON.stringify({...})
})
```

**Check 2: Signed In?**
- Open http://localhost:3000/admin/notes/new
- Should NOT redirect to `/sign-in`
- Should show admin interface

**Check 3: System Clock**
```bash
# Check your system clock accuracy
date
# Should match actual time within 30 seconds
```

### Issue: Presence Badges Not Appearing

1. **Check presence is sending**
   - DevTools → Network → Filter "heartbeat"
   - Should see POST requests every ~10 seconds
   - Status should be 200 (not 401)

2. **Check presence is received**
   - DevTools → Console
   - Run: `console.log(window.activeUsers)`
   - Should show array of active users (even if empty)

3. **Check subscription active**
   - DevTools → Console
   - Run: `console.log('Subscribed')`
   - Check for subscription errors in console

### Issue: Dev Server Shows "Clock Skew"

This is a Clerk warning about system time being off:

```
Clerk: Clock skew detected. This usually means that your system clock is inaccurate.
JWT cannot be used prior to not before date claim (nbf).
```

**Fix**: Your system clock is behind actual time. 

**On Windows:**
1. Right-click system tray clock
2. "Adjust date/time"
3. Turn on "Set time automatically"
4. Or manually set to actual time
5. Restart dev server

**Or in development**: The endpoints are now programmed to gracefully handle this, so presence should still work.

---

## 🧪 Verification Tests

### Test A: Single User Heartbeat
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: In browser console
fetch('/api/presence/heartbeat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    noteKey: 'test::key',
    userId: 'user1',
    displayName: 'User 1'
  })
}).then(r => r.json()).then(d => console.log('✅ Heartbeat:', d))
```

**Expected**: 
```json
{ "ok": true, "data": [{"note_key": "test::key", "user_id": "user1", ...}] }
```

### Test B: Fetch Active Users
```js
fetch('/api/presence/list?noteKey=test::key', {
  credentials: 'include'
}).then(r => r.json()).then(d => console.log('✅ Active users:', d.presence))
```

**Expected**:
```json
{
  "ok": true,
  "presence": [
    {
      "note_key": "test::key",
      "user_id": "user1",
      "display_name": "User 1",
      "last_active": "2025-11-09T...",
      "cursor": null
    }
  ]
}
```

### Test C: Rate Limiting
```js
// Should succeed (first 6)
for (let i = 0; i < 10; i++) {
  fetch('/api/presence/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      noteKey: 'test',
      userId: 'spam-test',
      displayName: 'Spam'
    })
  }).then(r => console.log(`${i}: ${r.status} ${r.ok ? '✅' : '❌'}`))
}
```

**Expected**:
- Requests 0-5: Status `200` ✅
- Requests 6-9: Status `429` (rate limited) ❌

---

## 📊 Status Check Commands

```bash
# Check build status
npm run build

# Check dev server
npm run dev
# Should start without errors on localhost:3000

# Check TypeScript
npx tsc --noEmit
# Should show 0 errors
```

---

## 🚀 When Everything Works

- ✅ Heartbeat requests return 200
- ✅ Presence list returns active users
- ✅ Badges appear in toolbar
- ✅ Multiple users see each other
- ✅ Remote draft alerts trigger
- ✅ No 401 errors in console

**Then**: Ready for full test suite and commit!

---

## 📞 Debug Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Signed in to Clerk (check user menu)
- [ ] System clock accurate (within 30 sec of actual time)
- [ ] `credentials: 'include'` present in all fetch calls
- [ ] Network tab shows successful heartbeat requests (200 status)
- [ ] DevTools console shows no 401 errors
- [ ] Presence badges visible when 2+ users edit same note
- [ ] Remote draft alerts appear when other user saves

All checked? **Time to test!** 🎉
