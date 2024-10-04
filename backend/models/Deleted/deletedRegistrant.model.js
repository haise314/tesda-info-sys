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
} from "../../utils/registrant.enums.js";

const DeletedRegistrantSchema = new mongoose.Schema(
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
      type: String,
      required: true,
    },
    hasScholarType: {
      type: Boolean,
      required: true,
    },
    scholarType: {
      type: String,
      enum: scholarTypes,
      required: false,
      // default: "",
    },
    deletedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Registrant = mongoose.model("DeletedRegistrant", DeletedRegistrantSchema);

export default Registrant;
