import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
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
    default: "",
  },
  questionImageUrl: {
    type: String,
    default: "",
  },
  passageIndex: {
    type: Number,
    default: -1, // -1 indicates no passage reference
  },
  options: {
    type: [optionSchema],
    validate: [
      {
        validator: arrayLimit,
        message: "{PATH} must have exactly 4 options",
      },
      {
        validator: hasCorrectAnswer,
        message: "At least one correct answer must be selected",
      },
    ],
  },
});

const passageSchema = new mongoose.Schema({
  content: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
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
    passages: {
      type: [passageSchema],
      default: [],
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

function hasCorrectAnswer(val) {
  return val.some((option) => option.isCorrect);
}

const Test = mongoose.model("Test", testSchema);

export default Test;
