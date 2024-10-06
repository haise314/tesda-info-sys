import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    uli: {
      type: String,
      required: [true, "Please add a ULI"],
      unique: true,
      match: [/^[A-Z]{3}-\d{2}-\d{3}-03907-001$/, "Please add a valid ULI"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["client", "user", "admin", "superadmin"],
      default: "client",
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if entered password matches the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Exit early if password is not modified.
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Hashed password in model:", this.password);

  next(); // Always call next after hashing
});

const User = mongoose.model("User", userSchema);
export default User;
