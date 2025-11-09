#!/usr/bin/env node
const { Client } = require('pg');

async function addCursorColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database.\n');

    // Add cursor column if it doesn't exist
    console.log('Adding cursor column to note_edit_presence...');
    await client.query(`
      ALTER TABLE note_edit_presence
      ADD COLUMN IF NOT EXISTS cursor jsonb;
    `);
    console.log('✅ Cursor column added successfully');

    // Verify it exists
    const result = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'note_edit_presence' AND column_name = 'cursor'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Cursor column verified');
    } else {
      console.log('❌ Cursor column verification failed');
    }

    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

addCursorColumn();
