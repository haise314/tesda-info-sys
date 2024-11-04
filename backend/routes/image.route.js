import express from "express";
import {
  uploadImage,
  getImageByUli,
  updateImageByUli,
  deleteImageByUli,
} from "../controllers/image.controller.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

// Route to handle image upload, with multer middleware
router.post("/uli/:uli", upload.single("image"), uploadImage);

// Route to fetch image by ULI
router.get("/uli/:uli", getImageByUli);

// Route to update image by ULI
router.put("/uli/:uli", updateImageByUli);

// Route to delete image by ULI
router.delete("/uli/:uli", deleteImageByUli);

export default router;
