import express from "express";
import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
} from "../controllers/test.controller.js";

const router = express.Router();

// Base routes
router.post("/", createTest);
router.get("/", getAllTests);
router.get("/:id", getTestById);
router.put("/:id", updateTest);
router.delete("/:id", deleteTest);

export default router;
