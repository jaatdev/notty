# 📦 NoteBox Quick Reference Guide

## 🎯 Box Type Selector

| Need to... | Use Box Type | Theme Suggestion |
|------------|--------------|------------------|
| Explain main concept | `big-notes` | emerald, sapphire |
| List quick facts | `small-notes` | cyan, mint |
| Show right/wrong | `right-wrong` | ruby, emerald |
| Create memory aid | `mnemonic-magic` | violet, gold |
| Make flashcards | `flashcard` | indigo, teal |
| Tell a story | `story-box` | peach, coral |
| Define terms | `definition-box` | sapphire, slate |
| Show examples | `example-box` | lime, mint |
| Summarize section | `summary-box` | gold, amber |
| Explain acronym | `acronym-box` | violet, indigo |
| Use analogy | `analogy-box` | rose, coral |
| Show pattern | `pattern-box` | cyan, ocean |
| Memory technique | `memory-palace` | lavender, violet |
| Create quiz | `quiz-box` | indigo, sapphire |
| Real scenario | `case-study` | bronze, slate |
| Solve problem | `problem-solution` | emerald, forest |
| Practice exercises | `practice-box` | lime, teal |
| Challenge students | `challenge-box` | crimson, ruby |
| Quick facts | `quick-reference` | cyan, silver |
| Math formulas | `formula-box` | midnight, slate |
| Show timeline | `timeline-box` | ocean, bronze |
| Compare items | `comparison-box` | teal, slate |
| Task checklist | `checklist-box` | emerald, lime |
| Show diagram | `diagram-box` | sapphire, ocean |
| Process flow | `flowchart-box` | indigo, cyan |
| Visual data | `infographic-box` | gradient-mix, coral |
| Image gallery | `gallery-box` | gradient-mix, peach |
| Important warning | `warning-box` | ruby, crimson |
| Pro tip | `tip-box` | gold, amber |
| Inspirational quote | `quote-box` | lavender, rose |

## 🎨 Theme Colors Quick View

```
emerald  🟢  sapphire 🔵  ruby     🔴  amber    🟠  violet   🟣
rose     🌸  cyan     🔷  indigo   💙  lime     🟢  teal     🔹
crimson  🔴  gold     🟡  silver   ⚪  bronze   🟤  ocean    🌊
forest   🌲  sunset   🌅  dawn     🌄  midnight 🌙  lavender 💜
coral    🪸  mint     🌿  peach    🍑  slate    ⬜  gradient 🌈
```

## 📝 JSON Template Examples

### Basic Box
```json
{
  "id": "unique-id",
  "type": "big-notes",
  "title": "Your Title",
  "content": {
    "heading": "Main Heading",
    "body": "<p>Content here</p>"
  },
  "themeId": "emerald"
}
```

### Box with Image
```json
{
  "id": "img-box",
  "type": "story-box",
  "title": "Story Title",
  "content": {
    "story": "Once upon a time...",
    "image": "https://example.com/image.jpg"
  },
  "themeId": "coral"
}
```

### Gallery Box
```json
{
  "id": "gallery-1",
  "type": "gallery-box",
  "title": "Image Gallery",
  "content": {
    "images": [
      {"url": "img1.jpg", "caption": "First"},
      {"url": "img2.jpg", "caption": "Second"}
    ]
  },
  "themeId": "gradient-mix"
}
```

### Warning Box
```json
{
  "id": "warn-1",
  "type": "warning-box",
  "title": "Important!",
  "content": {
    "message": "This is critical information",
    "severity": "high"
  },
  "themeId": "ruby"
}
```

### Quiz Box
```json
{
  "id": "quiz-1",
  "type": "quiz-box",
  "title": "Test Your Knowledge",
  "content": {
    "questions": [
      {
        "id": "q1",
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctIndex": 1,
        "explanation": "2+2 equals 4"
      }
    ]
  },
  "themeId": "indigo"
}
```

### Timeline Box
```json
{
  "id": "timeline-1",
  "type": "timeline-box",
  "title": "Historical Events",
  "content": {
    "events": [
      {
        "date": "1947",
        "event": "Independence",
        "description": "India gained independence"
      }
    ]
  },
  "themeId": "bronze"
}
```

## 🎯 Best Practices Checklist

- [ ] Choose appropriate box type for content
- [ ] Select theme that matches content mood
- [ ] Optimize images (compress, use CDN)
- [ ] Add alt text for accessibility
- [ ] Test in dark mode
- [ ] Keep content concise
- [ ] Use consistent themes for related content
- [ ] Limit boxes per page to 20-30
- [ ] Test on mobile devices

## 🚀 Quick Start Steps

1. **Choose Box Type** - Pick from 33 types
2. **Select Theme** - Choose from 25 colors
3. **Structure Content** - Follow type's schema
4. **Add Images** - Optional, with captions
5. **Test Display** - Check light/dark mode
6. **Deploy** - Add to your notes

## 🔧 Common Patterns

### Pattern 1: Concept Introduction
```
1. big-notes (emerald) - Main concept
2. definition-box (sapphire) - Key terms
3. example-box (lime) - Practical examples
4. summary-box (gold) - Key takeaways
```

### Pattern 2: Learning Flow
```
1. story-box (coral) - Engaging intro
2. mnemonic-magic (violet) - Memory aid
3. flashcard (indigo) - Practice
4. quiz-box (sapphire) - Assessment
```

### Pattern 3: Reference Section
```
1. quick-reference (cyan) - Fast facts
2. formula-box (slate) - Formulas
3. timeline-box (bronze) - History
4. comparison-box (teal) - Contrasts
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Box not showing | Check type spelling |
| Theme not applying | Verify themeId exists |
| Image not loading | Check URL, CORS |
| Dark mode wrong | Clear cache |
| Border not visible | Check theme CSS |

## 📊 Performance Tips

- Lazy load images in gallery boxes
- Use thumbnails for large images
- Limit boxes per page
- Cache rendered content
- Optimize JSON size

## 🎨 Theme Combinations

**Professional:** slate, silver, midnight  
**Energetic:** lime, coral, sunset  
**Calm:** lavender, mint, cyan  
**Important:** ruby, crimson, amber  
**Creative:** violet, rose, gradient-mix  
**Natural:** emerald, forest, teal  
**Premium:** gold, bronze, indigo

## 📱 Mobile Considerations

- Images auto-resize
- Galleries stack vertically
- Touch-friendly spacing
- Readable font sizes
- Proper contrast ratios

## ♿ Accessibility

- All themes WCAG AA compliant
- Keyboard navigation supported
- Screen reader friendly
- High contrast in dark mode
- Alt text for all images

---

**Quick Help:** See `NOTEBOX_SYSTEM.md` for full documentation
