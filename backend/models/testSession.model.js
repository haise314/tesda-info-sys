import mongoose from "mongoose";

const testSessionSchema = new mongoose.Schema(
  {
    registrant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registrant",
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
    endTime: {
      type: Date,
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
