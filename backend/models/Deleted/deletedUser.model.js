import mongoose from "mongoose";
import User from "../user.model.js";

const deletedUserSchema = new mongoose.Schema(
  {
    ...User.schema.obj, // Spread the original user schema
    deletedBy: {
      type: String, // ULI of the admin who deleted the user
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

const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);
export default DeletedUser;
