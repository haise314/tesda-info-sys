import mongoose from "mongoose";
import Registrant from "../registrant.model.js";

const deletedRegistrantSchema = new mongoose.Schema(
  {
    ...Registrant.schema.obj, // Spread the original registrant schema
    deletedBy: {
      type: String, // ULI of the admin who deleted the registrant
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

const DeletedRegistrant = mongoose.model(
  "DeletedRegistrant",
  deletedRegistrantSchema
);
export default DeletedRegistrant;
