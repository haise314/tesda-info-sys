import mongoose from "mongoose";

import {
  clientClassifications,
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  disabilityTypes,
  disabilityCauses,
  scholarTypes,
  civilStatues,
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
    required: true, // Registration status is now required per course
  },
  hasScholarType: {
    type: Boolean,
    required: true, // Whether the course has a scholarship
  },
  scholarType: {
    type: String,
    enum: scholarTypes,
    required: function () {
      return this.hasScholarType; // Only required if hasScholarType is true
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
      unique: true,
    },
    name: {
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
    },
    completeMailingAddress: {
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
    },
    contact: {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      mobileNumber: {
        type: String,
        required: true,
      },
    },
    personalInformation: {
      sex: {
        type: String,
        enum: ["Male", "Female", "Others"],
        required: true,
      },
      civilStatus: {
        type: String,
        enum: civilStatues,
        required: true,
      },
      nationality: {
        type: String,
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
    },
    employmentStatus: {
      type: String,
      enum: employmentStatuses,
      required: true,
      // default: "",
    },
    employmentType: {
      type: String,
      enum: employmentTypes,
      required: false,
      // default: "",
    },
    education: {
      type: String,
      enum: educationalAttainments,
      required: true,
    },
    parent: {
      name: {
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
      },
      completeMailingAddress: {
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
      },
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
    disabilityType: {
      type: String,
      enum: disabilityTypes,
      required: false,
      // default: "",
    },
    disabilityCause: {
      type: String,
      enum: disabilityCauses,
      required: false,
      // default: "",
    },
    course: {
      type: [courseSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
      },
      message: "At least one course is required",
    },
    role: {
      type: String,
      required: true,
      default: "client",
    },
  },
  {
    timestamps: true,
  }
);

const Registrant = mongoose.model("Registrant", registrantSchema);

export default Registrant;
