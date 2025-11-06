/**
 * Performance monitoring and optimization utilities for the notes system
 */

export interface PerformanceMetrics {
  operation: string
  duration: number
  timestamp: number
  success: boolean
  metadata?: Record<string, any>
}

export interface StorageStats {
  totalSize: number
  notesSize: number
  backupsSize: number
  percentUsed: number
  itemCount: number
  nearLimit: boolean
  critical: boolean
}

// Performance metrics store (in-memory for session)
const performanceLog: PerformanceMetrics[] = []
const MAX_LOG_SIZE = 100

/**
 * Measure performance of a notes operation
 */
export function measurePerformance<T>(
  operation: string,
  fn: () => T,
  metadata?: Record<string, any>
): T {
  const startTime = performance.now()
  let success = true
  let result: T

  try {
    result = fn()
    return result
  } catch (error) {
    success = false
    throw error
  } finally {
    const duration = performance.now() - startTime
    
    // Log performance metrics
    const metric: PerformanceMetrics = {
      operation,
      duration,
      timestamp: Date.now(),
      success,
      metadata
    }

    performanceLog.push(metric)
    
    // Keep log size manageable
    if (performanceLog.length > MAX_LOG_SIZE) {
      performanceLog.shift()
    }

    // Warn if operation is slow (>100ms)
    if (duration > 100) {
      console.warn(`Slow notes operation: ${operation} took ${duration.toFixed(2)}ms`, metadata)
    }
  }
}

/**
 * Get performance metrics for analysis
 */
export function getPerformanceMetrics(operation?: string): PerformanceMetrics[] {
  if (operation) {
    return performanceLog.filter(m => m.operation === operation)
  }
  return [...performanceLog]
}

/**
 * Get average performance for an operation
 */
export function getAveragePerformance(operation: string): {
  count: number
  avgDuration: number
  minDuration: number
  maxDuration: number
  successRate: number
} {
  const metrics = getPerformanceMetrics(operation)
  
  if (metrics.length === 0) {
    return {
      count: 0,
      avgDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      successRate: 0
    }
  }

  const durations = metrics.map(m => m.duration)
  const successCount = metrics.filter(m => m.success).length

  return {
    count: metrics.length,
    avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
    minDuration: Math.min(...durations),
    maxDuration: Math.max(...durations),
    successRate: (successCount / metrics.length) * 100
  }
}

/**
 * Clear performance metrics
 */
export function clearPerformanceMetrics(): void {
  performanceLog.length = 0
}

/**
 * Calculate localStorage usage and statistics
 */
export function getStorageStats(): StorageStats {
  let totalSize = 0
  let notesSize = 0
  let backupsSize = 0
  let itemCount = 0

  // Iterate through all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue

    const value = localStorage.getItem(key) || ''
    const itemSize = new Blob([key + value]).size
    
    totalSize += itemSize
    itemCount++

    // Categorize by key pattern
    if (key.startsWith('notty_notes_')) {
      notesSize += itemSize
    } else if (key.startsWith('notty_backup_')) {
      backupsSize += itemSize
    }
  }

  // localStorage quota is typically 5-10MB (use 5MB as conservative estimate)
  const QUOTA = 5 * 1024 * 1024 // 5MB in bytes
  const percentUsed = (totalSize / QUOTA) * 100

  return {
    totalSize,
    notesSize,
    backupsSize,
    percentUsed,
    itemCount,
    nearLimit: percentUsed > 75, // Warning at 75%
    critical: percentUsed > 90 // Critical at 90%
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if localStorage is approaching limits
 */
export function checkStorageHealth(): {
  healthy: boolean
  warning: string | null
  stats: StorageStats
} {
  const stats = getStorageStats()

  if (stats.critical) {
    return {
      healthy: false,
      warning: `Critical: localStorage is ${stats.percentUsed.toFixed(1)}% full (${formatBytes(stats.totalSize)}). Delete old backups or export notes to free up space.`,
      stats
    }
  }

  if (stats.nearLimit) {
    return {
      healthy: false,
      warning: `Warning: localStorage is ${stats.percentUsed.toFixed(1)}% full (${formatBytes(stats.totalSize)}). Consider cleaning up old backups.`,
      stats
    }
  }

  return {
    healthy: true,
    warning: null,
    stats
  }
}

/**
 * Virtualization helper for large lists
 * Returns only visible items based on scroll position
 */
export function getVisibleItems<T>(
  items: T[],
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3
): {
  visibleItems: T[]
  startIndex: number
  endIndex: number
  totalHeight: number
  offsetY: number
} {
  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Lazy load notes with pagination
 */
export interface PaginatedNotes<T> {
  items: T[]
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
  hasMore: boolean
}

export function paginateNotes<T>(
  allItems: T[],
  page: number = 1,
  pageSize: number = 20
): PaginatedNotes<T> {
  const totalItems = allItems.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const items = allItems.slice(startIndex, endIndex)

  return {
    items,
    page,
    pageSize,
    totalPages,
    totalItems,
    hasMore: page < totalPages
  }
}

/**
 * Monitor component render performance
 */
export function useRenderTracking(componentName: string): void {
  if (typeof window === 'undefined') return

  const renderCount = React.useRef(0)
  const lastRenderTime = React.useRef(performance.now())

  React.useEffect(() => {
    renderCount.current += 1
    const currentTime = performance.now()
    const timeSinceLastRender = currentTime - lastRenderTime.current
    lastRenderTime.current = currentTime

    // Warn about frequent re-renders
    if (timeSinceLastRender < 16) { // Less than 1 frame (60fps)
      console.warn(
        `${componentName} is re-rendering frequently (${timeSinceLastRender.toFixed(2)}ms since last render). Total renders: ${renderCount.current}`
      )
    }
  })
}

// For React import
let React: any
if (typeof window !== 'undefined') {
  React = require('react')
}

/**
 * Get performance recommendations based on current metrics
 */
export function getPerformanceRecommendations(): string[] {
  const recommendations: string[] = []
  const storage = getStorageStats()
  const allMetrics = getPerformanceMetrics()

  // Storage recommendations
  if (storage.critical) {
    recommendations.push('🔴 Critical: Clear old backups immediately to prevent data loss')
  } else if (storage.nearLimit) {
    recommendations.push('⚠️ Clean up old backups to free up storage space')
  }

  if (storage.backupsSize > storage.notesSize * 2) {
    recommendations.push('💡 Your backups are taking more space than your notes. Consider cleaning old backups.')
  }

  // Performance recommendations
  const slowOperations = allMetrics.filter(m => m.duration > 100)
  if (slowOperations.length > 5) {
    recommendations.push('⚡ Multiple slow operations detected. Consider reducing note list size or enabling pagination.')
  }

  const failedOperations = allMetrics.filter(m => !m.success)
  if (failedOperations.length > 0) {
    recommendations.push(`❌ ${failedOperations.length} failed operations detected. Check console for errors.`)
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Performance is optimal!')
  }

  return recommendations
}
