import express from "express";
import {
  createCitizensCharter,
  deleteCitizensCharter,
  getCitizensCharterById,
  getCitizensCharters,
  updateCitizensCharter,
} from "../controllers/citizensCharter.controller.js";

const router = express.Router();

router.post("/", createCitizensCharter);
router.get("/", getCitizensCharters);
router.get("/:id", getCitizensCharterById);
router.put("/:id", updateCitizensCharter);
router.delete("/:id", deleteCitizensCharter);

export default router;
