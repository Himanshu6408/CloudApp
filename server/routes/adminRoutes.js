import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /admin/stats
router.get("/stats", checkAuth, getAdminStats);

export default router;