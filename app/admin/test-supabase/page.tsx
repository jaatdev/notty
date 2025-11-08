'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function TestSupabasePage() {
  const [status, setStatus] = useState<string>('Checking...');
  const [tables, setTables] = useState<any[]>([]);
  const [presenceData, setPresenceData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = getSupabaseClient();
        setStatus('Supabase client created ✓');

        // Test 1: Check if we can query note_drafts table
        const { data: drafts, error: draftsError } = await supabase
          .from('note_drafts')
          .select('*')
          .limit(5);

        if (draftsError) {
          setError(`Error querying note_drafts: ${draftsError.message}`);
        } else {
          setStatus(`✓ Connected! Found ${drafts?.length || 0} drafts`);
          setTables(prev => [...prev, { table: 'note_drafts', count: drafts?.length || 0 }]);
        }

        // Test 2: Check if note_edit_presence table exists
        const { data: presence, error: presenceError } = await supabase
          .from('note_edit_presence')
          .select('*')
          .limit(10);

        if (presenceError) {
          setError(prev => prev + `\n❌ Error querying note_edit_presence: ${presenceError.message}`);
        } else {
          setPresenceData(presence || []);
          setTables(prev => [...prev, { table: 'note_edit_presence', count: presence?.length || 0 }]);
        }

        // Test 3: Try to insert a test presence row
        const testUserId = `test_${Date.now()}`;
        const { error: insertError } = await supabase
          .from('note_edit_presence')
          .upsert({
            note_key: 'test-note',
            user_id: testUserId,
            display_name: 'Test User',
            last_active: new Date().toISOString(),
          }, {
            onConflict: 'note_key,user_id'
          });

        if (insertError) {
          setError(prev => prev + `\n❌ Insert test failed: ${insertError.message}`);
        } else {
          setStatus(prev => prev + '\n✓ Insert test passed');
        }

      } catch (err: any) {
        setError(`Fatal error: ${err.message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>

        <div className="bg-slate-900 p-6 rounded-lg mb-4">
          <h2 className="text-xl mb-2">Status</h2>
          <pre className="whitespace-pre-wrap text-green-400">{status}</pre>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 p-6 rounded-lg mb-4">
            <h2 className="text-xl text-red-400 mb-2">Errors</h2>
            <pre className="whitespace-pre-wrap text-red-300">{error}</pre>
          </div>
        )}

        <div className="bg-slate-900 p-6 rounded-lg mb-4">
          <h2 className="text-xl mb-4">Tables</h2>
          {tables.map((t, i) => (
            <div key={i} className="mb-2">
              <span className="font-mono">{t.table}</span>: {t.count} rows
            </div>
          ))}
        </div>

        {presenceData.length > 0 && (
          <div className="bg-slate-900 p-6 rounded-lg">
            <h2 className="text-xl mb-4">Presence Data</h2>
            <pre className="text-xs overflow-auto">{JSON.stringify(presenceData, null, 2)}</pre>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl mb-2">Environment Variables</h2>
          <div className="bg-slate-900 p-4 rounded text-xs">
            <div>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '❌ Missing'}</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '❌ Missing'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
