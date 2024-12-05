import express from "express";
import {
  generateApplicantPDF,
  generateRegistrantPDF,
} from "../controllers/generatePDF.controller.js";

const router = express.Router();

// router.get("/uli/:uli", getApplicantByUli);
router.post("/generate-pdf-applicant", generateApplicantPDF);
router.post("/generate-pdf-registrant", generateRegistrantPDF);

export default router;
