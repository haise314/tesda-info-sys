import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [optionSchema],
    validate: [arrayLimit, "{PATH} must have exactly 4 options"],
  },
});

const testSchema = new mongoose.Schema(
  {
    testCode: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length === 4;
}

const Test = mongoose.model("Test", testSchema);

export default Test;
