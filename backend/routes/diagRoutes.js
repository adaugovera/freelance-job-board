import express from 'express';
import pool from '../db/index.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Lightweight diagnostics endpoint — returns DB connectivity, JWT config status.
// Keep this internal / temporary for debugging. Remove or protect before production.
router.get('/', async (req, res) => {
  const out = { ok: true, checks: {}, errors: [] };

  // DB check
  try {
    const r = await pool.query('SELECT 1 as ok');
    out.checks.db = !!(r && r.rows && r.rows[0] && r.rows[0].ok === 1);
  } catch (err) {
    out.checks.db = false;
    out.errors.push({ name: 'db', message: err.message });
  }

  // JWT secret check
  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
    // try to sign a tiny token
    const token = jwt.sign({ t: 'x' }, process.env.JWT_SECRET, { expiresIn: '1s' });
    out.checks.jwt = !!token;
  } catch (err) {
    out.checks.jwt = false;
    out.errors.push({ name: 'jwt', message: err.message });
  }

  out.ok = Object.values(out.checks).every(Boolean);
  res.json(out);
});

export default router;
