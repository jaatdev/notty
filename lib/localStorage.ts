import { useEffect, useState } from 'react'

export const persist = <T,>(key: string, value: T) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
export const retrieve = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) as T : fallback
  } catch {
    return fallback
  }
}

// Simple hook to persist state in localStorage
export function useStoredState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => retrieve(key, initial))
  useEffect(() => { persist(key, state) }, [key, state])
  return [state, setState] as const
}