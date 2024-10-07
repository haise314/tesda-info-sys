// image.controller.js
import ImageUpload from "../models/image.model.js";
import path from "path";
import fs from "fs/promises";
import { upload } from "../config/multer.config.js";
import User from "../models/user.model.js";
import Applicant from "../models/applicant.model.js";
import Registrant from "../models/registrant.model.js";

// Function to handle image upload
export const uploadImage = async (req, res) => {
  console.log("File received:", req.file);

  // This check now occurs after multer has processed the request
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const { uli } = req.body;
  if (!uli) {
    return res.status(400).json({ success: false, message: "Missing ULI" });
  }

  try {
    // Validate ULI
    const user = await User.findOne({ uli });
    const applicant = await Applicant.findOne({ uli });
    const registrant = await Registrant.findOne({ uli });
    if (!user || (!applicant && !registrant)) {
      return res.status(400).json({ success: false, message: "Invalid ULI" });
    }

    // Create image entry in MongoDB
    const imageUpload = new ImageUpload({
      uli,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
    });

    await imageUpload.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: { image: imageUpload },
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Function to fetch image by ULI
export const getImageByUli = async (req, res) => {
  try {
    const uli = req.params.uli;
    const image = await ImageUpload.findOne({ uli });

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    res.json({
      success: true,
      data: {
        filename: image.filename,
        url: `${req.protocol}://${req.get("host")}${image.path}`,
        mimetype: image.mimetype,
        size: image.size,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
