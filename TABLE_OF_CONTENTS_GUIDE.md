# 📑 Advanced Table of Contents System

> Auto-generating, collapsible, URL-aware navigation for all notes pages

## ✨ Features

### 🎯 Core Features
- **Auto-Generation** - Automatically extracts TOC from content nodes
- **Collapsible Sidebar** - Toggle button to show/hide (similar to quiz panel)
- **URL Hash Navigation** - Deep linking with smooth scroll
- **Active Section Tracking** - Highlights current section as you scroll
- **Progress Indicator** - Shows reading progress percentage
- **Hierarchical Structure** - Supports nested sections with expand/collapse
- **Mobile Responsive** - Full-screen drawer on mobile with backdrop

### 🎨 Advanced Features
- **Smooth Animations** - Framer Motion for all transitions
- **Theme Integration** - Uses subject-specific colors and gradients
- **Keyboard Navigation** - Accessible and keyboard-friendly
- **Intersection Observer** - Efficient scroll tracking
- **Custom Scrollbar** - Themed scrollbar matching accent colors
- **Icon System** - Different icons for different content types
- **Empty State Handling** - Gracefully handles pages without TOC items

## 🚀 Usage

### Automatic Integration

The TOC is automatically added to all topic and subtopic pages through the `TopicContent` component:

```tsx
// Already integrated in:
// - /subjects/[slug]/[topicId]/page.tsx
// - /subjects/[slug]/[topicId]/[...path]/page.tsx

import TableOfContents from '@/components/ui/TableOfContents'

<TableOfContents content={content} theme={theme} />
```

### Manual Integration

For custom pages:

```tsx
import TableOfContents from '@/components/ui/TableOfContents'
import { getThemeById } from '@/lib/theme-variants'

function MyPage({ content, topicId }) {
  const theme = getThemeById(topicId)
  
  return (
    <>
      <TableOfContents content={content} theme={theme} />
      
      {/* Your content with id and data-toc-section attributes */}
      {content.map(node => (
        <div key={node.id} id={node.id} data-toc-section>
          {/* Node content */}
        </div>
      ))}
    </>
  )
}
```

## 📐 Component Structure

### TableOfContents Component

```tsx
interface TableOfContentsProps {
  content: ContentNode[]  // Array of content nodes
  theme?: {
    accent: string        // Primary color
    gradient: string      // CSS gradient
    glow: string         // Glow color for shadows
  }
  className?: string     // Additional CSS classes
}
```

### TOC Item Structure

```tsx
interface TocItem {
  id: string           // Unique identifier (used for navigation)
  title: string        // Display title
  level: number        // Nesting level (1, 2, 3...)
  type: string         // Content type (section, markdown, quiz, etc.)
  children?: TocItem[] // Nested items
}
```

## 🎨 Styling & Theming

### Theme Integration

The TOC automatically uses the subject's theme colors:

```tsx
const theme = getThemeById(topicId)

// Theme properties used:
// - theme.accent: Primary color for active states
// - theme.gradient: Gradient for active item background
// - theme.glow: Shadow color for depth effects
```

### Custom Styling

Add custom classes via the `className` prop:

```tsx
<TableOfContents 
  content={content} 
  theme={theme}
  className="custom-toc-class"
/>
```

### Responsive Behavior

- **Desktop (≥1024px)**: Fixed sidebar on left, always visible by default
- **Tablet (768px-1023px)**: Fixed sidebar, toggleable
- **Mobile (<768px)**: Full-screen drawer with backdrop, closed by default

## 🔧 Technical Details

### Auto-Generation Algorithm

The TOC is generated from content nodes using a recursive algorithm:

```tsx
function generateTocItems(content: ContentNode[], level = 1): TocItem[] {
  // 1. Iterate through content nodes
  // 2. Extract title from node.title or node content
  // 3. Create TOC item with id, title, level, type
  // 4. Recursively process children for sections
  // 5. Return flattened array of TOC items
}
```

