// In testSession.route.js
import express from "express";
import {
  startTestSession,
  getTestSession,
  endTestSession,
} from "../controllers/testSession.controller.js";

const router = express.Router();

router.post("/start", startTestSession);
router.get("/:sessionId", getTestSession);
router.put("/test-sessions/:sessionId/end", endTestSession);

export default router;
