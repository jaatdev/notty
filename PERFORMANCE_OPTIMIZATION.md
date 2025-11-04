# ⚡ Performance Optimization Guide

This document outlines all the performance optimizations implemented in Notty.

## 🎯 Key Features

### 1. Font Optimization
- **next/font/google** integration for Inter and JetBrains Mono
- Automatic font subsetting and optimization
- `font-display: swap` for better FCP
- CSS variables for flexible font usage
- Reduced layout shift during font loading

### 2. Code Splitting & Lazy Loading
- Dynamic imports for heavy components:
  - CommandPalette (loaded only when triggered with Ctrl/Cmd+K)
  - BookmarksModal (loaded on demand)
  - SubjectSettingsModal (loaded on demand)
  - LearningStatsDashboard (loaded on demand)
  - TagCloud (lazy loaded with skeleton)
  - UpdatesTicker (client-side only)

### 3. Progressive Web App (PWA)
- **Service Worker** with intelligent caching strategies:
  - **CacheFirst** for Google Fonts (1 year)
  - **StaleWhileRevalidate** for fonts, images, CSS, JS
  - **NetworkFirst** for APIs and dynamic content
- Offline support for previously visited pages
- Beautiful offline fallback page
- Manifest with multiple icon sizes and maskable icons

### 4. Image Optimization
- Next.js Image component ready (when images added)
- AVIF and WebP format support
- Responsive image sizes
- Lazy loading with intersection observer
- Minimum cache TTL of 60 seconds

### 5. Performance Monitoring
- **Web Vitals** tracking for:
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)
  - Time to First Byte (TTFB)
  - First Contentful Paint (FCP)
- Custom performance monitor utility
- Navigation timing measurements
- Component render time tracking

### 6. Bundle Optimization
- Package imports optimization for:
  - react-markdown
  - rehype-highlight
  - remark-gfm
- Console removal in production (except errors/warnings)
- TurboMode enabled
- Minification and tree-shaking

### 7. Caching Strategy
- **Static assets**: 1 year immutable cache
- **Images**: 1 year immutable cache
- **Service worker**: Smart multi-layer caching
- LocalStorage for user preferences and learning data

### 8. Loading States
- Beautiful skeleton loaders for:
  - Subject cards
  - Content areas
  - Table of contents
  - Flashcards
  - Dashboard
  - Search results
- Smooth loading transitions
- Prevents layout shift

### 9. Resource Preloading
- Preconnect to Google Fonts
- DNS prefetch for external domains
- Critical resource preloading utilities
- Prefetch for likely navigation targets
- Lazy load on intersection

### 10. Runtime Optimizations
- Debounce utility for search/input
- Throttle utility for scroll events
- RequestIdleCallback for non-critical tasks
- Reduced data mode detection
- Optimal image format detection

## 📊 Performance Metrics

### Target Metrics (see PERFORMANCE_BUDGET.md)
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTI**: < 3.5s on 4G
- **FCP**: < 1.8s

### Bundle Sizes
- Main bundle: Optimized with code splitting
- Route chunks: Automatically split
- CSS: Minimal, utility-first with Tailwind

## 🚀 Usage

### Performance Monitoring
```typescript
import { performanceMonitor } from '@/lib/performance'

// Measure function execution
const result = await performanceMonitor.measure('dataLoad', async () => {
  return await fetchData()
})

// Get metrics
const average = performanceMonitor.getAverage('dataLoad')
```

### Preloading Resources
```typescript
import { prefetchSubject, preloadImage } from '@/lib/preload'

// Prefetch next subject
prefetchSubject('mathematics')

// Preload hero image
preloadImage('/hero.jpg')
```

### Loading Skeletons
```typescript
import { SubjectCardSkeleton, ContentSkeleton } from '@/components/ui/LoadingSkeleton'

<Suspense fallback={<SubjectCardSkeleton />}>
  <SubjectCard />
</Suspense>
```

## 🔧 Configuration

### Next.js Config
- Image optimization with AVIF/WebP
- PWA with workbox
- Compiler optimizations
- Cache headers
- Package import optimization

### Service Worker
- Runtime caching for all asset types
- Network timeout: 10s
- Cache expiration policies
- Background sync ready

## 📈 Monitoring in Production

### Web Vitals
Web Vitals are automatically tracked and can be sent to analytics:

```typescript
// In app/web-vitals.tsx
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to your analytics
    analytics.track(metric.name, metric.value)
  })
}
```

### Lighthouse CI
Run Lighthouse audits in CI/CD:
```bash
npm install -g @lhci/cli
lhci autorun
```

## 🎨 Best Practices

### Component Optimization
1. Use `useMemo` for expensive computations
2. Use `useCallback` for event handlers
3. Lazy load heavy components
4. Code split by route

### Image Best Practices
1. Use Next.js Image component
2. Provide width and height
3. Use priority for above-fold images
4. Lazy load below-fold images

### CSS Best Practices
1. Use Tailwind for utility-first CSS
2. Avoid large CSS-in-JS
3. Critical CSS is inlined
4. Non-critical CSS is lazy loaded

### JavaScript Best Practices
1. Minimize bundle size
2. Tree-shake unused code
3. Use dynamic imports
4. Defer non-critical scripts

## 🔍 Debugging Performance

### Chrome DevTools
1. **Performance Panel**: Record and analyze
2. **Network Panel**: Check resource loading
3. **Lighthouse**: Audit page
4. **Coverage**: Find unused code

### Performance Monitor
```typescript
// Check all metrics
performanceMonitor.getMetrics('Render: HomePage')

// Clear metrics
performanceMonitor.clear()
```

## 🎯 Future Optimizations

1. **Image CDN**: Consider Cloudflare Images or imgix
2. **Edge Functions**: Move API routes to edge
3. **Partial Hydration**: Use islands architecture
4. **Streaming SSR**: Stream HTML chunks
5. **Prefetch on Hover**: Prefetch links on hover
6. **Resource Hints**: More aggressive preloading

## 📚 Resources

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [PWA Best Practices](https://web.dev/pwa-checklist/)
- [Performance Budget](./PERFORMANCE_BUDGET.md)
