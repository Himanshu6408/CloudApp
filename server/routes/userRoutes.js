import express from "express";
import {
  register,
  verifyOtp,
  login,
  getCurrentUser,
  logout,
  logoutAll,
  getAllUser,
} from "../controllers/userController.js";
import checkAuth from "../middlewares/authMiddleware.js"; // ✅ fixed

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify-otp", verifyOtp);
router.post("/user/login", login);
router.get("/user/me", checkAuth, getCurrentUser);
router.get("/users", checkAuth, getAllUser);
router.post("/user/logout", checkAuth, logout);
router.post("/user/logout-all", checkAuth, logoutAll);

export default router;