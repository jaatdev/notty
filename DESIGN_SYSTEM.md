# Notty Design System

## 🎨 Ultra-Modern Modular Design System

This design system provides a comprehensive set of reusable components, animations, and styling utilities that automatically apply beautiful, modern styling to all content types across all subjects.

---

## 📦 Core Components

### 1. **Modern Card** (`.modern-card`)
Base card component with shimmer effect on hover.

```html
<div class="modern-card">
  <!-- Your content -->
</div>
```

**Features:**
- Glassmorphism effect with backdrop blur
- Shimmer animation on hover
- Smooth transitions
- Responsive padding and borders

---

### 2. **Gradient Cards** (`.gradient-card-*`)
8 color variants for different subjects/contexts:

- `.gradient-card-indigo` - Deep blue (Default, Tech)
- `.gradient-card-purple` - Purple mystique (Philosophy, Theory)
- `.gradient-card-pink` - Vibrant pink (Creative, Arts)
- `.gradient-card-blue` - Ocean blue (Science, Geography)
- `.gradient-card-green` - Nature green (Biology, Environment)
- `.gradient-card-amber` - Warm amber (History, Culture)
- `.gradient-card-red` - Energetic red (Politics, Law)
- `.gradient-card-teal` - Cool teal (Economics, Math)
- `.gradient-card-emerald` - Emerald green (Success, Flashcards)

**Usage:**
```html
<div class="modern-card gradient-card-purple">
  <h2>Constitutional Theory</h2>
</div>
```

**Features:**
- Animated gradients (background-size: 200%)
- Subject-specific color palettes
- Hover animation (gradientShift)
- Auto-adapts border colors

---

### 3. **Hero Section** (`.hero-section`)
Full-width banner with animated overlay.

```html
<div class="hero-section">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1>Welcome to Preamble</h1>
    <p>Foundation of Indian Constitution</p>
  </div>
</div>
```

**Features:**
- Gradient background with animation
- Overlay with opacity
- Centered content container
- Responsive height (120px mobile, 200px desktop)

---

### 4. **Pill Badge** (`.pill-badge`)
Modern badge component for tags, stats, metadata.

```html
<span class="pill-badge">100 MCQs</span>
```

**Features:**
- Rounded full design
- Border with hover glow
- Scale animation on hover
- Small, compact size

---

## 🎬 Animation Classes

### Entrance Animations

| Class | Effect | Duration | Use Case |
|-------|--------|----------|----------|
| `.animate-fade-in-up` | Fade in + slide up | 0.6s | Default entrance |
| `.animate-slide-in-left` | Slide from left | 0.5s | Headers, titles |
| `.animate-slide-in-right` | Slide from right | 0.5s | Sidebar, metadata |
| `.animate-scale-in` | Scale from center | 0.4s | Cards, modals |

### Continuous Animations

| Class | Effect | Duration | Use Case |
|-------|--------|----------|----------|
| `.animate-float` | Gentle up/down | 3s | Icons, badges |
| `.animate-pulse` | Opacity pulse | 2s | Call-to-action |
| `.animate-bounce` | Bounce effect | 1s | Notifications |
| `.animate-glow` | Glow/unglow | 2s | Highlights, success |

### Utility Animations

| Class | Effect | Duration | Use Case |
|-------|--------|----------|----------|
| `.animate-spin` | 360° rotation | 1s | Loading spinners |
| `.animate-ripple` | Expanding ring | 1.5s | Click feedback |
| `.animate-gradient-shift` | Gradient movement | 3s | Hero backgrounds |

---

## ⏱️ Animation Delays

Use delay classes for staggered animations:

```html
<div class="animate-fade-in-up delay-100">First item</div>
<div class="animate-fade-in-up delay-200">Second item</div>
<div class="animate-fade-in-up delay-300">Third item</div>
```

