/**
 * Resource preloading utilities for better performance
 */

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload critical data
  try {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = '/data/notes.json'
    link.as = 'fetch'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  } catch (e) {
    console.warn('Failed to preload notes.json', e)
  }
}

/**
 * Prefetch next likely navigation target
 */
export function prefetchSubject(slug: string) {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = `/subjects/${slug}`
  document.head.appendChild(link)
}

/**
 * Preconnect to external domains for faster loading
 */
export function preconnectDomains(domains: string[]) {
  if (typeof window === 'undefined') return

  domains.forEach((domain) => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    document.head.appendChild(link)
  })
}

/**
 * Load image with priority
 */
export function preloadImage(src: string) {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
}

/**
 * Check if user prefers reduced data usage
 */
export function shouldReduceData(): boolean {
  if (typeof navigator === 'undefined') return false
  
  // Check Save-Data header
  // @ts-ignore - experimental API
  if (navigator.connection?.saveData) return true
  
  // Check effective connection type
  // @ts-ignore - experimental API
  const effectiveType = navigator.connection?.effectiveType
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return true
  
  return false
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'png' {
  if (typeof window === 'undefined') return 'png'
  
  const canvas = document.createElement('canvas')
  
  // Check AVIF support
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif'
  }
  
  // Check WebP support
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp'
  }
  
  return 'png'
}

/**
 * Lazy load modules based on intersection
 */
export function lazyLoadOnIntersection<T>(
  loadFn: () => Promise<T>,
  target: HTMLElement,
  options?: IntersectionObserverInit
): Promise<T> {
  return new Promise((resolve) => {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      loadFn().then(resolve)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            loadFn().then(resolve)
          }
        })
      },
      options || { rootMargin: '50px' }
    )

    observer.observe(target)
  })
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleTask(callback: () => void, options?: { timeout?: number }) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, options)
  } else {
    // Fallback to setTimeout
    setTimeout(callback, 1)
  }
}

/**
 * Optimize third-party scripts loading
 */
export function loadScriptAsync(src: string, attributes?: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value)
      })
    }
    
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    
    document.head.appendChild(script)
  })
}
