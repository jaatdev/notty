'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { performanceMonitor } from '@/lib/performance'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Report to performance monitor
    performanceMonitor.reportWebVitals(metric)

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const { name, value, label } = metric
      console.log(`📊 ${label === 'web-vital' ? '🎯' : '📈'} ${name}: ${value.toFixed(2)}`)
    }

    // In production, you could send to analytics
    // Example: gtag('event', metric.name, { value: metric.value })
  })

  return null
}
