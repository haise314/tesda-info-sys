import express from "express";
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
  getEventsUli,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:uli", getEventsUli);

export default router;
