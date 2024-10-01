// In testSession.route.js
import express from "express";
import {
  startTestSession,
  getTestSession,
} from "../controllers/testSession.controller.js";

const router = express.Router();

router.post("/start", startTestSession);
router.get("/:sessionId", getTestSession);

export default router;
