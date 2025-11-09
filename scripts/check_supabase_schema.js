#!/usr/bin/env node
/**
 * scripts/check_supabase_schema.js
 * Validates Supabase schema for note_drafts and note_edit_presence tables.
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/check_supabase_schema.js
 */

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.error('❌ Error: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.');
    process.exit(1);
  }

  console.log('🔍 Checking Supabase schema...\n');

  const supa = createClient(url, key, { auth: { persistSession: false } });

  try {
    // Check note_drafts table
    console.log('1️⃣  Checking note_drafts table...');
    const { data: draftSample, error: dErr } = await supa
      .from('note_drafts')
      .select('id, note_key')
      .limit(1);

    if (dErr) {
      console.error('   ❌ Error:', dErr.message || dErr);
    } else {
      console.log('   ✅ note_drafts table exists');
      console.log('   📊 Sample rows:', draftSample && draftSample.length > 0 ? JSON.stringify(draftSample) : '(empty)');
    }

    // Check note_edit_presence table
    console.log('\n2️⃣  Checking note_edit_presence table...');
    const { data: presenceSample, error: pErr } = await supa
      .from('note_edit_presence')
      .select('id, note_key, user_id, cursor')
      .limit(1);

    if (pErr) {
      console.error('   ❌ Error:', pErr.message || pErr);
    } else {
      console.log('   ✅ note_edit_presence table exists');
      console.log('   📊 Sample rows:', presenceSample && presenceSample.length > 0 ? JSON.stringify(presenceSample) : '(empty)');
    }

    // Test upsert with unique constraint (most critical check)
    console.log('\n3️⃣  Testing upsert with unique constraint...');
    const testKey = `__schema_test_${Date.now()}`;
    const testPayload = {
      note_key: testKey,
      user_id: 'test_user_for_schema_check',
      display_name: 'schema checker',
      last_active: new Date().toISOString(),
      cursor: { pos: 0 }
    };

    const { error: upErr } = await supa
      .from('note_edit_presence')
      .upsert(testPayload, { onConflict: 'note_key,user_id' });

    if (upErr) {
      console.error('   ❌ Upsert error:', upErr.message || upErr);
    } else {
      console.log('   ✅ Upsert test successful (unique constraint works)');
      
      // Cleanup
      await supa
        .from('note_edit_presence')
        .delete()
        .match({ note_key: testKey, user_id: 'test_user_for_schema_check' });
      console.log('   🧹 Test data cleaned up');
    }

    console.log('\n✨ Schema validation complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run `npm run dev` to start the development server');
    console.log('   2. Sign in via Clerk and navigate to /admin/notes/new');
    console.log('   3. Open Network tab and verify POST /api/presence/heartbeat returns 200');
    console.log('   4. Interact with editor and verify POST /api/drafts/save returns 200');

    process.exit(0);
  } catch (e) {
    console.error('\n❌ Unexpected error:', e.message || e);
    process.exit(1);
  }
}

main();
