#!/usr/bin/env node
/**
 * scripts/apply_migration.js
 * Applies SQL migrations to Supabase via direct PostgreSQL connection.
 * Requires pg package and DB connection string.
 * Usage: DATABASE_URL=... node scripts/apply_migration.js [migration-file]
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const migrationFile = process.argv[2] || 'supabase/migrations/002_note_drafts_presence.sql';
  
  if (!dbUrl) {
    console.error('❌ Error: Set DATABASE_URL environment variable.');
    console.error('   Format: postgresql://user:password@host:5432/dbname');
    process.exit(1);
  }

  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Error: Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(migrationFile, 'utf-8');
  console.log(`📂 Applying migration: ${migrationFile}\n`);

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL\n');

    // Execute the entire SQL file as one transaction
    console.log('Executing SQL statements...');
    await client.query(sqlContent);
    console.log('✅ Migration applied successfully!\n');

    await client.end();
    console.log('✨ Complete!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error applying migration:', e.message || e);
    try {
      await client.end();
    } catch (e2) {}
    process.exit(1);
  }
}

main();
