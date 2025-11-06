// ============================================================================
// MIGRATION UTILITY - Run Once to Migrate from Old to New Notes System
// ============================================================================

import { migrateFromOldFormat } from './notes-hierarchical'

/**
 * Run this function once to migrate all notes from the old localStorage
 * format (multiple keys) to the new hierarchical JSON format (single key)
 * 
 * Usage in browser console:
 * 1. Open DevTools (F12)
 * 2. Run: localStorage.setItem('notty_migration_needed', 'true')
 * 3. Refresh the page
 * 4. Migration will run automatically on next load
 */
export function checkAndRunMigration(): boolean {
  const needsMigration = localStorage.getItem('notty_migration_needed')
  
  if (needsMigration === 'true') {
    console.log('[Notty] 🔄 Starting notes migration...')
    
    const success = migrateFromOldFormat()
    
    if (success) {
      console.log('[Notty] ✅ Migration completed successfully!')
      console.log('[Notty] 📊 Check your notes - all data should be preserved')
      localStorage.removeItem('notty_migration_needed')
      localStorage.setItem('notty_migrated_v2', new Date().toISOString())
      return true
    } else {
      console.log('[Notty] ℹ️ No old notes found to migrate')
      localStorage.removeItem('notty_migration_needed')
      return false
    }
  }
  
  return false
}

/**
 * Check if migration has already been completed
 */
export function isMigrated(): boolean {
  return localStorage.getItem('notty_migrated_v2') !== null
}

/**
 * Get migration status
 */
export function getMigrationStatus(): {
  migrated: boolean
  migratedAt?: string
  hasOldData: boolean
} {
  const migrated = isMigrated()
  const migratedAt = localStorage.getItem('notty_migrated_v2') || undefined
  
  // Check for old data keys
  const allKeys = Object.keys(localStorage)
  const hasOldData = allKeys.some(k => k.startsWith('notty_notes_') && !k.includes('_v2'))
  
  return {
    migrated,
    migratedAt,
    hasOldData
  }
}
