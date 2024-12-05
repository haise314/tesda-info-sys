import express from "express";
import { generatePDF } from "../controllers/pdfGenerator.controller.js";

const router = express.Router();

router.post("/generate-pdf", generatePDF);

export default router;
