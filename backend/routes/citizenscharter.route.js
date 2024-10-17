import express from "express";
import {
  createCitizensCharter,
  deleteCitizensCharter,
  getAllCitizenCharter,
  getCitizensCharterById,
  updateCitizensCharter,
} from "../controllers/citizensCharter.controller.js";

const router = express.Router();

router.get("/", getAllCitizenCharter);
router.post("/", createCitizensCharter);
router.get("/:id", getCitizensCharterById);
router.put("/:id", updateCitizensCharter);
router.delete("/:id", deleteCitizensCharter);

export default router;
