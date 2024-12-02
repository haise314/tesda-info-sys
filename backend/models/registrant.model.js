import mongoose from "mongoose";
import {
  clientClassifications,
  disabilityTypes,
  disabilityCauses,
  scholarTypes,
  registrationStatuses,
} from "../utils/registrant.enums.js";

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  registrationStatus: {
    type: String,
    enum: registrationStatuses,
    default: "Pending",
    required: true,
  },
  hasScholarType: {
    type: Boolean,
    required: true,
  },
  scholarType: {
    type: String,
    enum: [...scholarTypes, ""],
    required: function () {
      return this.hasScholarType;
    },
  },
  otherScholarType: {
    type: String,
    required: function () {
      return this.scholarType === "Others";
    },
  },
});

const registrantSchema = new mongoose.Schema(
  {
    uli: {
      type: String,
      required: true,
      ref: "User", // Reference to User model
    },
    disabilityType: {
      type: String,
      enum: [...disabilityTypes, ""],
      required: false,
    },
    disabilityCause: {
      type: String,
      enum: [...disabilityCauses, ""],
      required: false,
    },
    course: {
      type: [courseSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one course is required",
      },
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Registrant = mongoose.model("Registrant", registrantSchema);
export default Registrant;
