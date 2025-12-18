import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Robust .env loader: try multiple likely locations so the backend works
// whether node is started from project root or the backend folder (Windows & Unix).

function tryLoadEnv() {
  // First try default (process.cwd()) - dotenv will look for .env in cwd
  let res = dotenv.config();
  if (res && res.parsed) return res;

  // Candidate paths to try (do not use new URL(...).pathname)
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'backend', '.env'),
  ];

  // If started via `node backend/index.js`, process.argv[1] often points to that file's path
  if (process.argv && process.argv[1]) {
    const argvDir = path.dirname(process.argv[1]);
    candidates.push(path.resolve(argvDir, '.env'));
    candidates.push(path.resolve(argvDir, '..', '.env'));
  }

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const r = dotenv.config({ path: p });
        if (r && r.parsed) return r;
      }
    } catch (e) {
      // ignore and continue
    }
  }

  // Last resort: try relative to execPath
  try {
    const maybe = path.resolve(path.dirname(process.execPath), '..', 'backend', '.env');
    if (fs.existsSync(maybe)) {
      const r = dotenv.config({ path: maybe });
      if (r && r.parsed) return r;
    }
  } catch (e) {
    // ignore
  }

  return null;
}

tryLoadEnv();

const { Pool } = pkg;

// Ensure env values passed to pg are proper types (pg expects strings for credentials)
const dbUser = process.env.DB_USER || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_NAME || '';
const dbPassword = process.env.DB_PASSWORD !== undefined ? String(process.env.DB_PASSWORD) : '';
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

const status = {
  DB_USER: !!dbUser,
  DB_NAME: !!dbName,
  DB_PASSWORD: process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== ''
};

console.log('Database env loaded:', status);

if (!status.DB_USER || !status.DB_NAME) {
  console.error('Database configuration missing DB_USER or DB_NAME in environment');
}

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort
});

export default pool;