**Available delays:**
- `.delay-100` - 100ms
- `.delay-200` - 200ms
- `.delay-300` - 300ms
- `.delay-400` - 400ms
- `.delay-500` - 500ms
- `.delay-600` - 600ms
- `.delay-700` - 700ms
- `.delay-800` - 800ms

**Pro tip:** Use programmatic delays via inline styles for dynamic lists:
```tsx
style={{ animationDelay: `${index * 100}ms` }}
```

---

## 🎯 Content-Type Patterns

### Markdown Notes

**Pattern 1: Hero + Cards**
```markdown
<div class="hero-section">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1>Topic Title</h1>
    <p class="pill-badge">Key Concept</p>
  </div>
</div>

<div class="modern-card gradient-card-indigo animate-fade-in-up">
  ## Section 1
  Content here...
</div>
```

**Pattern 2: Grid Layout**
```markdown
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div class="modern-card gradient-card-blue">Card 1</div>
  <div class="modern-card gradient-card-green">Card 2</div>
</div>
```

### Quiz Pages

```tsx
<div className="modern-card gradient-card-purple animate-scale-in">
  <h2 className="animate-slide-in-left">Question {current + 1}</h2>
  <div className="space-y-3 mt-4">
    {options.map((opt, i) => (
      <button 
        key={i}
        className="modern-card gradient-card-blue hover:scale-105 animate-fade-in-up"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        {opt}
      </button>
    ))}
  </div>
</div>
```

### Flashcards

```tsx
<div className="modern-card animate-fade-in-up">
  <div className="gradient-card-emerald p-4">
    <p className="font-bold">Front</p>
  </div>
</div>
```

---

## 🌈 Subject-Based Theming

### Auto-Apply Based on Subject

```tsx
// lib/subjects.config.ts
export const SUBJECTS = {
  polity: { brandColor: 'red', gradientVariant: 'red' },
  history: { brandColor: 'amber', gradientVariant: 'amber' },
  geography: { brandColor: 'blue', gradientVariant: 'blue' },
  economics: { brandColor: 'teal', gradientVariant: 'teal' },
  science: { brandColor: 'green', gradientVariant: 'green' },
}

// In component
const subject = SUBJECTS[slug]
const cardClass = `modern-card gradient-card-${subject.gradientVariant}`
```

---

## 🎲 Random Style Variation

For visual diversity, rotate through style presets:

```tsx
const stylePresets = [
  { name: 'heroic', hero: true, gradient: 'purple', animation: 'fade-in-up' },
  { name: 'minimal', hero: false, gradient: 'blue', animation: 'scale-in' },
  { name: 'vibrant', hero: true, gradient: 'pink', animation: 'slide-in-left' },
]

// Select randomly per page/topic
const preset = stylePresets[Math.floor(Math.random() * stylePresets.length)]
```

---

## 📱 Responsive Breakpoints

All components are mobile-first with responsive utilities:

| Breakpoint | Prefix | Min Width |
|------------|--------|-----------|
| Mobile | (default) | 0px |
| Small | `sm:` | 640px |
| Medium | `md:` | 768px |
| Large | `lg:` | 1024px |
| Extra Large | `xl:` | 1280px |

**Example:**
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <!-- 1 col mobile, 2 tablet, 3 desktop -->
</div>
```

---

## 🚀 Future-Proof Guidelines

### For New Topics/Notes:

1. **Use Hero Section** for important topics:
   ```markdown
   <div class="hero-section">...</div>
   ```

2. **Wrap sections in modern-card**:
   ```markdown
   <div class="modern-card gradient-card-purple">
     ## Section Title
   </div>
   ```

3. **Add staggered animations** to lists:
   ```tsx
   {items.map((item, i) => (
     <div 
       className="animate-fade-in-up" 
       style={{ animationDelay: `${i * 100}ms` }}
     >
       {item}
     </div>
   ))}
   ```

4. **Use pill-badge** for metadata:
   ```html
   <span class="pill-badge">Important</span>
   ```

### For New Components:

1. **Extend existing classes** instead of creating new ones
2. **Use gradient-card variants** for colored sections
3. **Apply entrance animations** for dynamic content
4. **Leverage delay classes** for staggered effects

---

## 🎨 Color Palette

### Primary Colors (Dark Theme)
- Background: `#0a0a0a` (gray-950)
- Card Background: `#1a1a1a` (gray-900)
- Text Primary: `#ffffff`
- Text Secondary: `#9ca3af` (gray-400)

