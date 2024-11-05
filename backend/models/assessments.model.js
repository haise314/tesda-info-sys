import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    // type: {
    //   type: String,
    //   required: true,
    //   enum: ["Quiz", "Exam", "Project", "Assignment"],
    // },
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
export default Assessment;
