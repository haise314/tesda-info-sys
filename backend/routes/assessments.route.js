import express from "express";
import {
  getAllAssessments,
  createAssessment,
  deleteAssessment,
} from "../controllers/assessments.controller.js";

const router = express.Router();

router.get("/", getAllAssessments);
router.post("/", createAssessment);
router.delete("/:id", deleteAssessment);

export default router;
