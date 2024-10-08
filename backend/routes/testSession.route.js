// In testSession.route.js
import express from "express";
import {
  startTestSession,
  getTestSession,
  endTestSession,
  getAllTestSessions,
  updateTestSession,
  deleteTestSession,
} from "../controllers/testSession.controller.js";

const router = express.Router();

router.post("/start", startTestSession);
router.get("/:sessionId", getTestSession);
router.put("/test-sessions/:sessionId/end", endTestSession);
router.get("/", getAllTestSessions);
router.put("/:id", updateTestSession);
router.delete("/:id", deleteTestSession);

export default router;
