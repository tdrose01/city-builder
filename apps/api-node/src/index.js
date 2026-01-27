import express from 'express';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

function loadDotEnv(repoRoot) {
  const p = path.join(repoRoot, '.env');
  if (!fs.existsSync(p)) return;
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx < 1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    if (k && !process.env[k]) process.env[k] = v;
  }
}

// Load .env from repo root
const repoRoot = path.resolve(process.cwd(), '..', '..');
loadDotEnv(repoRoot);

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

const app = express();
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    const r = await pool.query('select now() as now, (select count(*)::int from public.health_check) as rows');
    res.json({ ok: true, db: r.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

const port = Number(process.env.NODE_API_PORT || 5001);
app.listen(port, () => console.log(pi-node listening on http://localhost:));