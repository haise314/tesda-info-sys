import express from "express";
import { createAnswerSheet } from "../controllers/answersheet.controller.js";

const router = express.Router();

router.post("/", createAnswerSheet);

export default router;
