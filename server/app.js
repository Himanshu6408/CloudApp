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

await connectDB();

const app = express();

/* ✅ CORS FIRST */
app.use(
  cors({
    origin: "http://localhost:5173",
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

app.listen(4000, () => {
  console.log("Server Started on port 4000");
});