/**
 * Performance monitoring utilities
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100;

  /**
   * Record a performance metric
   */
  record(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${name}: ${value.toFixed(2)}ms`);
    }
  }

  /**
   * Measure execution time of a function
   */
  async measure<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.record(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(`${name} (error)`, duration);
      throw error;
    }
  }

  /**
   * Get all metrics for a specific name
   */
  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  /**
   * Get average time for a metric
   */
  getAverage(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Report Core Web Vitals
   */
  reportWebVitals(metric: {
    id: string;
    name: string;
    value: number;
    label: 'web-vital' | 'custom';
  }) {
    if (metric.label === 'web-vital') {
      this.record(`WebVital: ${metric.name}`, metric.value);
    }
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for measuring component render time
 */
export function usePerformanceMonitor(componentName: string) {
  if (typeof window === 'undefined') return;

  const startTime = performance.now();

  return () => {
    const duration = performance.now() - startTime;
    performanceMonitor.record(`Render: ${componentName}`, duration);
  };
}

/**
 * Report navigation timing
 */
export function reportNavigationTiming() {
  if (typeof window === 'undefined') return;

  // Use the Navigation Timing API
  const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (perfData) {
    performanceMonitor.record('DNS Lookup', perfData.domainLookupEnd - perfData.domainLookupStart);
    performanceMonitor.record('TCP Connection', perfData.connectEnd - perfData.connectStart);
    performanceMonitor.record('Request Time', perfData.responseStart - perfData.requestStart);
    performanceMonitor.record('Response Time', perfData.responseEnd - perfData.responseStart);
    performanceMonitor.record('DOM Processing', perfData.domComplete - perfData.domInteractive);
    performanceMonitor.record('Load Complete', perfData.loadEventEnd - perfData.loadEventStart);
    performanceMonitor.record('Total Load Time', perfData.loadEventEnd - perfData.fetchStart);
  }
}

/**
 * Prefetch a route for faster navigation
 */
export function prefetchRoute(href: string) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Lazy load an image with intersection observer
 */
export function lazyLoadImage(img: HTMLImageElement) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
            observer.unobserve(image);
          }
        }
      });
    });

    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  }
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
