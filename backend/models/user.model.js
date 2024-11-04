import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  civilStatues,
  clientClassifications,
} from "../utils/registrant.enums.js";

// Reusable name schema
const nameSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
    default: "",
  },
  lastName: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: false,
    default: "",
  },
});

// Address schema
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  barangay: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    // Existing authentication fields
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
      enum: ["client", "admin", "superadmin"],
      default: "client",
    },

    // Personal Information
    name: nameSchema,
    completeMailingAddress: addressSchema,
    nationality: {
      type: String,
      required: true,
    },

    // Contact Information (from Applicant model)
    contact: {
      telephoneNumber: {
        type: String,
        required: false,
      },
      mobileNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      fax: {
        type: String,
        required: false,
      },
      others: {
        type: String,
        required: false,
      },
    },

    // Employment Information (from Registrant model)
    employmentStatus: {
      type: String,
      enum: employmentStatuses,
      required: true,
    },
    employmentType: {
      type: String,
      enum: employmentTypes,
      required: function () {
        // Add logic here for when employmentType is required based on employmentStatus
        return ["Employed", "Self-Employed"].includes(this.employmentStatus);
      },
    },

    // Educational Information (from Registrant model)
    education: {
      type: String,
      enum: educationalAttainments,
      required: true,
    },

    // Personal Information
    sex: {
      type: String,
      required: true,
    },
    civilStatus: {
      type: String,
      enum: civilStatues,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    clientClassification: {
      type: String,
      enum: clientClassifications,
      required: true,
    },
    otherClientClassification: {
      type: String,
      required: function () {
        return this.clientClassification === "Others";
      },
    },
    birthplace: {
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      region: {
        type: String,
        required: true,
      },
    },

    // Parent Information
    motherName: nameSchema,
    fatherName: nameSchema,
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
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model("User", userSchema);
export default User;
