/**
 * Dragon Life OS — Supabase SQL Migration Runner
 * =============================================
 * Usage:
 *   1. Get your SERVICE_ROLE_KEY from Supabase Dashboard:
 *      Dashboard → Project Settings → API → service_role key
 *   2. Run:
 *      SERVICE_ROLE_KEY=your_key_here node supabase/apply-migration.js
 *
 * Or set it in .env as SUPABASE_SERVICE_ROLE_KEY
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://rbkkibtauyucbaytnzno.supabase.co';
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌  SERVICE_ROLE_KEY not found.');
  console.error('   Get it from: Supabase Dashboard → Project Settings → API → service_role secret');
  console.error('   Then run: SERVICE_ROLE_KEY=<key> node supabase/apply-migration.js');
  process.exit(1);
}

const sqlPath = path.join(__dirname, 'schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const data = JSON.stringify({
  query: sql,
  params: [],
});

const options = {
  hostname: 'rbkkibtauyucbaytnzno.supabase.co',
  port: 443,
  path: '/rest/v1/rpc/sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Length': data.length,
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅  Migration applied successfully!');
    } else {
      console.error(`❌  Migration failed (HTTP ${res.statusCode}):`);
      console.error(body);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('❌  Network error:', e.message);
  process.exit(1);
});

req.write(data);
req.end();
