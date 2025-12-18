import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { applyJob, getMyApplications } from "../controllers/applicationController.js";

const router = express.Router();

// Freelancer applies to a job
router.post("/:id/apply", protect, applyJob);

// Get freelancer's applications
router.get("/my-applications", protect, getMyApplications);

export default router;

