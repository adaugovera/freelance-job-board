import pool from "../db/index.js";

export const applyJob = async (req, res) => {
  if (req.user.role !== "freelancer")
    return res.status(403).json({ message: "Freelancers only" });

  const { id } = req.params;         // Job ID from URL
  const { cover_letter } = req.body; // Cover letter from frontend

  try {
    const result = await pool.query(
      "INSERT INTO applications (job_id, freelancer_id, cover_letter) VALUES ($1,$2,$3) RETURNING *",
      [id, req.user.id, cover_letter]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyApplications = async (req, res) => {
  // Return applications for the authenticated freelancer with job info
  if (req.user.role !== "freelancer")
    return res.status(403).json({ message: "Freelancers only" });

  try {
    const result = await pool.query(
      `SELECT a.id, a.cover_letter, a.created_at, a.job_id,
              j.title as job_title, j.description as job_description, j.budget as job_budget
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.freelancer_id = $1
        ORDER BY a.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getMyApplications error", err);
    res.status(500).json({ message: "Server error" });
  }
};


