import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import checkAuth from "./middlewares/authMiddleware.js";
import { connectDB } from "./config/db.js";

const mySecretKey = "ProCodrr-storageApp-123$#";

const app = express();

/* ✅ CORS FIRST */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* ✅ Then Parsers */
app.use(express.json());
app.use(cookieParser(mySecretKey));

/* Protected Routes */
app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", checkAuth, fileRoutes);

/* User Routes */
app.use("/", userRoutes);

/* Admin Route */
app.use("/admin", checkAuth, adminRoutes);

/* Error Handler */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 4000;

/* ✅ Connect DB first, then start server */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  });