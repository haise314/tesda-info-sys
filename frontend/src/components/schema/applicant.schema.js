import { z } from "zod";
import {
  assessmentTypes,
  clientTypes,
  highestEducationalAttainments,
  employmentStatuses,
  civilStatues,
} from "../utils/applicant.enums.js";

const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional().default(""),
  lastName: z.string().min(1, "Last name is required"),
  extension: z.string().optional().default(""),
});

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  region: z.string().min(1, "Region is required"),
  zipCode: z.string().min(1, "Zip code is required"),
});

const contactSchema = z.object({
  telephoneNumber: z.string().optional(),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  fax: z.string().optional(),
  others: z.string().optional(),
});

const workExperienceSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  inclusiveDates: z.object({
    from: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),
    to: z.date({
      required_error: "End date is required",
      invalid_type_error: "End date must be a valid date",
    }),
  }),
  monthlySalary: z.number().positive("Monthly salary must be positive"),
  appointmentStatus: z.string().min(1, "Appointment status is required"),
  noOfYearsInWork: z.number().positive("Number of years must be positive"),
});

const trainingSeminarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  venue: z.string().min(1, "Venue is required"),
  inclusiveDates: z.object({
    from: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),
    to: z.date({
      required_error: "End date is required",
      invalid_type_error: "End date must be a valid date",
    }),
  }),
  numberOfHours: z.number().positive("Number of hours must be positive"),
  conductedBy: z.string().min(1, "Conducted by is required"),
});

const licensureExaminationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dateOfExamination: z.date({
    required_error: "Date of examination is required",
    invalid_type_error: "Date of examination must be a valid date",
  }),
  examinationVenue: z.string().min(1, "Examination venue is required"),
  rating: z.number().positive("Rating must be positive"),
  remarks: z.string().min(1, "Remarks is required"),
  expiryDate: z.date({
    required_error: "Expiry date is required",
    invalid_type_error: "Expiry date must be a valid date",
  }),
});

const competencyAssessmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  qualificationLevel: z.string().min(1, "Qualification level is required"),
  industrySector: z.string().min(1, "Industry sector is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
  dateIssued: z.date({
    required_error: "Date issued is required",
    invalid_type_error: "Date issued must be a valid date",
  }),
  expirationDate: z.date({
    required_error: "Expiration date is required",
    invalid_type_error: "Expiration date must be a valid date",
  }),
});

export const applicantSchema = z.object({
  trainingCenterName: z.string().min(1, "Training center name is required"),
  addressLocation: z.string().min(1, "Address location is required"),
  assessmentTitle: z.string().min(1, "Assessment title is required"),
  assessmentType: z.enum(assessmentTypes),
  clientType: z.enum(clientTypes),
  name: nameSchema,
  completeMailingAddress: addressSchema,
  motherName: nameSchema,
  fatherName: nameSchema,
  sex: z.enum(["Male", "Female", "Others"]),
  civilStatus: z.enum(civilStatues),
  contact: contactSchema,
  highestEducationalAttainment: z.enum(highestEducationalAttainments),
  employmentStatus: z.enum(employmentStatuses),
  birthdate: z.date(),
  birthplace: z.string().min(1, "Birthplace is required"),
  age: z.number().positive("Age must be positive"),
  workExperience: z.array(workExperienceSchema),
  trainingSeminarAttended: z.array(trainingSeminarSchema),
  licensureExaminationPassed: z.array(licensureExaminationSchema),
  competencyAssessment: z.array(competencyAssessmentSchema),
});

export const applicantDefaultValues = {
  trainingCenterName: "",
  addressLocation: "",
  assessmentTitle: "",
  assessmentType: "", // Assuming first item as default
  clientType: "", // Assuming first item as default
  name: {
    firstName: "",
    middleName: "", // Optional, so default to an empty string
    lastName: "",
    extension: "", // Optional
  },
  completeMailingAddress: {
    street: "",
    barangay: "",
    district: "",
    city: "",
    province: "",
    region: "",
    zipCode: "",
  },
  motherName: {
    firstName: "",
    middleName: "",
    lastName: "",
    extension: "",
  },
  fatherName: {
    firstName: "",
    middleName: "",
    lastName: "",
    extension: "",
  },
  sex: "", // Assuming "Male" as default
  civilStatus: "", // Assuming first item as default
  contact: {
    telephoneNumber: "",
    mobileNumber: "",
    email: "",
    fax: "",
    others: "",
  },
  highestEducationalAttainment: "", // Assuming first item as default
  employmentStatus: "", // Assuming first item as default
  birthdate: "", // Defaulting to current date
  birthplace: "",
  age: 0,
  workExperience: [
    {
      companyName: "",
      position: "",
      inclusiveDates: { from: "", to: "" },
      monthlySalary: 0,
      appointmentStatus: "",
      noOfYearsInWork: 0,
    },
  ],
  trainingSeminarAttended: [
    {
      title: "",
      venue: "",
      inclusiveDates: { from: "", to: "" },
      numberOfHours: 0,
      conductedBy: "",
    },
  ],
  licensureExaminationPassed: [
    {
      title: "",
      dateOfExamination: "",
      examinationVenue: "",
      rating: 0,
      remarks: "",
      expiryDate: "",
    },
  ],
  competencyAssessment: [
    {
      title: "",
      qualificationLevel: "",
      industrySector: "",
      certificateNumber: "",
      dateIssued: "",
      expirationDate: "",
    },
  ],
};
