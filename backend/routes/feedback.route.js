import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller.js";

const router = express.Router();

// Base routes
router.post("/", createFeedback);
router.get("/", getAllFeedback);
router.get("/:id", getFeedbackById);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

export default router;
