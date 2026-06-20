const fs = require('fs');
const path = require('path');

/**
 * parse un fichier .env et retourne un objet clé-valeur.
 * ignore les lignes vides et les commentaires.
 */
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const vars = {};
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');

  for (const line of lines) {
    const entry = parseLine(line);
    if (entry) {
      vars[entry.key] = entry.value;
    }
  }

  return vars;
}

/** parse une ligne .env — retourne { key, value } ou null */
function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) return null;

  const key = trimmed.slice(0, eqIndex).trim();
  const value = stripQuotes(trimmed.slice(eqIndex + 1).trim());
  return { key, value };
}

/** retire les guillemets simples ou doubles autour d'une valeur */
function stripQuotes(value) {
  const first = value[0];
  const last = value[value.length - 1];
  const isQuoted = (first === '"' || first === "'") && first === last;
  return isQuoted ? value.slice(1, -1) : value;
}

/** génère le contenu d'un fichier environment.ts */
function buildEnvContent(isProd, vars) {
  return `export const environment = {
  production: ${isProd},
  supabaseUrl: '${vars.supabaseUrl}',
  supabaseKey: '${vars.supabaseKey}',
  grokApiKey: '${vars.grokApiKey}',
  grokModel: '${vars.grokModel}',
};
`;
}

// — main —

const envVars = parseEnvFile(path.join(__dirname, '.env'));
Object.assign(process.env, envVars);

const vars = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
  grokApiKey: process.env.GROK_API_KEY || '',
  grokModel: process.env.GROK_MODEL || 'grok-2-1212',
};

if (!vars.supabaseUrl || !vars.supabaseKey) {
  console.warn('⚠️ Warning: SUPABASE_URL or SUPABASE_KEY environment variable is not defined.');
}

const envDir = path.join(__dirname, 'src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(path.join(envDir, 'environment.ts'), buildEnvContent(false, vars), 'utf8');
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), buildEnvContent(true, vars), 'utf8');

console.log('✅ src/environments/environment.ts and environment.prod.ts generated successfully.');
