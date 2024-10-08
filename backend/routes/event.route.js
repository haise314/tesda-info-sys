import express from "express";
import {
  getEvents,
  createEvent,
  deleteEvent,
  getEventsUli,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.delete("/:id", deleteEvent);
router.get("/:uli", getEventsUli);

export default router;
