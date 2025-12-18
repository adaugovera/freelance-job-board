import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getMe, updateMe } from "../controllers/authController.js";

const router = express.Router();



router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

router.post("/register", register);
router.post("/login", login);

export default router;
