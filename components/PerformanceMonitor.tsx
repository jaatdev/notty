'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getStorageStats,
  formatBytes,
  checkStorageHealth,
  getPerformanceMetrics,
  getAveragePerformance,
  getPerformanceRecommendations,
  clearPerformanceMetrics,
  type StorageStats,
  type PerformanceMetrics
} from '@/lib/notes-performance'

// Icon Components
const PerformanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const StorageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const WarningIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16v2h2v-2h-2zm0-6v4h2v-4h-2z" />
  </svg>
)

interface PerformanceMonitorProps {
  isOpen: boolean
  onClose: () => void
}

export default function PerformanceMonitor({ isOpen, onClose }: PerformanceMonitorProps) {
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null)
  const [healthCheck, setHealthCheck] = useState<ReturnType<typeof checkStorageHealth> | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'storage' | 'performance' | 'recommendations'>('storage')

  // Refresh data
  const refreshData = () => {
    setStorageStats(getStorageStats())
    setHealthCheck(checkStorageHealth())
    setMetrics(getPerformanceMetrics())
    setRecommendations(getPerformanceRecommendations())
  }

  // Auto-refresh when modal opens
  useEffect(() => {
    if (isOpen) {
      refreshData()
      // Set up auto-refresh every 5 seconds
      const interval = setInterval(refreshData, 5000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Group metrics by operation
  const metricsByOperation = metrics.reduce((acc, metric) => {
    if (!acc[metric.operation]) {
      acc[metric.operation] = []
    }
    acc[metric.operation].push(metric)
    return acc
  }, {} as Record<string, PerformanceMetrics[]>)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(243,244,246,0.95) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-xl">
                  <PerformanceIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Performance Monitor
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Storage usage and performance metrics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshData}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  aria-label="Refresh data"
                  title="Refresh"
                >
                  <RefreshIcon />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {(['storage', 'performance', 'recommendations'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Health Warning Banner */}
            {healthCheck && !healthCheck.healthy && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                  healthCheck.stats.critical
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                }`}
              >
                <WarningIcon />
                <div>
                  <p className="font-semibold">Storage Alert</p>
                  <p className="text-sm mt-1">{healthCheck.warning}</p>
                </div>
              </motion.div>
            )}

            {/* Storage Tab */}
            {activeTab === 'storage' && storageStats && (
              <div className="space-y-6">
                {/* Storage Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">Total Size</p>
                        <p className="text-3xl font-bold mt-2">{formatBytes(storageStats.totalSize)}</p>
                      </div>
                      <StorageIcon />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">Notes</p>
                        <p className="text-3xl font-bold mt-2">{formatBytes(storageStats.notesSize)}</p>
                      </div>
                      <StorageIcon />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">Backups</p>
                        <p className="text-3xl font-bold mt-2">{formatBytes(storageStats.backupsSize)}</p>
                      </div>
                      <StorageIcon />
                    </div>
                  </motion.div>
                </div>

                {/* Storage Usage Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Storage Usage
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Used: {formatBytes(storageStats.totalSize)} / ~5 MB
                      </span>
                      <span className={`font-bold ${
                        storageStats.critical ? 'text-red-600' :
                        storageStats.nearLimit ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {storageStats.percentUsed.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(storageStats.percentUsed, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          storageStats.critical ? 'bg-red-500' :
                          storageStats.nearLimit ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {storageStats.itemCount} items in localStorage
                    </div>
                  </div>
                </motion.div>

                {/* Storage Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Storage Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Notes Data</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(storageStats.notesSize / storageStats.totalSize) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                          {formatBytes(storageStats.notesSize)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Backups</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(storageStats.backupsSize / storageStats.totalSize) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                          {formatBytes(storageStats.backupsSize)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Other Data</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-500 rounded-full"
                            style={{ width: `${((storageStats.totalSize - storageStats.notesSize - storageStats.backupsSize) / storageStats.totalSize) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                          {formatBytes(storageStats.totalSize - storageStats.notesSize - storageStats.backupsSize)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                {metrics.length === 0 ? (
                  <div className="text-center py-12">
                    <ChartIcon />
                    <p className="text-gray-500 dark:text-gray-400 mt-4">
                      No performance metrics yet. Use the notes system to see performance data.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Metrics Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Operations</p>
                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{metrics.length}</p>
                      </div>
                      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">Successful</p>
                        <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                          {metrics.filter(m => m.success).length}
                        </p>
                      </div>
                      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                        <p className="text-sm font-medium text-red-700 dark:text-red-300">Failed</p>
                        <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">
                          {metrics.filter(m => !m.success).length}
                        </p>
                      </div>
                    </div>

                    {/* Operations Breakdown */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Operations Performance
                        </h3>
                        <button
                          onClick={clearPerformanceMetrics}
                          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-all"
                        >
                          Clear Metrics
                        </button>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(metricsByOperation).map(([operation, opMetrics]) => {
                          const avg = getAveragePerformance(operation)
                          return (
                            <div key={operation} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900 dark:text-white">{operation}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{avg.count} calls</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">Avg</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">{avg.avgDuration.toFixed(2)}ms</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">Min/Max</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {avg.minDuration.toFixed(1)}/{avg.maxDuration.toFixed(1)}ms
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
                                  <p className={`font-semibold ${avg.successRate === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {avg.successRate.toFixed(0)}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl flex items-start gap-3 ${
                      rec.startsWith('🔴') ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
                      rec.startsWith('⚠️') ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' :
                      rec.startsWith('✅') ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                      'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    <span className="text-2xl">{rec.charAt(0)}</span>
                    <p className="flex-1">{rec.slice(2)}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
