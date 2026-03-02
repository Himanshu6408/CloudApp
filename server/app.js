// api/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import directoryRoutes from "../routes/directoryRoutes.js";
import fileRoutes from "../routes/fileRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";

import checkAuth from "../middlewares/authMiddleware.js";
import { connectDB } from "../config/db.js";

const app = express();

/* ✅ CORS */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* ✅ Parsers */
const mySecretKey = "ProCodrr-storageApp-123$#";
app.use(express.json());
app.use(cookieParser(mySecretKey));

/* ✅ Root / Status */
app.get("/", (req, res) => res.send("Backend is running!"));
app.get("/api/status", (req, res) =>
  res.json({ status: "Backend is running", time: new Date() })
);

/* ✅ Protected Routes */
app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", checkAuth, fileRoutes);

/* ✅ User Routes */
app.use("/", userRoutes);

/* ✅ Admin Routes */
app.use("/admin", checkAuth, adminRoutes);

/* ✅ Error Handler */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong!" });
});

/* ✅ Connect DB (once) */
let dbConnected = false;
async function ensureDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
}

/* ✅ Vercel Serverless Export */
export default async function handler(req, res) {
  await ensureDB(); // ensure DB is connected per invocation
  return app(req, res);
}