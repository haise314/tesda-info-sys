import express from "express";
import {
  getEvents,
  createEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.delete("/:id", deleteEvent);

export default router;
