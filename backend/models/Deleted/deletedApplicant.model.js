import mongoose from "mongoose";
import {
  assessmentTypes,
  civilStatues,
  clientTypes,
  employmentStatuses,
  highestEducationalAttainments,
  applicationStatuses,
} from "../../utils/applicant.enums.js";

// Define schemas for work experience, training, licensure, and competency as used in Applicant
const workExperienceSchema = new mongoose.Schema({
  companyName: String,
  position: String,
  inclusiveDates: {
    from: Date,
    to: Date,
  },
  monthlySalary: {
    type: Number,
    min: 0,
  },
  appointmentStatus: String,
  noOfYearsInWork: Number,
});

const trainingSeminarAttendedSchema = new mongoose.Schema({
  title: String,
  venue: String,
  inclusiveDates: {
    from: Date,
    to: Date,
  },
  numberOfHours: {
    type: Number,
    min: 0,
  },
  conductedBy: String,
});

const licensureExaminationPassedSchema = new mongoose.Schema({
  title: String,
  dateOfExamination: Date,
  examinationVenue: String,
  rating: {
    type: Number,
    min: 0,
  },
  remarks: String,
  expiryDate: Date,
});

const competencyAssessmentSchema = new mongoose.Schema({
  title: String,
  qualificationLevel: String,
  industrySector: String,
  certificateNumber: String,
  dateIssued: Date,
  expirationDate: Date,
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
    assessmentTitle: {
      type: String,
      required: true,
    },
    assessmentType: {
      type: String,
      enum: assessmentTypes,
      required: true,
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
        default: "",
      },
      lastName: {
        type: String,
        required: true,
      },
      extension: {
        type: String,
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
        default: "",
      },
      lastName: {
        type: String,
        required: true,
      },
      extension: {
        type: String,
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
        default: "",
      },
      lastName: {
        type: String,
        required: true,
      },
      extension: {
        type: String,
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
      telephoneNumber: String,
      mobileNumber: String,
      email: String,
      fax: String,
      others: String,
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
    workExperience: [workExperienceSchema],
    trainingSeminarAttended: [trainingSeminarAttendedSchema],
    licensureExaminationPassed: [licensureExaminationPassedSchema],
    competencyAssessment: [competencyAssessmentSchema],
    role: {
      type: String,
      required: true,
      default: "client",
    },
    applicationStatus: {
      type: String,
      enum: applicationStatuses,
      required: false,
      default: "For Approval",
    },
    // Additional fields for deletion tracking
    deletedAt: {
      type: Date,
      default: Date.now,
    },
    deletedBy: {
      type: String,
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
