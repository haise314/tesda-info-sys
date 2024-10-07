import express from "express";
import { uploadImage, getImageByUli } from "../controllers/image.controller.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

// Route to handle image upload, with multer middleware
router.post("/upload", upload.single("image"), uploadImage);

// Route to fetch image by ULI
router.get("/image/uli/:uli", getImageByUli);

export default router;
