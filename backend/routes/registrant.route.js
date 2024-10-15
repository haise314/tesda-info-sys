import express from "express";
import {
  createRegistrant,
  deleteRegistrant,
  getRegistrants,
  updateRegistrant,
  getSingleRegistrant,
  getRegistrantByUli,
  deleteCourse,
} from "../controllers/registrant.controller.js";

const router = express.Router();

router.get("/", getRegistrants);
router.get("/:id", getSingleRegistrant);
router.post("/", createRegistrant);
router.put("/:id", updateRegistrant);
router.delete("/:id", deleteRegistrant);
router.get("/uli/:uli", getRegistrantByUli);
router.delete("/:registrantId/courses/:courseId", deleteCourse);

export default router;
