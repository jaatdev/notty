#!/usr/bin/env node
/**
 * scripts/test_heartbeat.js
 * Test the /api/presence/heartbeat endpoint
 */

async function testHeartbeat() {
  console.log('🧪 Testing /api/presence/heartbeat endpoint...\n');

  try {
    const response = await fetch('http://localhost:3000/api/presence/heartbeat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        noteKey: 'test-note-key',
        userId: 'test-user-id',
        displayName: 'Test User',
      }),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Heartbeat endpoint is working!');
      process.exit(0);
    } else {
      console.log('\n❌ Heartbeat endpoint returned an error');
      process.exit(1);
    }
  } catch (err) {
    console.error('\n❌ Error testing heartbeat:', err.message);
    process.exit(1);
  }
}

// Wait a bit for server to be ready
setTimeout(testHeartbeat, 2000);
