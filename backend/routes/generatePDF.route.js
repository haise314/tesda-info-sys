import express from "express";
import {
  generatePDF,
  generatePDFApplicant,
} from "../controllers/generatePDF.controller.js";

const router = express.Router();

router.post("/generate-pdf", async (req, res) => {
  try {
    const { data } = req.body; // Get data from the request
    const pdfBuffer = await generatePDF(data);

    // Set response headers and send the PDF buffer
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="registrant-details.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send("Error generating PDF");
  }
});

router.post("/generate-pdf-applicant", async (req, res) => {
  try {
    const { data } = req.body; // Get data from the request
    const pdfBuffer = await generatePDFApplicant(data);

    // Set response headers and send the PDF buffer
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="registrant-details.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send("Error generating PDF");
  }
});

export default router;
