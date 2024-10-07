import mongoose from "mongoose";

const imageUploadSchema = new mongoose.Schema({
  uli: {
    type: String,
    required: true,
    index: true, // Add an index for faster queries
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: String,
  mimetype: String,
  size: Number,
  path: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const ImageUpload = mongoose.model("ImageUpload", imageUploadSchema);

export default ImageUpload;
