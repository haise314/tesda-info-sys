import mongoose from "mongoose";
import {
  applicationStatuses,
  assessmentTypes,
} from "../utils/applicant.enums.js";

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

const applicantSchema = new mongoose.Schema(
  {
    uli: {
      type: String,
      required: true,
      ref: "User", // Reference to User model
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
      type: [assessmentSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one assessment must be provided.",
      },
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
    updatedBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Applicant = mongoose.model("Applicant", applicantSchema);
export default Applicant;
