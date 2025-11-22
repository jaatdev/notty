# NoteBox System v2.0 - Complete Usage Guide

## 📋 Table of Contents
1. [Core Content Boxes](#core-content-boxes)
2. [Learning & Memory Boxes](#learning--memory-boxes)
3. [Interactive Boxes](#interactive-boxes)
4. [Visual & Media Boxes](#visual--media-boxes)
5. [Specialized Boxes](#specialized-boxes)
6. [Alert & Highlight Boxes](#alert--highlight-boxes)

---

## Core Content Boxes

### 1. **big-notes** - Main Content Authority Card
**Use When:** Primary content, detailed explanations, chapter introductions
**Don't Use When:** Short facts, lists, or quick references

```json
{
  "id": "bn-example",
  "type": "big-notes",
  "title": "Introduction to Democracy",
  "content": {
    "heading": "What is Democracy?",
    "body": "Democracy is a system of government where <strong>power rests with the people</strong>.",
    "highlights": [
      "Free and fair elections",
      "Rule of law",
      "Protection of rights"
    ]
  },
  "themeId": "emerald"
}
```

**Test Cases:**
- ✅ Long paragraphs with HTML formatting
- ✅ Multiple highlights (3-8 items)
- ✅ Heading different from title
- ❌ Don't use for single-line facts
- ❌ Avoid more than 10 highlights

---

### 2. **small-notes** - Quick Points Grid
**Use When:** Lists, bullet points, quick facts, numbered steps
**Don't Use When:** Long paragraphs or detailed explanations

```json
{
  "id": "sn-example",
  "type": "small-notes",
  "title": "Key Features of Constitution",
  "content": {
    "title": "5 Main Features",
    "points": [
      "Written Constitution",
      "Federal Structure",
      "Parliamentary System",
      "Fundamental Rights",
      "Independent Judiciary"
    ]
  },
  "themeId": "slate-2"
}
```

**Test Cases:**
- ✅ 3-10 points work best
- ✅ Each point can have HTML
- ✅ Short, crisp statements
- ❌ Don't use for paragraphs
- ❌ Avoid more than 15 points

---

### 3. **definition-box** - Term Definitions
**Use When:** Defining technical terms, concepts, vocabulary
**Don't Use When:** General explanations or stories

```json
{
  "id": "def-example",
  "type": "definition-box",
  "title": "What is Sovereignty?",
  "content": {
    "term": "Sovereignty",
    "definition": "Supreme power or authority of a state to govern itself",
    "etymology": "From Latin 'superanus' meaning 'supreme'",
    "examples": [
      "India is a sovereign nation",
      "No external power can dictate Indian laws"
    ]
  },
  "themeId": "sapphire"
}
```

**Test Cases:**
- ✅ Always include term + definition
- ✅ Etymology is optional but valuable
- ✅ 2-5 examples recommended
- ❌ Don't skip definition field
- ❌ Avoid vague examples

---

### 4. **summary-box** - Key Takeaways
**Use When:** End of section summaries, recap, main points
**Don't Use When:** Introducing new concepts

```json
{
  "id": "sum-example",
  "type": "summary-box",
  "title": "Chapter Summary",
  "content": {
    "points": [
      "DPSP are non-justiciable",
      "Found in Part IV (Articles 36-51)",
      "Guide state policy making"
    ],
    "keyTakeaway": "DPSP provide <strong>moral foundation</strong> for governance"
  },
  "themeId": "emerald"
}
```

**Test Cases:**
- ✅ 3-7 summary points
- ✅ Always include keyTakeaway
- ✅ Use at section/chapter end
- ❌ Don't introduce new info
- ❌ Avoid more than 10 points

---

## Learning & Memory Boxes

### 5. **mnemonic-magic** - Memory Techniques
**Use When:** Complex acronyms, memory tricks, pattern learning
**Don't Use When:** Simple facts that don't need mnemonics

```json
{
  "id": "mn-example",
  "type": "mnemonic-magic",
  "title": "SSCDR Mnemonic",
  "content": {
    "title": "Nature of Indian State",
    "mnemonic": "SSCDR",
    "breakdown": [
      {
        "letter": "S",
        "word": "Sovereign",
        "meaning": "Supreme power, no external control"
      },
      {
        "letter": "S",
        "word": "Socialist",
        "meaning": "Economic equality for all"
      },
      {
        "letter": "C",
        "word": "Secular",
        "meaning": "No state religion"
      },
      {
        "letter": "D",
        "word": "Democratic",
        "meaning": "Rule by the people"
      },
      {
        "letter": "R",
        "word": "Republic",
        "meaning": "Elected head of state"
      }
    ]
  },
  "themeId": "pink-3"
}
```

**Test Cases:**
- ✅ 3-8 breakdown items ideal
- ✅ Each letter should be meaningful
- ✅ Meaning can have HTML
- ❌ Don't use for non-acronyms
- ❌ Avoid more than 10 items

---

### 6. **acronym-box** - Master Acronym Formula
**Use When:** Complex multi-level acronyms, master memory tricks
**Don't Use When:** Simple single-level mnemonics

```json
{
  "id": "acr-example",
  "type": "acronym-box",
  "title": "The TONIC Formula",
  "content": {
    "acronym": "USA ka MAGNA CARTA TONIC",
    "fullForm": "Complete Story of Fundamental Rights",
    "breakdown": [
      {
        "letter": "USA",
        "word": "Source",
        "meaning": "From <strong>United States Bill of Rights (1791)</strong>"
      },
      {
        "letter": "MAGNA CARTA",
        "word": "Title",
        "meaning": "Called <strong>Magna Carta of India</strong>"
      },
      {
        "letter": "TONIC",
        "word": "Strength",
        "meaning": "FRs strengthen democracy like tonic"
      }
    ]
  },
  "themeId": "indigo"
}
```

**Test Cases:**
- ✅ 3-6 breakdown items
- ✅ Long letter text (like "MAGNA CARTA") wraps properly
- ✅ Rich HTML in meaning
- ❌ Don't use for simple acronyms
- ❌ Avoid more than 8 items

---

### 7. **flashcard** - Q&A Cards (Flippable)
**Use When:** Practice questions, self-testing, revision
**Don't Use When:** Presenting new information

```json
{
  "id": "fc-example",
  "type": "flashcard",
  "title": "Practice Questions",
  "content": {
    "cards": [
      {
        "id": "fc1",
        "front": "What is Article 32?",
        "back": "<strong>Right to Constitutional Remedies</strong><br/>Called 'Heart and Soul' by Dr. Ambedkar"
      },
      {
        "id": "fc2",
        "front": "Which articles can never be suspended?",
        "back": "Article 20 & 21"
      }
    ]
  },
  "themeId": "violet"
}
```

**Test Cases:**
- ✅ 5-20 cards per box
- ✅ Click to flip functionality
- ✅ HTML in front and back
- ✅ Supports both front/back and question/answer
- ❌ Don't use for non-question content
- ❌ Avoid more than 30 cards

---

### 8. **mnemonic-card** - Exam Flashcards
**Use When:** Exam preparation, rapid revision, MCQ practice
**Don't Use When:** Teaching new concepts

```json
{
  "id": "mc-example",
  "type": "mnemonic-card",
  "title": "15 Quick Revision Cards",
  "content": {
    "flashcards": [
      {
        "id": "v1",
        "front": "Where are FRs located?",
        "back": "Part III, Articles 12-35"
      }
    ]
  },
  "themeId": "mint"
}
```

**Test Cases:**
- ✅ 10-30 cards ideal
- ✅ Click to flip
- ✅ Grid layout (2 columns)
- ❌ Don't mix with teaching content
- ❌ Avoid more than 50 cards

---

### 9. **right-wrong** - True/False Statements
**Use When:** Common misconceptions, fact checking, myth busting
**Don't Use When:** Teaching new concepts

```json
{
  "id": "rw-example",
  "type": "right-wrong",
  "title": "Test Your Understanding",
  "content": {
    "statements": [
      {
        "id": "s1",
        "statement": "FRs are absolute rights",
        "isCorrect": false,
        "explanation": "❌ False. FRs have <strong>reasonable restrictions</strong>"
      },
      {
        "id": "s2",
        "statement": "Article 32 is called Heart and Soul",
        "isCorrect": true,
        "explanation": "✅ True. Dr. Ambedkar gave this title"
      }
    ]
  },
  "themeId": "ruby"
}
```

**Test Cases:**
- ✅ 4-10 statements
- ✅ Mix true and false
- ✅ Always provide explanation
- ❌ Don't use all true or all false
- ❌ Avoid more than 15 statements

---

## Interactive Boxes

### 10. **quick-reference** - Fact Cards
**Use When:** Quick facts, dates, key info, cheat sheets
**Don't Use When:** Detailed explanations needed

```json
{
  "id": "qr-example",
  "type": "quick-reference",
  "title": "Quick Facts",
  "content": {
    "title": "Constitution at a Glance",
    "facts": [
      {
        "id": "qf1",
        "label": "Adopted",
        "value": "26 November 1949"
      },
      {
        "id": "qf2",
        "label": "Came into Force",
        "value": "26 January 1950"
      }
    ]
  },
  "themeId": "sky"
}
```

**Test Cases:**
- ✅ 5-15 facts
- ✅ Label + value pairs
- ✅ Timeline grid layout
- ❌ Don't use for paragraphs
- ❌ Avoid more than 20 facts

---

### 11. **comparison-box** - Side-by-Side Compare
**Use When:** Comparing 2-4 items, pros/cons, differences
**Don't Use When:** More than 4 items to compare

```json
{
  "id": "cmp-example",
  "type": "comparison-box",
  "title": "FR vs DPSP",
  "content": {
    "items": [
      {
        "name": "Fundamental Rights",
        "features": [
          "Justiciable",
          "Part III",
          "Negative duties"
        ]
      },
      {
        "name": "DPSP",
        "features": [
          "Non-justiciable",
          "Part IV",
          "Positive duties"
        ]
      }
    ],
    "conclusion": "Both are <strong>complementary</strong>"
  },
  "themeId": "slate"
}
```

**Test Cases:**
- ✅ 2-4 items to compare
- ✅ Same number of features for each
- ✅ Optional conclusion
- ❌ Don't compare more than 4 items
- ❌ Avoid unequal feature counts

---

## Visual & Media Boxes

### 12. **story-box** - Narrative Content
**Use When:** Historical stories, case studies, narratives
**Don't Use When:** Dry facts or technical content

```json
{
  "id": "story-example",
  "type": "story-box",
  "title": "The Journey from USA to India",
  "content": {
    "story": "<p>When Dr. Ambedkar studied world constitutions...</p>",
    "moral": "Good ideas can cross borders",
    "image": "https://example.com/image.jpg"
  },
  "themeId": "coral"
}
```

**Test Cases:**
- ✅ Rich HTML in story
- ✅ Optional image (max 384px height)
- ✅ Always include moral/lesson
- ❌ Don't use for technical definitions
- ❌ Avoid stories without takeaway

---

### 13. **timeline-box** - Chronological Events
**Use When:** Historical events, chronology, evolution
**Don't Use When:** Non-sequential information

```json
{
  "id": "tl-example",
  "type": "timeline-box",
  "title": "Evolution of Rights",
  "content": {
    "events": [
      {
        "date": "1215",
        "event": "Magna Carta",
        "description": "King John signs Magna Carta",
        "image": "https://example.com/magna.jpg"
      },
      {
        "date": "1791",
        "event": "US Bill of Rights",
        "description": "10 amendments added"
      }
    ]
  },
  "themeId": "bronze"
}
```

**Test Cases:**
- ✅ 3-10 events
- ✅ Chronological order
- ✅ Optional images (max 256px)
- ❌ Don't use for non-chronological
- ❌ Avoid more than 15 events

---

### 14. **diagram-box** - Visual Diagrams
**Use When:** Flowcharts, diagrams, visual explanations
**Don't Use When:** Text-only content

```json
{
  "id": "diag-example",
  "type": "diagram-box",
  "title": "PMS Triangle",
  "content": {
    "imageUrl": "https://example.com/pms.png",
    "annotations": [
      {
        "label": "P - Physical",
        "description": "Article 21 - Right to Life"
      },
      {
        "label": "M - Mental",
        "description": "Article 19 - Freedom of Speech"
      }
    ]
  },
  "themeId": "violet"
}
```

**Test Cases:**
- ✅ Always include imageUrl
- ✅ 2-8 annotations
- ✅ HTML in descriptions
- ❌ Don't use without image
- ❌ Avoid more than 10 annotations

---

### 15. **gallery-box** - Image Gallery
**Use When:** Multiple related images, photo collections
**Don't Use When:** Single image or no images

```json
{
  "id": "gal-example",
  "type": "gallery-box",
  "title": "Historical Documents",
  "content": {
    "images": [
      {
        "url": "https://example.com/doc1.jpg",
        "caption": "Original Constitution",
        "description": "Handwritten by Prem Behari Narain Raizada"
      }
    ]
  },
  "themeId": "amber"
}
```

**Test Cases:**
- ✅ 2-8 images
- ✅ Each image max 384px height
- ✅ Caption required, description optional
- ❌ Don't use for single image
- ❌ Avoid more than 12 images

---

### 16. **analogy-box** - Concept Analogies
**Use When:** Explaining complex concepts with analogies
**Don't Use When:** Direct explanations suffice

```json
{
  "id": "ana-example",
  "type": "analogy-box",
  "title": "Why Articles 12-35?",
  "content": {
    "concept": "Why are FRs in Articles 12-35?",
    "analogy": "Ages 12-35 are <strong>golden years</strong> of human life",
    "explanation": "Just like ages 12-35 are crucial for development, Articles 12-35 are foundation of democracy",
    "image": "https://example.com/analogy.png"
  },
  "themeId": "lime"
}
```

**Test Cases:**
- ✅ All three fields required
- ✅ Optional image (max 384px)
- ✅ HTML in all text fields
- ❌ Don't skip explanation
- ❌ Avoid weak analogies

---

## Specialized Boxes

### 17. **formula-box** - Mathematical Formulas
**Use When:** Equations, formulas, calculations
**Don't Use When:** Non-mathematical content

```json
{
  "id": "form-example",
  "type": "formula-box",
  "title": "Population Density",
  "content": {
    "name": "Density Formula",
    "formula": "Density = Population / Area",
    "variables": [
      {
        "symbol": "Population",
        "meaning": "Total number of people"
      },
      {
        "symbol": "Area",
        "meaning": "Land area in sq km"
      }
    ],
    "example": "India: 1.4 billion / 3.287 million km² = 425 per km²"
  },
  "themeId": "indigo"
}
```

**Test Cases:**
- ✅ Formula required
- ✅ 2-6 variables
- ✅ Optional example
- ❌ Don't use for non-formulas
- ❌ Avoid more than 8 variables

---

## Alert & Highlight Boxes

### 18. **warning-box** - Critical Warnings
**Use When:** Common mistakes, critical errors, warnings
**Don't Use When:** General information

```json
{
  "id": "warn-example",
  "type": "warning-box",
  "title": "Common Mistake",
  "content": {
    "message": "FRs are NOT absolute! They have <strong>reasonable restrictions</strong>",
    "severity": "high",
    "icon": "⚠️"
  },
  "themeId": "amber"
}
```

**Test Cases:**
- ✅ severity: critical/high/medium/low
- ✅ Custom icon optional
- ✅ HTML in message
- ❌ Don't overuse warnings
- ❌ Avoid for general info

---

### 19. **tip-box** - Pro Tips
**Use When:** Study tips, memory tricks, helpful hints
**Don't Use When:** Core content

```json
{
  "id": "tip-example",
  "type": "tip-box",
  "title": "Memory Trick",
  "content": {
    "tip": "Think of FRs as your <strong>direct ticket to Supreme Court</strong>",
    "category": "Memory Aid",
    "icon": "💡"
  },
  "themeId": "gold"
}
```

**Test Cases:**
- ✅ Short, actionable tips
- ✅ Optional category
- ✅ HTML in tip
- ❌ Don't use for main content
- ❌ Avoid long paragraphs

---

### 20. **quote-box** - Famous Quotes
**Use When:** Historical quotes, famous sayings
**Don't Use When:** Regular text

```json
{
  "id": "quote-example",
  "type": "quote-box",
  "title": "Dr. Ambedkar's Words",
  "content": {
    "quote": "Article 32 is the heart and soul of the Constitution",
    "author": "Dr. B.R. Ambedkar",
    "context": "During Constituent Assembly debates",
    "image": "https://example.com/ambedkar.jpg"
  },
  "themeId": "purple"
}
```

**Test Cases:**
- ✅ Quote and author required
- ✅ Optional context and image
- ✅ Image max 384px height
- ❌ Don't use for paraphrasing
- ❌ Avoid without attribution

---

## 🎯 Best Practices

### DO's ✅
1. **Use appropriate box types** - Match content to box type
2. **Keep it concise** - Respect item limits
3. **Use HTML formatting** - Bold, italics, lists
4. **Add visual variety** - Mix different box types
5. **Test responsiveness** - Check on mobile
6. **Use themes consistently** - Stick to color scheme
7. **Break long content** - Split into multiple boxes
8. **Add images wisely** - They auto-resize to max 384px

### DON'Ts ❌
1. **Don't exceed limits** - Respect max items per box
2. **Don't mix purposes** - One box = one purpose
3. **Don't skip required fields** - All required fields must be filled
4. **Don't use wrong box type** - Match content to type
5. **Don't overuse warnings** - Use sparingly
6. **Don't forget HTML sanitization** - All HTML is sanitized automatically
7. **Don't use huge images** - They're auto-constrained
8. **Don't nest boxes** - Keep structure flat

---

## 📊 Quick Selection Guide

| Content Type | Best Box Type | Alternative |
|--------------|---------------|-------------|
| Main content | big-notes | container-notes |
| Quick facts | small-notes | quick-reference |
| Definitions | definition-box | big-notes |
| Summaries | summary-box | small-notes |
| Memory tricks | mnemonic-magic | acronym-box |
| Practice Q&A | flashcard | mnemonic-card |
| True/False | right-wrong | flashcard |
| Comparisons | comparison-box | small-notes |
| Stories | story-box | big-notes |
| Timeline | timeline-box | small-notes |
| Diagrams | diagram-box | gallery-box |
| Images | gallery-box | diagram-box |
| Analogies | analogy-box | story-box |
| Formulas | formula-box | big-notes |
| Warnings | warning-box | tip-box |
| Tips | tip-box | small-notes |
| Quotes | quote-box | big-notes |

---

## 🧪 Complete Test Case Checklist

### For Each Box Type:
- [ ] Minimum items work
- [ ] Maximum items work
- [ ] HTML renders correctly
- [ ] Images resize properly
- [ ] Text wraps in fixed boxes
- [ ] Mobile responsive
- [ ] Theme colors apply
- [ ] Animations work
- [ ] Required fields present
- [ ] Optional fields work

### Edge Cases:
- [ ] Very long words (like "MAGNA CARTA")
- [ ] Special characters (&lt;, &gt;, &amp;)
- [ ] Empty optional fields
- [ ] Maximum character limits
- [ ] Multiple boxes on same page
- [ ] Mixed box types
- [ ] All 25 themes
- [ ] Dark mode visibility

---

**Version:** 2.0  
**Last Updated:** 2025  
**Total Box Types:** 33  
**Total Themes:** 25
