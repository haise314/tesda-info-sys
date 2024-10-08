import express from "express";
import {
  createAnswerSheet,
  getAnswerSheetByUli,
} from "../controllers/answersheet.controller.js";

const router = express.Router();

router.post("/", createAnswerSheet);
router.get("/answers/:uli", getAnswerSheetByUli);

export default router;
