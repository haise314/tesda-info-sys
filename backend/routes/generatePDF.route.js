import express from "express";
import { generatePDF } from "../controllers/generatePDF.controller.js";
import { getImageByUli } from "../controllers/image.controller.js";

const router = express.Router();

router.post("/generate-pdf/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { uli, data } = req.body;

    if (!["registrant", "applicant"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form type",
      });
    }

    // Get image path if exists
    let imagePath = null;
    try {
      const image = await getImageByUli(uli);
      if (image) {
        imagePath = image.path;
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      // Continue without image if there's an error
    }

    // Generate PDF
    const doc = await generatePDF(type, data, imagePath);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}-${uli}.pdf`
    );

    // Pipe the PDF document to the response
    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
