'use client'

// ============================================================================
// NOTES EXPORT/IMPORT MANAGER
// File download/upload with validation and user feedback
// ============================================================================

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exportNotes, importNotes, getBackups, restoreFromBackup } from '@/lib/notes-hierarchical'
import { useToast } from './feedback/ToastProvider'

// Icons
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>

interface NotesExportImportProps {
  subjectSlug: string
  isOpen: boolean
  onClose: () => void
}

export default function NotesExportImport({ subjectSlug, isOpen, onClose }: NotesExportImportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [backups, setBackups] = useState<Array<{ timestamp: number; date: string; totalNotes: number }>>([])
  const [showBackups, setShowBackups] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  // Load backups when showing backup view
  const loadBackups = () => {
    const backupList = getBackups() // No subject slug needed in new system
    setBackups(backupList)
    setShowBackups(true)
  }

  // Export notes to JSON file
  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      const jsonData = exportNotes(subjectSlug)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `notty-notes-${subjectSlug}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showToast({
        message: '✅ Notes exported successfully!',
        variant: 'success'
      })
    } catch (error) {
      showToast({
        message: '❌ Failed to export notes',
        variant: 'error'
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Import notes from JSON file
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      
      const text = await file.text()
      
      // Validate JSON
      try {
        JSON.parse(text)
      } catch {
        throw new Error('Invalid JSON file')
      }
      
      const success = importNotes(text)
      
      if (success) {
        showToast({
          message: '✅ Notes imported successfully!',
          variant: 'success'
        })
        
        // Refresh the page to show new notes
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        throw new Error('Import failed')
      }
    } catch (error) {
      showToast({
        message: error instanceof Error ? `❌ ${error.message}` : '❌ Failed to import notes',
        variant: 'error'
      })
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Restore from backup
  const handleRestore = async (timestamp: number) => {
    if (!confirm('This will replace your current notes. Are you sure?')) {
      return
    }

    try {
      const success = restoreFromBackup(timestamp) // No subject slug in new system
      
      if (success) {
        showToast({
          message: '✅ Notes restored from backup!',
          variant: 'success'
        })
        
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        throw new Error('Backup not found')
      }
    } catch (error) {
      showToast({
        message: '❌ Failed to restore backup',
        variant: 'error'
      })
    }
  }

  // Clean old backups (auto-handled in new system, keeping 5 most recent)
  const handleCleanBackups = () => {
    showToast({
      message: 'ℹ️ Backups are auto-managed (max 5 kept)',
      variant: 'info',
      timeout: 3000
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                💾 Backup & Restore
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Export, import, and manage your notes
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <XIcon />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] smooth-scroll">
            {!showBackups ? (
              <div className="space-y-4">
                {/* Export Section */}
                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <DownloadIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        Export Notes
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Download all your notes as a JSON file. Use this to backup your notes or transfer them to another device.
                      </p>
                      <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-6 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        <DownloadIcon />
                        {isExporting ? 'Exporting...' : 'Export Notes'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Import Section */}
                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <UploadIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        Import Notes
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Upload a previously exported JSON file to restore your notes. This will merge with existing notes.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                        id="notes-import-input"
                      />
                      <label
                        htmlFor="notes-import-input"
                        className={`inline-flex px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all font-medium items-center gap-2 shadow-lg cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <UploadIcon />
                        {isImporting ? 'Importing...' : 'Import Notes'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Backups Section */}
                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <HistoryIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        Automatic Backups
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        View and restore from automatic backups. Notes are automatically backed up before major changes.
                      </p>
                      <button
                        onClick={loadBackups}
                        className="px-6 py-2.5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-medium flex items-center gap-2 shadow-lg"
                      >
                        <HistoryIcon />
                        View Backups
                      </button>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-300 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Important:</strong> Always export your notes regularly. While automatic backups are created, they are stored in your browser and may be lost if you clear your browser data.
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              // Backups List View
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setShowBackups(false)}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                  >
                    ← Back to Export/Import
                  </button>
                  {backups.length > 3 && (
                    <button
                      onClick={handleCleanBackups}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm"
                    >
                      <TrashIcon />
                      Clean Old Backups
                    </button>
                  )}
                </div>

                {backups.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-400">No backups found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {backups.map((backup) => (
                      <motion.div
                        key={backup.timestamp}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">
                              {backup.date}
                            </p>
                            <p className="text-sm text-gray-400">
                              {backup.totalNotes} note{backup.totalNotes !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRestore(backup.timestamp)}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors flex items-center gap-2 opacity-0 group-hover:opacity-100"
                          >
                            <RefreshIcon />
                            Restore
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
