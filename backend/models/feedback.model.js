import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
    min: 1,
    max: 5,
  },
});

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    age: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      validate: {
        validator: function (v) {
          return v === "" || (Number.isInteger(v) && v >= 0);
        },
        message: (props) => `${props.value} is not a valid age!`,
      },
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    mobileNumber: {
      type: String,
      required: false,
    },
    emailAddress: {
      type: String,
      required: false,
    },
    feedbackQuestions: [questionSchema],
    recommendInstitution: {
      type: Boolean,
      required: false,
    },
    suggestion: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
