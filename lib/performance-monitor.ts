/**
 * 🚀 PERFORMANCE MONITORING - Steps 46-50
 * Track and optimize Web Vitals and performance metrics
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals'

export interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

// Threshold values based on web.dev recommendations
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

function reportMetric(metric: Metric) {
  const webVitalMetric: WebVitalMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}:`, {
      value: Math.round(metric.value),
      rating: webVitalMetric.rating,
    })
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // You can send to Google Analytics, Vercel Analytics, or custom endpoint
    sendToAnalytics(webVitalMetric)
  }

  // Store in localStorage for debugging
  storeMetric(webVitalMetric)
}

function sendToAnalytics(metric: WebVitalMetric) {
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      metric_delta: Math.round(metric.delta),
      metric_id: metric.id,
    })
  }

  // Example: Send to custom endpoint
  if (navigator.sendBeacon) {
    const body = JSON.stringify(metric)
    navigator.sendBeacon('/api/analytics/web-vitals', body)
  }
}

function storeMetric(metric: WebVitalMetric) {
  try {
    const key = 'notty-web-vitals'
    const stored = localStorage.getItem(key)
    const metrics = stored ? JSON.parse(stored) : []
    
    metrics.push({
      ...metric,
      timestamp: Date.now(),
    })
    
    // Keep only last 50 metrics
    if (metrics.length > 50) {
      metrics.splice(0, metrics.length - 50)
    }
    
    localStorage.setItem(key, JSON.stringify(metrics))
  } catch (error) {
    console.error('Failed to store web vital metric:', error)
  }
}

export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Register all Web Vitals (FID deprecated, replaced by INP)
  onCLS(reportMetric)
  onFCP(reportMetric)
  onLCP(reportMetric)
  onTTFB(reportMetric)
  onINP(reportMetric)

  // Log additional performance metrics
  if (process.env.NODE_ENV === 'development') {
    logPerformanceMetrics()
  }
}

function logPerformanceMetrics() {
  if (typeof window === 'undefined') return

  // Wait for page to load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (perfData) {
        console.log('[Performance] Page Load Metrics:', {
          'DNS Lookup': Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
          'TCP Connection': Math.round(perfData.connectEnd - perfData.connectStart),
          'Request Time': Math.round(perfData.responseStart - perfData.requestStart),
          'Response Time': Math.round(perfData.responseEnd - perfData.responseStart),
          'DOM Interactive': Math.round(perfData.domInteractive - perfData.fetchStart),
          'Total Load Time': Math.round(perfData.loadEventEnd - perfData.fetchStart),
        })
      }

      // Log resource timings
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
      
      console.log('[Performance] Resources:', {
        'Total Resources': resources.length,
        'Total Transfer Size': `${(totalSize / 1024).toFixed(2)} KB`,
        'Scripts': resources.filter(r => r.name.includes('.js')).length,
        'Stylesheets': resources.filter(r => r.name.includes('.css')).length,
        'Images': resources.filter(r => /\.(png|jpg|jpeg|gif|svg|webp|avif)/.test(r.name)).length,
      })
    }, 1000)
  })
}

export function getStoredMetrics(): WebVitalMetric[] {
  try {
    const stored = localStorage.getItem('notty-web-vitals')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function clearStoredMetrics() {
  try {
    localStorage.removeItem('notty-web-vitals')
  } catch (error) {
    console.error('Failed to clear stored metrics:', error)
  }
}

// Performance budget checker
export interface PerformanceBudget {
  maxBundleSize: number // KB
  maxImageSize: number // KB
  maxScriptCount: number
  maxTotalSize: number // KB
  maxLoadTime: number // ms
}

export const DEFAULT_BUDGET: PerformanceBudget = {
  maxBundleSize: 300, // 300 KB
  maxImageSize: 200, // 200 KB
  maxScriptCount: 20,
  maxTotalSize: 1000, // 1 MB
  maxLoadTime: 3000, // 3 seconds
}

export function checkPerformanceBudget(budget: PerformanceBudget = DEFAULT_BUDGET) {
  if (typeof window === 'undefined') return null

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  const scripts = resources.filter(r => r.name.includes('.js'))
  const images = resources.filter(r => /\.(png|jpg|jpeg|gif|svg|webp|avif)/.test(r.name))
  
  const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024 // KB
  const largestScript = Math.max(...scripts.map(s => (s.transferSize || 0) / 1024))
  const largestImage = Math.max(...images.map(i => (i.transferSize || 0) / 1024))
  const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0

  const results = {
    passed: true,
    metrics: {
      bundleSize: { value: largestScript, budget: budget.maxBundleSize, passed: largestScript <= budget.maxBundleSize },
      imageSize: { value: largestImage, budget: budget.maxImageSize, passed: largestImage <= budget.maxImageSize },
      scriptCount: { value: scripts.length, budget: budget.maxScriptCount, passed: scripts.length <= budget.maxScriptCount },
      totalSize: { value: totalSize, budget: budget.maxTotalSize, passed: totalSize <= budget.maxTotalSize },
      loadTime: { value: loadTime, budget: budget.maxLoadTime, passed: loadTime <= budget.maxLoadTime },
    },
  }

  results.passed = Object.values(results.metrics).every(m => m.passed)

  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance Budget]', results.passed ? '✅ PASSED' : '❌ FAILED')
    Object.entries(results.metrics).forEach(([key, metric]) => {
      const status = metric.passed ? '✅' : '❌'
      console.log(`  ${status} ${key}: ${Math.round(metric.value)} / ${metric.budget}`)
    })
  }

  return results
}
