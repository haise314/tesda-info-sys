import mongoose from "mongoose";
import Applicant from "../applicant.model.js";

const deletedApplicantSchema = new mongoose.Schema(
  {
    ...Applicant.schema.obj, // Spread the original applicant schema
    deletedBy: {
      type: String, // ULI of the admin who deleted the applicant
      required: true,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DeletedApplicant = mongoose.model(
  "DeletedApplicant",
  deletedApplicantSchema
);
export default DeletedApplicant;
