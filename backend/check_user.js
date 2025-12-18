import pool from './db/index.js';

async function run() {
  try {
    const res = await pool.query("SELECT id, email, name FROM users WHERE email=$1", ['scripttest@example.com']);
    console.log('FOUND', res.rows.length, res.rows[0] || null);
  } catch (err) {
    console.error('check_user error', err && err.stack ? err.stack : err);
  } finally {
    await pool.end();
  }
}

run();