### Active Section Tracking

Uses Intersection Observer API for efficient scroll tracking:

```tsx
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id)
      }
    })
  },
  {
    rootMargin: '-20% 0px -35% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  }
)
```

### URL Hash Navigation

Smooth scroll with URL update:

```tsx
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100 // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })

    // Update URL without jumping
    history.pushState(null, '', `#${id}`)
  }
}
```

## 📊 Progress Calculation

The progress bar shows reading progress based on active section:

```tsx
function calculateProgress(items: TocItem[], activeId: string | null): number {
  const flatItems = flattenTocItems(items)
  const activeIndex = flatItems.findIndex(item => item.id === activeId)
  
  if (activeIndex === -1) return 0
  
  return Math.round(((activeIndex + 1) / flatItems.length) * 100)
}
```

## 🎯 Content Requirements

For TOC to work properly, content nodes must have:

1. **Unique ID**: Each node needs a unique `id` property
2. **Title**: Either `node.title` or extractable from content
3. **Data Attribute**: Wrap rendered content with `data-toc-section`

### Example Content Structure

```tsx
const content = [
  {
    id: 'intro',
    kind: 'section',
    title: 'Introduction',
    children: [
      {
        id: 'overview',
        kind: 'markdown',
        title: 'Overview',
        content: '# Overview\n\nContent here...'
      }
    ]
  },
  {
    id: 'main-content',
    kind: 'section',
    title: 'Main Content',
    children: [...]
  }
]
```

### Rendering with TOC Support

```tsx
{content.map((node) => (
  <div key={node.id} id={node.id} data-toc-section>
    <NodeRenderer node={node} />
  </div>
))}
```

## 🎨 Icon System

Different content types get different icons:

| Type | Icon | Description |
|------|------|-------------|
| `section` | 📄 | Regular section |
| `markdown` | 📝 | Markdown content |
| `quiz` | ❓ | Quiz section |
| `flashcards` | 🎴 | Flashcard deck |
| `notes` | 📋 | Notes section |
| `notebox` | 📦 | NoteBox component |
| `default` | • | Fallback icon |

## 🔄 State Management

### Component State

```tsx
const [isOpen, setIsOpen] = useState(true)           // Sidebar visibility
const [activeId, setActiveId] = useState<string>()   // Current section
const [tocItems, setTocItems] = useState<TocItem[]>([]) // TOC structure
const [isMobile, setIsMobile] = useState(false)      // Mobile detection
```

### Persistence

- Sidebar state is NOT persisted (resets on page load)
- Active section is tracked from URL hash on load
- Mobile state auto-closes sidebar by default

## 🎭 Animations

### Sidebar Animations

```tsx
// Slide in/out
initial={{ x: -300, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
exit={{ x: -300, opacity: 0 }}
transition={{ type: 'spring', stiffness: 300, damping: 30 }}
```

### Item Animations

```tsx
// Stagger effect
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: index * 0.03 }}
```

### Active Indicator

```tsx
// Smooth transition between items
<motion.div
  layoutId="active-indicator"
  className="w-2 h-2 rounded-full bg-white"
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
/>
```

## 📱 Mobile Experience

### Features
- Full-screen drawer overlay
- Backdrop with blur effect
- Auto-close after navigation
- Touch-friendly tap targets
- Swipe-friendly animations

### Implementation

```tsx
{isMobile && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setIsOpen(false)}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
  />
)}
```

## 🎯 Accessibility

### Keyboard Navigation
- **Tab**: Navigate through TOC items
- **Enter/Space**: Activate selected item
- **Escape**: Close sidebar (mobile)

### Screen Readers
- Semantic HTML structure
- ARIA labels where needed
- Focus management
- Descriptive link text

### Visual Accessibility
- High contrast ratios
- Clear focus indicators
- Sufficient tap target sizes (44x44px minimum)
- Readable font sizes

## 🔍 SEO Benefits

### URL Hash Navigation
- Deep linkable sections
- Shareable section URLs
- Browser history integration
- Back button support

### Example URLs
```
/subjects/history/preamble#introduction
/subjects/history/preamble#main-features
/subjects/history/preamble#amendments
```

## 🚀 Performance

### Optimizations
- **Intersection Observer**: Efficient scroll tracking
- **Memoization**: Prevents unnecessary re-renders
- **Lazy Rendering**: Only visible items are fully rendered
- **Debounced Scroll**: Reduces scroll event overhead
- **Virtual Scrolling**: For very long TOCs (future enhancement)

### Bundle Size
- Component: ~8KB (minified)
- Dependencies: Framer Motion (already in project)
- Total Impact: Minimal (shared dependencies)

## 🎨 Customization Examples

### Custom Theme

```tsx
const customTheme = {
  accent: '#3b82f6',
  gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  glow: '#3b82f6'
}

