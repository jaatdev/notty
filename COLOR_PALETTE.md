# 🎨 Notty Color Palette - Quick Reference

## 🌈 **Primary Color System**

### Violet Family (Premium, Creative)
```
violet-400: #a78bfa
violet-500: #8b5cf6 ⭐ Primary
violet-600: #7c3aed
```

### Fuchsia Family (Energy, Modern)
```
fuchsia-400: #e879f9
fuchsia-500: #d946ef ⭐ Primary
fuchsia-600: #c026d3
```

### Pink Family (Excitement, Youth)
```
pink-400: #f472b6
pink-500: #ec4899 ⭐ Primary
pink-600: #db2777
rose-600: #e11d48
```

### Emerald Family (Success, Growth)
```
emerald-400: #34d399
emerald-500: #10b981 ⭐ Primary
emerald-600: #059669
```

### Teal Family (Fresh, Modern)
```
teal-400: #2dd4bf
teal-500: #14b8a6 ⭐ Primary
teal-600: #0d9488
```

### Cyan Family (Trust, Intelligence)
```
cyan-400: #22d3ee
cyan-500: #06b6d4 ⭐ Primary
cyan-600: #0891b2
```

### Blue Family (Professional, Calm)
```
blue-400: #60a5fa
blue-500: #3b82f6 ⭐ Primary
blue-600: #2563eb
```

### Indigo Family (Deep, Sophisticated)
```
indigo-400: #818cf8
indigo-500: #6366f1 ⭐ Primary
indigo-600: #4f46e5
```

### Purple Family (Royal, Premium)
```
purple-400: #c084fc
purple-500: #a855f7 ⭐ Primary
purple-600: #9333ea
```

### Amber Family (Warmth, Achievement)
```
amber-400: #fbbf24
amber-500: #f59e0b ⭐ Primary
amber-600: #d97706
```

### Orange Family (Energy, Motivation)
```
orange-400: #fb923c
orange-500: #f97316 ⭐ Primary
orange-600: #ea580c
```

### Yellow Family (Highlight, Attention)
```
yellow-200: #fef08a ⭐ Text gradient
yellow-300: #fde047 ⭐ Text gradient
yellow-400: #facc15 ⭐ Text gradient
```

## 🎨 **Gradient Combinations**

### Hero & CTA (Bold, Attention-grabbing)
```css
bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500
```
**Use for**: Hero sections, CTAs, important announcements

### Stats Card 1 (Premium)
```css
bg-gradient-to-br from-violet-500 to-purple-600
```
**Use for**: Subjects count, premium features

### Stats Card 2 (Success)
```css
bg-gradient-to-br from-emerald-500 to-teal-600
```
**Use for**: Topics count, achievements, success metrics

### Stats Card 3 (Warmth)
```css
bg-gradient-to-br from-amber-500 to-orange-600
```
**Use for**: Questions count, activity metrics

### Stats Card 4 (Energy)
```css
bg-gradient-to-br from-pink-500 to-rose-600
```
**Use for**: Notes count, engagement metrics

### Feature Card 1 (Intelligence)
```css
bg-gradient-to-br from-cyan-500 to-blue-600
```
**Use for**: Analytics, smart features

### Feature Card 2 (Professional)
```css
bg-gradient-to-br from-indigo-500 to-purple-600
```
**Use for**: Search, advanced features

### Text Highlight (Attention)
```css
bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400
```
**Use for**: Important text, headlines, CTAs

### Subjects Badge
```css
bg-gradient-to-r from-emerald-500 to-teal-500
```
**Use for**: Subject section badges

### Features Badge
```css
bg-gradient-to-r from-violet-500 to-fuchsia-500
```
**Use for**: Feature section badges

### Testimonials Badge
```css
bg-gradient-to-r from-amber-500 to-orange-500
```
**Use for**: Social proof badges

## 🎯 **Usage Guidelines**

### When to Use Each Color:

#### Violet/Purple/Fuchsia:
- ✅ Premium features
- ✅ Hero sections
- ✅ CTAs
- ✅ Branding
- ❌ Error messages
- ❌ Warning states

