import express from "express";
import {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from "../controllers/programs.controller.js";

const router = express.Router();

router.get("/", getAllPrograms);
router.get("/:id", getProgramById);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