### Accent Colors
- Emerald: `#10b981` (Success, Flashcards)
- Purple: `#8b5cf6` (Theory, Philosophy)
- Blue: `#3b82f6` (Science, Facts)
- Amber: `#f59e0b` (History, Culture)
- Red: `#ef4444` (Politics, Law)
- Teal: `#14b8a6` (Economics, Math)

---

## ✨ Best Practices

1. **Keep animations subtle** - Use 0.3s-0.6s durations
2. **Stagger delays** - Max 800ms for list items
3. **One hero per page** - Don't overuse hero sections
4. **Consistent gradients** - Match subject theme
5. **Responsive first** - Test on mobile
6. **Accessibility** - Maintain contrast ratios
7. **Performance** - Avoid excessive animations

---

## 🛠️ Implementation Examples

### Example 1: Modernize Existing Markdown

**Before:**
```markdown
## Constitutional Principles
The preamble contains...
```

**After:**
```markdown
<div class="modern-card gradient-card-red animate-fade-in-up">

## Constitutional Principles
The preamble contains...

</div>
```

### Example 2: Quiz Question Card

```tsx
<div className="modern-card gradient-card-purple animate-scale-in p-6">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-xl font-bold animate-slide-in-left">
      Question {currentIndex + 1}
    </h3>
    <span className="pill-badge">{currentIndex + 1}/{total}</span>
  </div>
  
  <p className="text-lg mb-6 animate-fade-in-up delay-100">
    {question.prompt}
  </p>
  
  <div className="space-y-3">
    {question.options.map((opt, i) => (
      <button
        key={i}
        className="modern-card gradient-card-blue hover:scale-105 transition-transform animate-fade-in-up"
        style={{ animationDelay: `${(i + 2) * 100}ms` }}
      >
        {opt}
      </button>
    ))}
  </div>
</div>
```

### Example 3: Flashcard Section

```tsx
<section className="modern-card gradient-card-emerald p-6">
  <h2 className="text-2xl font-bold mb-4 animate-slide-in-left">
    Flashcards
  </h2>
  
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {cards.map((card, i) => (
      <div
        key={i}
        className="modern-card animate-fade-in-up"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        {/* Card content */}
      </div>
    ))}
  </div>
</section>
```

---

## 📚 Component Library Reference

### Quick Class Reference

| Component | Classes |
|-----------|---------|
| **Card** | `modern-card` + `gradient-card-{color}` |
| **Hero** | `hero-section` > `hero-overlay` + `hero-content` |
| **Badge** | `pill-badge` |
| **Animation** | `animate-{type}` + optional `delay-{ms}` |

### Animation Combinations

```html
<!-- Fade in with delay -->
<div class="animate-fade-in-up delay-200">...</div>

<!-- Slide in from left -->
<div class="animate-slide-in-left">...</div>

<!-- Continuous float -->
<div class="animate-float">...</div>

<!-- Glow effect -->
<div class="animate-glow">...</div>
```

---

## 🎯 Next Steps

1. **Document subject mappings** - Create gradient variant for each subject
2. **Create style presets** - Define 5-10 visual themes
3. **Build auto-styler** - Utility to inject classes based on content type
4. **Random variation** - Implement rotation system
5. **Performance monitoring** - Ensure animations don't impact load time

---

**Last Updated:** $(new Date().toLocaleDateString())

**Version:** 1.0.0

**Maintained by:** Notty Design Team
