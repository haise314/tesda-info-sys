import mongoose from "mongoose";

import {
  applicationStatuses,
  assessmentTypes,
  civilStatues,
  clientTypes,
  employmentStatuses,
  highestEducationalAttainments,
} from "../../utils/applicant.enums.js";

const workExperienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: false,
  },
  inclusiveDates: {
    from: {
      type: Date,
      required: false,
    },
    to: {
      type: Date,
      required: false,
    },
  },
  monthlySalary: {
    type: Number,
    required: false,
    min: 0,
  },
  appointmentStatus: {
    type: String,
    required: false,
  },
  noOfYearsInWork: {
    type: Number,
    required: false,
  },
});

const trainingSeminarAttendedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  venue: {
    type: String,
    required: false,
  },
  inclusiveDates: {
    from: {
      type: Date,
      required: false,
    },
    to: {
      type: Date,
      required: false,
    },
  },
  numberOfHours: {
    type: Number,
    required: false,
    min: 0,
  },
  conductedBy: {
    type: String,
    required: false,
  },
});

const licensureExaminationPassedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  dateOfExamination: {
    type: Date,
    required: false,
  },
  examinationVenue: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
  },
  remarks: {
    type: String,
    required: false,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
});

const competencyAssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  qualificationLevel: {
    type: String,
    required: false,
  },
  industrySector: {
    type: String,
    required: false,
  },
  certificateNumber: {
    type: String,
    required: false,
  },
  dateIssued: {
    type: Date,
    required: false,
  },
  expirationDate: {
    type: Date,
    required: false,
  },
});

// Define a schema for each assessment with related fields
const assessmentSchema = new mongoose.Schema({
  assessmentTitle: {
    type: String,
    required: true,
  },
  assessmentType: {
    type: String,
    enum: assessmentTypes,
    required: true,
  },
  applicationStatus: {
    type: String,
    enum: applicationStatuses,
    required: true,
    default: "For Approval",
  },
});

const deletedApplicantSchema = new mongoose.Schema(
  {
    uli: {
      type: String,
      required: true,
      unique: true,
    },
    trainingCenterName: {
      type: String,
      required: true,
    },
    addressLocation: {
      type: String,
      required: true,
    },
    assessments: {
      type: [assessmentSchema], // Store multiple assessments with titles, types, and statuses
      required: false,
    },
    clientType: {
      type: String,
      enum: clientTypes,
      required: true,
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
      zipCode: {
        type: String,
        required: true,
      },
    },
    motherName: {
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
    fatherName: {
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
    contact: {
      telephoneNumber: {
        type: String,
        required: false,
      },
      mobileNumber: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
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
    highestEducationalAttainment: {
      type: String,
      enum: highestEducationalAttainments,
      required: true,
    },
    employmentStatus: {
      type: String,
      enum: employmentStatuses,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    birthplace: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    workExperience: {
      type: [workExperienceSchema],
      required: false,
    },
    trainingSeminarAttended: {
      type: [trainingSeminarAttendedSchema],
      required: false,
    },
    licensureExaminationPassed: {
      type: [licensureExaminationPassedSchema],
      required: false,
    },
    competencyAssessment: {
      type: [competencyAssessmentSchema],
      required: false,
    },
    role: {
      type: String,
      required: true,
      default: "client",
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

const Applicant = mongoose.model("DeletedApplicant", deletedApplicantSchema);

export default Applicant;
