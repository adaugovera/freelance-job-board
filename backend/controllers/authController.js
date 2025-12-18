import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

export const register = async (req, res, next) => {
  let { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password || !role)
    return next({ status: 400, message: "Missing required fields" });

  // Ensure password is a string — return a clear error if not
  if (typeof password !== 'string') {
    // attempt to coerce common cases (numbers) to string, else return client error
    if (password === undefined || password === null) {
      return next({ status: 400, message: 'Password must be provided' });
    }
    // convert to string for safety (e.g., numeric passwords accidentally sent as numbers)
    password = String(password);
  }

  try {
    // Check if user already exists
    const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length > 0)
      return next({ status: 409, message: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );

    const user = result.rows && result.rows[0];
    if (!user) return next({ status: 500, message: "Failed to create user" });

    if (!process.env.JWT_SECRET)
      return next({ status: 500, message: "Server misconfiguration: JWT_SECRET is not set" });

    // Sign token and return token only (do not return password)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token });
  } catch (err) {
    // forward error to centralized handler
    console.error("Register error", err && err.stack ? err.stack : err);
    return next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!userResult || userResult.rows.length === 0)
      return next({ status: 400, message: "Invalid credentials" });

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next({ status: 400, message: "Invalid credentials" });

    if (!process.env.JWT_SECRET)
      return next({ status: 500, message: "Server misconfiguration: JWT_SECRET is not set" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error", err && err.stack ? err.stack : err);
    return next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userResult = await pool.query(
      "SELECT id, name, email, bio, skills, role FROM users WHERE id=$1",
      [req.user.id]
    );
    res.json(userResult.rows[0]);
  } catch (err) {
    console.error("getMe error", err && err.stack ? err.stack : err);
    return next(err);
  }
};
export const updateMe = async (req, res, next) => {
  const { name, bio, skills } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, bio=$2, skills=$3 WHERE id=$4 RETURNING id, name, email, bio, skills, role",
      [name, bio, skills, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateMe error", err && err.stack ? err.stack : err);
    return next(err);
  }
};
