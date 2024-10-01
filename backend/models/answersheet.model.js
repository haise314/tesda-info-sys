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
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleInitial: String,
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    civilStatus: { type: String, required: true },
    highestEducationalAttainment: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    school: { type: String, required: true },
    qualifications: { type: String, required: true },
    date: { type: Date, required: true },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

const AnswerSheet = mongoose.model("AnswerSheet", answerSheetSchema);

export default AnswerSheet;
