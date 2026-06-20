/**
 * Dragon Life OS — Supabase SQL Migration Runner
 * =============================================
 * Uses Supabase Management API via a Personal Access Token.
 *
 * How to get a Personal Access Token:
 *   1. Go to https://app.supabase.com → Account Settings → Access Tokens
 *   2. Create a new personal access token
 *   3. Run: node supabase/apply-migration.js <your-token>
 *      Or set it in .env as SUPABASE_ACCESS_TOKEN=sbp_...
 *
 * Alternative (manual):
 *   Copy-paste the content of schema.sql into the Supabase SQL Editor
 *   Dashboard → Your Project → SQL Editor → New Query → Paste & Run
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const ACCESS_TOKEN = args[0] || process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = 'rbkkibtauyucbaytnzno';

if (!ACCESS_TOKEN) {
  console.error('❌  Usage: node apply-migration.js <your-personal-access-token>');
  console.error('   Or set SUPABASE_ACCESS_TOKEN in .env');
  console.error('');
  console.error('   Get a token at: https://app.supabase.com → Account Settings → Access Tokens');
  process.exit(1);
}

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
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'apikey': ACCESS_TOKEN,
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('🚀 Applying Dragon Life OS schema to Supabase...');
console.log(`   Project: ${projectRef}`);

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅  Migration applied successfully!');
      console.log('    All tables created (or already exist).');
    } else {
      console.error(`❌  Migration failed (HTTP ${res.statusCode}):`);
      try {
        const parsed = JSON.parse(body);
        console.error('   ', parsed.message || body);
      } catch {
        console.error('   ', body.substring(0, 500));
      }
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
