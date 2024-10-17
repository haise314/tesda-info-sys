import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    uli: {
      type: String,
      required: true,
    },
    testId: {
      // Added to match answersheet model
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    testCode: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound unique index on uli and testId
resultSchema.index({ uli: 1, testId: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);
