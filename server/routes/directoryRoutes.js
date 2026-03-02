import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";

import {
  createDirectory,
  deleteDirectory,
  getDirectory,
  renameDirectory,
} from "../controllers/directoryController.js";

const router = express.Router();

router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);

// GET
router.get("/", getDirectory); // without id
router.get("/:id", getDirectory); // with id

// POST
router.post("/", createDirectory); // root directory create
router.post("/:parentDirId", createDirectory); // inside parent

// PATCH
router.patch("/:id", renameDirectory);

// DELETE
router.delete("/:id", deleteDirectory);

export default router;