<TableOfContents content={content} theme={customTheme} />
```

### Custom Position

```tsx
// Right-side TOC
<TableOfContents 
  content={content} 
  theme={theme}
  className="right-0 left-auto"
/>
```

### Custom Width

```tsx
// Wider TOC
<TableOfContents 
  content={content} 
  theme={theme}
  className="w-80" // Default is w-64
/>
```

## 🐛 Troubleshooting

### TOC Not Showing
- Check if content array has items with `id` and `title`
- Verify content nodes are wrapped with `id` and `data-toc-section`
- Check browser console for errors

### Active Section Not Updating
- Ensure elements have matching `id` attributes
- Check if `data-toc-section` attribute is present
- Verify Intersection Observer is supported (all modern browsers)

### Scroll Not Working
- Check if element IDs match TOC item IDs
- Verify no conflicting scroll behavior
- Check for JavaScript errors in console

### Mobile Drawer Issues
- Clear browser cache
- Check viewport meta tag
- Verify touch events are not blocked

## 📈 Future Enhancements

### Planned Features
- [ ] Search within TOC
- [ ] Bookmark favorite sections
- [ ] Estimated reading time per section
- [ ] Mini-map visualization
- [ ] Keyboard shortcuts (J/K navigation)
- [ ] Print-friendly TOC
- [ ] Export TOC as PDF
- [ ] Collapsible all/expand all buttons
- [ ] Section completion checkmarks
- [ ] Reading time tracking per section

### Advanced Features
- [ ] AI-powered section summaries
- [ ] Related sections suggestions
- [ ] Section difficulty indicators
- [ ] Prerequisites highlighting
- [ ] Learning path visualization
- [ ] Collaborative annotations
- [ ] Section sharing with highlights

## 🎓 Best Practices

### Content Structure
1. Use clear, descriptive titles
2. Keep hierarchy depth reasonable (max 3-4 levels)
3. Ensure unique IDs across all sections
4. Group related content logically

### Performance
1. Limit TOC items to ~50 for optimal performance
2. Use lazy loading for very long documents
3. Debounce scroll events if needed
4. Optimize Intersection Observer thresholds

### UX
1. Keep TOC visible on desktop
2. Auto-close on mobile after navigation
3. Highlight active section clearly
4. Provide visual feedback on interactions
5. Ensure smooth scroll animations

## 📚 Related Components

- **QuizPanel**: Similar sidebar pattern for quiz navigation
- **NodeRenderer**: Renders content nodes with TOC support
- **TopicContent**: Main content wrapper with TOC integration
- **KeyboardNav**: Keyboard shortcuts for navigation

## 🤝 Contributing

To improve the TOC system:

1. Test with various content structures
2. Report bugs with reproduction steps
3. Suggest UX improvements
4. Submit PRs with new features
5. Update documentation

## 📄 License

Part of the Notty project - MIT License

---

**Made with 💚 by the Notty team**

*Last updated: 2024*
