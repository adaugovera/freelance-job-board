import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

function tryLoadEnv() {
	// default attempt
	let res = dotenv.config();
	if (res && res.parsed) return res;

	const candidates = [
		path.resolve(process.cwd(), 'backend', '.env'),
		path.resolve(process.cwd(), '.env'),
	];

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
		} catch (e) {}
	}

	return null;
}

tryLoadEnv();

export default null;

// If dotenv didn't populate important variables (some environments or wrappers
// may behave differently), do a small, safe manual parse of backend/.env
// and populate process.env for missing keys. This avoids relying solely on
// third-party dotenv behaviour and works on Windows/Unix.
function manualLoadEnvIfNeeded() {
	const needed = ['DB_USER', 'DB_NAME', 'DB_PASSWORD', 'JWT_SECRET'];
	const missing = needed.filter(k => !process.env[k]);
	if (missing.length === 0) return;

	const candidates = [
		path.resolve(process.cwd(), 'backend', '.env'),
		path.resolve(process.cwd(), '.env')
	];
	if (process.argv && process.argv[1]) {
		const argvDir = path.dirname(process.argv[1]);
		candidates.push(path.resolve(argvDir, '.env'));
	}

	for (const p of candidates) {
		try {
			if (!fs.existsSync(p)) continue;
			const txt = fs.readFileSync(p, 'utf8');
			const lines = txt.split(/\r?\n/);
			for (let line of lines) {
				line = line.trim();
				if (!line || line.startsWith('#')) continue;
				const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
				if (!m) continue;
				const key = m[1];
				let val = m[2] || '';
				// remove surrounding quotes
				if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
					val = val.slice(1, -1);
				}
				// unescape simple escapes
				val = val.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
				if (!process.env[key]) process.env[key] = val;
			}
			// after reading one file, break
			break;
		} catch (e) {
			// ignore and continue
		}
	}
}

manualLoadEnvIfNeeded();
