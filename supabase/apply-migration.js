/**
 * Dragon Life OS — Supabase SQL Migration Runner
 * Usage: node supabase/apply-migration.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rbkkibtauyucbaytnzno.supabase.co';

if (!SERVICE_ROLE_KEY) {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY not found in .env');
  process.exit(1);
}

const projectRef = 'rbkkibtauyucbaytnzno';
const sqlPath = path.join(__dirname, 'schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const postData = JSON.stringify({ query: sql, params: [] });

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${projectRef}/database/query`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'apikey': SERVICE_ROLE_KEY,
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('🚀 Applying Dragon Life OS schema to Supabase...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Migration applied successfully!');
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

req.write(postData);
req.end();