#### Emerald/Teal/Cyan:
- ✅ Success states
- ✅ Achievements
- ✅ Growth metrics
- ✅ Positive actions
- ❌ Errors
- ❌ Warnings

#### Amber/Orange:
- ✅ Warmth
- ✅ Activity
- ✅ Engagement
- ✅ Highlights
- ⚠️ Can be used for warnings

#### Pink/Rose:
- ✅ Energy
- ✅ Excitement
- ✅ Youth appeal
- ✅ Social features
- ❌ Professional contexts

#### Blue/Indigo:
- ✅ Trust
- ✅ Intelligence
- ✅ Professional
- ✅ Analytics
- ✅ Information

## 🌓 **Dark Mode Variants**

### Background Colors:
```
Light: white, gray-50
Dark: gray-900, gray-800
```

### Text Colors:
```
Light: gray-900, gray-600, gray-500
Dark: white, gray-300, gray-400
```

### Border Colors:
```
Light: gray-100, gray-200
Dark: gray-700, gray-800
```

## 🎨 **Glassmorphism**

### Light Backgrounds:
```css
bg-white/10 backdrop-blur-md border border-white/30
bg-white/20 backdrop-blur-sm border border-white/40
```

### Dark Backgrounds:
```css
bg-black/10 backdrop-blur-md border border-black/30
bg-black/20 backdrop-blur-sm border border-black/40
```

## 🌟 **Special Effects**

### Glow Effect:
```css
shadow-violet-500/50
shadow-emerald-500/50
shadow-amber-500/50
shadow-pink-500/50
```

### Hover Shadows:
```css
hover:shadow-2xl
hover:shadow-violet-500/50
hover:shadow-emerald-500/50
```

## 📊 **Color Psychology**

| Color | Emotion | Use Case |
|-------|---------|----------|
| Violet | Premium, Creative | Hero, Branding |
| Fuchsia | Modern, Bold | CTAs, Highlights |
| Pink | Energetic, Fun | Social, Engagement |
| Emerald | Success, Growth | Achievements, Positive |
| Teal | Fresh, Modern | Features, Innovation |
| Cyan | Trust, Calm | Analytics, Data |
| Blue | Professional | Information, Trust |
| Indigo | Deep, Wise | Advanced Features |
| Purple | Royal, Premium | Premium Content |
| Amber | Warm, Active | Activity, Warmth |
| Orange | Energetic | Motivation, Action |
| Yellow | Attention | Highlights, Important |

## 🎯 **Accessibility**

### Contrast Ratios:
- **AAA**: 7:1 (Best)
- **AA**: 4.5:1 (Good)
- **Minimum**: 3:1 (Acceptable)

### Safe Combinations:
```
✅ White text on violet-600
✅ White text on emerald-600
✅ White text on blue-600
✅ Gray-900 text on yellow-200
✅ Gray-900 text on white
```

### Avoid:
```
❌ Yellow text on white
❌ Light gray on white
❌ Violet-400 text on white
```

## 🔄 **Animation Colors**

### Gradient Animation:
```css
.gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

### Glow Animation:
```css
.glow-animation {
  animation: glow 2s ease-in-out infinite;
}
```

## 📱 **Mobile Considerations**

- Use slightly less saturated colors on mobile
- Ensure touch targets have clear color feedback
- Test gradients on various screen sizes
- Consider battery impact of animations

## 🎨 **Quick Copy-Paste**

### Hero Gradient:
```tsx
className="bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500"
```

### Card Gradient:
```tsx
className="bg-gradient-to-br from-emerald-500 to-teal-600"
```

### Text Gradient:
```tsx
className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent"
```

### Glassmorphism:
```tsx
className="bg-white/10 backdrop-blur-md border border-white/30"
```

### Hover Effect:
```tsx
className="hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/50 transition-all"
```

---

**Pro Tip**: Always test colors in both light and dark mode! 🌓

Made with 🎨 for Notty
