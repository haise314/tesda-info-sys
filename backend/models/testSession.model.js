import mongoose from "mongoose";

const testSessionSchema = new mongoose.Schema(
  {
    uli: {
      type: String,
      required: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    testCode: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

const TestSession = mongoose.model("TestSession", testSessionSchema);

export default TestSession;
