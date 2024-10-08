import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    uli: {
      type: String,
      required: true,
      ref: "Answersheet",
    },
    testCode: {
      type: String,
      required: true,
      ref: "Test",
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

export default mongoose.model("Result", resultSchema);
