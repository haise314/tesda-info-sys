import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Option",
    required: true,
  },
});

const answerSheetSchema = new mongoose.Schema(
  {
    uli: { type: String, required: true },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    answers: [answerSchema],
    date: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
  }
);

const AnswerSheet = mongoose.model("AnswerSheet", answerSheetSchema);

export default AnswerSheet;
