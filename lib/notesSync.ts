// @ts-nocheck
// lib/notesSync.ts
// Simple helpers to backup/restore the entire admin DB to Supabase

import { supabase } from './supabase';
import type { NotesDB } from './notesManager';

const BACKUP_KEY = 'admin_content_v1_backup';

export async function backupAdminDB(db: NotesDB) {
  // Upsert a single row keyed by BACKUP_KEY containing full JSON dump
  const payload = { key: BACKUP_KEY, data: db };
  const { data, error } = await supabase
    .from('admin_backups')
    .upsert({ key: BACKUP_KEY, data: payload.data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    console.error('Supabase backup error:', error);
    throw error;
  }

  return data;
}

export async function getLatestBackup() {
  const { data, error } = await supabase
    .from('admin_backups')
    .select('data, updated_at')
    .eq('key', BACKUP_KEY)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Supabase fetch backup error:', error);
    throw error;
  }

  return data as { data: NotesDB; updated_at: string } | null;
}

export async function restoreBackupToLocal(getManager: () => any) {
  const latest = await getLatestBackup();
  if (!latest) return null;

  const manager = getManager();
  // manager.importJSON or loadSample or similar
  if (typeof manager.importJSON === 'function') {
    // importJSON expects raw json string or object depending on implementation
    await manager.importJSON(latest.data);
    return true;
  }

  // fallback: directly set local storage
  localStorage.setItem('admin_content_v1', JSON.stringify(latest.data));
  return true;
}
