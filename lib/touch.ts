/**
 * Touch gesture utilities for mobile interaction
 */

export interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // minimum distance for swipe
  timeout?: number; // maximum time for swipe
}

export interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  currentY: number;
}

/**
 * Detect swipe gestures on an element
 */
export function useSwipe(config: SwipeConfig) {
  const threshold = config.threshold || 50; // 50px minimum
  const timeout = config.timeout || 500; // 500ms maximum
  let touchState: TouchState | null = null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchState = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      currentX: touch.clientX,
      currentY: touch.clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchState) return;
    const touch = e.touches[0];
    touchState.currentX = touch.clientX;
    touchState.currentY = touch.clientY;
  };

  const handleTouchEnd = () => {
    if (!touchState) return;

    const deltaX = touchState.currentX - touchState.startX;
    const deltaY = touchState.currentY - touchState.startY;
    const deltaTime = Date.now() - touchState.startTime;

    // Check if it's a valid swipe
    if (deltaTime > timeout) {
      touchState = null;
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Horizontal swipe (x movement > y movement)
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0) {
        config.onSwipeRight?.();
      } else {
        config.onSwipeLeft?.();
      }
    }
    // Vertical swipe (y movement > x movement)
    else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0) {
        config.onSwipeDown?.();
      } else {
        config.onSwipeUp?.();
      }
    }

    touchState = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
}

/**
 * Check if touch is supported
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Get viewport size category
 */
export function getViewportSize(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Vibrate device (haptic feedback)
 */
export function vibrate(pattern: number | number[] = 10) {
  if (typeof navigator === 'undefined') return;
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

/**
 * Prevent pull-to-refresh on mobile
 */
export function preventPullToRefresh() {
  if (typeof document === 'undefined') return;

  let startY = 0;

  document.addEventListener(
    'touchstart',
    (e) => {
      startY = e.touches[0].pageY;
    },
    { passive: true }
  );

  document.addEventListener(
    'touchmove',
    (e) => {
      const y = e.touches[0].pageY;
      // Only prevent if scrolling up at the top
      if (y > startY && window.scrollY === 0) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
}

/**
 * Enable pull-to-refresh functionality
 */
export function enablePullToRefresh(onRefresh: () => void | Promise<void>) {
  if (typeof document === 'undefined') return;

  let startY = 0;
  let isPulling = false;
  const threshold = 80; // pixels to trigger refresh

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      const y = e.touches[0].pageY;
      const pullDistance = y - startY;
      
      if (pullDistance > threshold && !isPulling) {
        isPulling = true;
        vibrate(20);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling) {
      isPulling = false;
      await onRefresh();
    }
  };

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Detect long press
 */
export function useLongPress(
  onLongPress: () => void,
  delay = 500
): {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchMove: () => void;
} {
  let timeout: NodeJS.Timeout | null = null;

  const handleTouchStart = () => {
    timeout = setTimeout(() => {
      onLongPress();
      vibrate(30);
    }, delay);
  };

  const handleTouchEnd = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const handleTouchMove = () => {
    // Cancel long press if finger moves
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
  };
}
