# 🎬 Animation Testing Guide

## Quick Test Instructions

### 1. Homepage Card Animation (Slide Up with Stagger) ✨

**What to expect:**
- Subject cards should slide up from bottom one by one
- Each card appears 50ms after the previous one
- Smooth fade + slide effect

**How to test:**
1. Open your browser to `http://localhost:3000`
2. **Hard refresh** to clear cache: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Watch the subject cards appear with stagger effect
4. Each card should:
   - Start invisible and 20px below
   - Slide up smoothly
   - Fade in simultaneously
   - Appear in sequence (not all at once)

**If not working:**
- Clear browser cache completely
- Ensure dev server is running: `npm run dev`
- Check browser console for errors (F12)
- Try incognito/private window

---

### 2. Konami Code Easter Egg 🎮

**What to expect:**
- Rainbow gradient popup appears
- Fireworks animation for 5 seconds
- Celebration message

**How to test:**
1. Go to any page on the site
2. Make sure the page is focused (click anywhere)
3. Press the following keys in order:
   ```
   ↑ ↑ ↓ ↓ ← → ← → B A
   ```
   (Arrow keys: Up Up Down Down Left Right Left Right, then B then A)

**Exact key sequence:**
- Press `↑` (Up Arrow)
- Press `↑` (Up Arrow) again
- Press `↓` (Down Arrow)
- Press `↓` (Down Arrow) again
- Press `←` (Left Arrow)
- Press `→` (Right Arrow)
- Press `←` (Left Arrow)
- Press `→` (Right Arrow)
- Press `B` key
- Press `A` key

**What happens:**
1. Rainbow gradient popup appears in center
2. Fireworks shoot from random positions for 5 seconds
3. Shows message: "Konami Code Activated!"
4. Purple/pink gradient effects
5. Auto-closes after 8 seconds (or click "Close" button)

**Troubleshooting:**
- Make sure you press keys one at a time (not holding)
- Must press in exact order
- If you make a mistake, start over from beginning
- Don't press any other keys in between
- Console.log will help debug - open DevTools (F12)

---

## Additional Animations to Test

### 3. Quiz Confetti 🎊

**Test:**
1. Navigate to "Indian Constitution" subject
2. Scroll to any quiz section
3. Answer all questions
4. Click "Submit"
5. **See confetti burst!** Color depends on score:
   - Green (150 particles) if score ≥ 80%
   - Blue (100 particles) if score ≥ 60%
   - Orange (50 particles) if score < 60%

### 4. Flashcard Confetti ⚡

**Test:**
1. Go to any subject with flashcards
2. Click on a flashcard to flip it
3. After reading, rate it as "⚡ Easy" (5 stars)
4. **See green confetti celebration!**

### 5. Achievement Unlock Modal 🏆

**Test:**
1. Study flashcards or complete quizzes
2. When you unlock an achievement:
   - Golden gradient modal scales in
   - Achievement icon bounces
   - Star/trophy confetti shoots
   - Sparkles pulse at corners
3. Click "Awesome!" to dismiss

### 6. TOC Hide/Show Animation

**Test:**
1. Navigate to any subject page
2. Look at the Table of Contents (desktop view)
3. Click the `✕` button at top-right of TOC
4. **TOC slides out, content expands to full width**
5. Click the floating "☰ TOC" button on left
6. **TOC slides back in smoothly**

---

## Debug Tips

### If animations don't work:

**1. Check CSS is loaded:**
```javascript
// Open browser console (F12) and run:
console.log(getComputedStyle(document.querySelector('.animate-slide-up')).animation)
```

**2. Force reload without cache:**
- Chrome/Edge: `Ctrl + Shift + R` or `Shift + F5`
- Firefox: `Ctrl + Shift + R`
- Safari: `Cmd + Option + R`

**3. Check dev server:**
```bash
# Stop server: Ctrl + C
# Restart:
npm run dev
```

**4. Clear all caches:**
- Chrome DevTools (F12) → Application → Clear storage → Clear site data
- Then hard refresh

**5. Verify files are saved:**
```bash
# In project directory, check last modified:
ls -l components/home/SubjectCard.tsx
ls -l styles/globals.css
ls -l components/ui/EasterEggs.tsx
```

### Still not working?

**Konami Code Debug:**
Add this to `components/ui/EasterEggs.tsx` temporarily to debug:

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  const key = e.key
  console.log('Key pressed:', key, 'Expected:', KONAMI_CODE[konamiIndex])
  
  // ... rest of code
}
```

This will show in console which keys you're pressing.

**Animation Debug:**
Add this to check if animations are being applied:

```typescript
// In browser console:
document.querySelectorAll('.animate-slide-up').forEach(el => {
  console.log('Element:', el, 'Animation:', getComputedStyle(el).animation)
})
```

---

## Visual Confirmation Checklist

- [ ] Homepage loads with cards sliding up sequentially
- [ ] Konami code (↑↑↓↓←→←→BA) shows rainbow popup + fireworks
- [ ] Quiz completion triggers confetti (color based on score)
- [ ] Flashcard "Easy" rating shows green confetti
- [ ] Achievement unlock shows golden modal with confetti
- [ ] TOC hide/show has smooth transition
- [ ] All modals scale in smoothly
- [ ] Subject cards have hover effect (tilt)
- [ ] Loading skeletons appear briefly during navigation
- [ ] No console errors in DevTools

---

## Performance Check

**Lighthouse Test:**
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Desktop" or "Mobile"
4. Click "Generate report"
5. **Performance should be 90+**
6. Animations shouldn't impact score negatively

**Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s ✅
- FID (First Input Delay): < 100ms ✅
- CLS (Cumulative Layout Shift): < 0.1 ✅

---

## Video Recording Tips

Want to record the animations for demonstration?

**Windows:**
- Use Windows Game Bar: `Win + G`
- Or OBS Studio (free)

**Mac:**
- QuickTime Screen Recording
- Or use `Cmd + Shift + 5` for built-in screen recorder

**Browser:**
- Chrome extension: "Loom" or "Screencastify"

---

## Expected Behavior Summary

| Feature | Animation | Duration | Trigger |
|---------|-----------|----------|---------|
| Homepage Cards | Slide up + fade | 0.5s each | Page load |
| Konami Code | Scale in + fireworks | 5s fireworks | Key sequence |
| Quiz Confetti | Particle burst | 2s | Submit quiz |
| Flashcard Confetti | Green burst | 2s | Rate "Easy" |
| Achievement Modal | Scale + confetti | 3s | Unlock |
| TOC Toggle | Slide + expand | 0.3s | Click button |
| Modals | Scale in | 0.3s | Open |

---

## Contact

If animations still don't work after following this guide:
1. Check browser console for errors
2. Ensure `npm run dev` is running
3. Try different browser (Chrome, Firefox, Edge)
4. Clear ALL browser data and try again

**Most common issue:** Browser cache. Always hard refresh! 🔄
