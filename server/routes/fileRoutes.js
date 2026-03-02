import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import {
  deleteFile,
  getFile,
  renameFile,
  uploadFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);

// POST (upload)
router.post("/", uploadFile);                  // upload in root
router.post("/:parentDirId", uploadFile);     // upload in specific directory

// GET
router.get("/:id", getFile);

// PATCH
router.patch("/:id", renameFile);

// DELETE
router.delete("/:id", deleteFile);

export default router;