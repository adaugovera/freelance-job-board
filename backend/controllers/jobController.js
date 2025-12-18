import pool from "../db/index.js";

export const createJob = async (req, res) => {
  if (req.user.role !== "client")
    return res.status(403).json({ message: "Clients only" });

  const { title, description, budget } = req.body;

  const result = await pool.query(
    "INSERT INTO jobs (title, description, budget, client_id) VALUES ($1,$2,$3,$4) RETURNING *",
    [title, description, budget, req.user.id]
  );

  res.status(201).json(result.rows[0]);
};

export const getJobs = async (req, res) => {
  const result = await pool.query("SELECT * FROM jobs");
  res.json(result.rows);
};


export const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM jobs WHERE id=$1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Job not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
