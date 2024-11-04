import express from "express";
import {
  generateRegistrantPDF,
  generateApplicantPDF,
} from "../controllers/pdfController.js";

const router = express.Router();

router.post("/generate-pdf", generateRegistrantPDF);
router.post("/generate-pdf-applicant", generateApplicantPDF);

export default router;
