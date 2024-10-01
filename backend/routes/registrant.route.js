import express from "express";
import {
  createRegistrant,
  deleteRegistrant,
  getRegistrants,
  updateRegistrant,
  getSingleRegistrant,
} from "../controllers/registrant.controller.js";

const router = express.Router();

router.get("/", getRegistrants);

router.get("/:id", getSingleRegistrant);

router.post("/", createRegistrant);

router.put("/:id", updateRegistrant);

router.delete("/:id", deleteRegistrant);

export default router;
