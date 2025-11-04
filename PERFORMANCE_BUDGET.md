## Error Type
Runtime Error

## Error Message
Rendered more hooks than during the previous render.


    at CommandPalette (components\command\CommandPalette.tsx:230:33)
    at RootLayout (app\layout.tsx:30:11)

## Code Frame
  228 |
  229 |   const nodeResults = results.filter(r => r._kind === 'node')
> 230 |   const nodesBySubject = useMemo(() => {
      |                                 ^
  231 |     if (!groupNodesBySubject) return null
  232 |     const g: Record<string, Result[]> = {}
  233 |     nodeResults.fVorEach(n => {

Next.js version: 16.0.1 (Webpack)
# Performance Budget

This document defines the performance budgets for Notty to ensure optimal user experience.

## Core Web Vitals Targets

### Largest Contentful Paint (LCP)
- **Target**: < 2.5s
- **Acceptable**: < 4.0s
- **Current**: Monitor with Web Vitals API

### First Input Delay (FID)
- **Target**: < 100ms
- **Acceptable**: < 300ms
- **Current**: Monitor with Web Vitals API

### Cumulative Layout Shift (CLS)
- **Target**: < 0.1
- **Acceptable**: < 0.25
- **Current**: Monitor with Web Vitals API

## Resource Budgets

### JavaScript Bundle Size
- **Main Bundle**: < 250 KB (gzipped)
- **Route Chunks**: < 100 KB each (gzipped)
- **Total JS**: < 500 KB (gzipped)

### CSS Bundle Size
- **Main CSS**: < 50 KB (gzipped)
- **Critical CSS**: < 15 KB (inlined)

### Images
- **Hero Images**: < 100 KB
- **Icons**: < 10 KB each
- **Total Images per page**: < 500 KB

### Fonts
- **Total Fonts**: < 100 KB
- **Use font-display: swap**
- **Subset fonts to needed characters**

## Loading Performance

### Time to Interactive (TTI)
- **Target**: < 3.5s on 4G
- **Target**: < 5.0s on 3G

### First Contentful Paint (FCP)
- **Target**: < 1.8s
- **Acceptable**: < 3.0s

### Speed Index
- **Target**: < 3.4s
- **Acceptable**: < 5.8s

## Runtime Performance

### Frame Rate
- **Target**: 60 FPS
- **Animations**: Use CSS transforms and opacity
- **Avoid**: Layout thrashing

### Memory Usage
- **Target**: < 50 MB heap size
- **Watch for**: Memory leaks in event listeners

## Network Performance

### Total Page Weight
- **Homepage**: < 1 MB
- **Subject Pages**: < 1.5 MB
- **With Cache**: < 200 KB

### Number of Requests
- **Homepage**: < 30 requests
- **Subject Pages**: < 40 requests

## PWA Performance

### Service Worker
- **Install Time**: < 500ms
- **Cache Time**: < 2s for critical resources

### Offline Support
- **Previously visited pages**: 100% cached
- **Core assets**: 100% cached

## Monitoring

### Tools
- Lighthouse CI for builds
- Chrome DevTools Performance panel
- WebPageTest for real-world testing
- Web Vitals reporting in production

### Alerts
- Trigger alerts when budgets exceeded by 10%
- Weekly performance reports
- Real User Monitoring (RUM) data collection

## Optimization Strategies

### Code Splitting
- Route-based splitting enabled
- Dynamic imports for heavy components
- Lazy load below-the-fold content

### Image Optimization
- Use Next.js Image component
- Serve AVIF/WebP formats
- Lazy load images with intersection observer

### Caching Strategy
- Static assets: 1 year cache
- API responses: Stale-while-revalidate
- Service worker for offline support

### Font Optimization
- Use next/font for automatic optimization
- font-display: swap
- Subset fonts
- Preload critical fonts

### Third-Party Scripts
- Load async or defer
- Use requestIdleCallback for non-critical scripts
- Lazy load analytics and tracking
