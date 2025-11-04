'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ToastVariant = 'info' | 'success' | 'warning' | 'error'
type ToastAction = { label: string; onClick: () => void }
type Toast = {
  id: string
  message: string
  variant?: ToastVariant
  action?: ToastAction
  timeout?: number
}

type ToastCtx = {
  showToast: (t: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function useToast() {
  const ctx = useContext(Ctx)
  // Return a no-op function if context is not available (SSR or outside provider)
  if (!ctx) return { showToast: () => {} }
  return ctx
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function removeToast(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  function showToast(t: Omit<Toast, 'id'>) {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`
    const timeout = t.timeout ?? 2800
    setToasts(prev => [...prev, { id, ...t }])
    if (timeout > 0) {
      setTimeout(() => removeToast(id), timeout)
    }
  }

  const value = useMemo(() => ({ showToast, removeToast }), [])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toasts">
        {toasts.map(t => (
          <div key={t.id} className={`toast-card ${variantClass(t.variant)}`}>
            <div className="toast-row">
              <span className="toast-msg">{t.message}</span>
              <div className="toast-actions">
                {t.action && (
                  <button className="toast-btn" onClick={() => { t.action?.onClick(); removeToast(t.id) }}>
                    {t.action.label}
                  </button>
                )}
                <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

function variantClass(v?: ToastVariant) {
  switch (v) {
    case 'success': return 'toast-success'
    case 'warning': return 'toast-warning'
    case 'error':   return 'toast-error'
    default:        return 'toast-info'
  }
}