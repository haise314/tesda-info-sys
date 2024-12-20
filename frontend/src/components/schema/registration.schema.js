import { z } from "zod";
import {
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  clientClassifications,
  disabilityTypes,
  disabilityCauses,
  scholarTypes,
  civilStatues,
} from "../utils/enums/registrant.enums.js";

// TODO: conditional validation when employmentStatus is Wage-Employed or Underemployed
const employmentTypeSchema = z.discriminatedUnion("employmentStatus", [
  z.object({
    employmentStatus: z.literal("Wage-Employed"),
    employmentType: z.enum(employmentTypes, {
      message: "Please select a valid employment type.",
    }),
  }),
  z.object({
    employmentStatus: z.literal("Underemployed"),
    employmentType: z.enum(employmentTypes, {
      message: "Please select a valid employment type.",
    }),
  }),
  z.object({
    employmentStatus: z.literal("Unemployed"),
  }),
  z.object({
    employmentStatus: z.literal("Self-Employed"),
  }),
]);

const clientClassificationSchema = z.discriminatedUnion(
  "clientClassification",
  [
    z.object({
      clientClassification: z.enum(
        clientClassifications.filter((c) => c !== "Others")
      ),
    }),
    z.object({
      clientClassification: z.literal("Others"),
      otherClientClassification: z
        .string()
        .min(1, { message: "Please specify the other classification" }),
    }),
  ]
);

const scholarTypeSchema = z
  .object({
    hasScholarType: z.boolean(), // Checkbox to determine if a scholar type is needed
    scholarType: z
      .enum(
        scholarTypes.filter((s) => s !== "Others"),
        {
          errorMap: () => ({ message: "Please select a valid scholar type." }),
        }
      )
      .optional(),
    otherScholarType: z
      .string()
      .min(1, { message: "Please specify the other scholar type" })
      .optional(),
  })
  .refine(
    (data) =>
      data.hasScholarType === false || // Scholar type isn't required if the checkbox is false
      (data.scholarType && data.scholarType !== "Others") || // Scholar type is required if checkbox is true and scholar type isn't "Others"
      (data.scholarType === "Others" && data.otherScholarType), // Require otherScholarType if "Others" is selected
    {
      message: "Please select a scholar type or specify if it's 'Others'.",
      path: ["scholarType"],
    }
  );

const registrantSchema = z
  .object({
    name: z.object({
      firstName: z.string().min(1, { message: "First name is required" }),
      middleName: z.string().optional(),
      lastName: z.string().min(1, { message: "Last name is required" }),
      extension: z.string().optional(),
    }),
    completeMailingAddress: z.object({
      street: z.string().min(1, { message: "Street is required" }),
      barangay: z.string().min(1, { message: "Barangay is required" }),
      district: z.string().min(1, { message: "District is required" }),
      city: z.string().min(1, { message: "City is required" }),
      province: z.string().min(1, { message: "Province is required" }),
      region: z.string().min(1, { message: "Region is required" }),
    }),
    contact: z.object({
      email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(1, { message: "Email is required" }),
      mobileNumber: z.string().min(1, { message: "Mobile number is required" }),
    }),
    personalInformation: z.object({
      sex: z.enum(["Male", "Female", "Others"], {
        errorMap: () => ({ message: "Please select one." }),
      }),
      civilStatus: z.enum(civilStatues, {
        errorMap: () => ({ message: "Please select a valid civil status." }),
      }),
      nationality: z.string().min(1, { message: "Nationality is required" }),
      birthdate: z
        .date()
        .refine((date) => date !== null, { message: "Birthdate is required" }),
      age: z.number().min(0, { message: "Age must be a positive number" }),
      birthplace: z.object({
        city: z.string().min(1, { message: "City of birth is required" }),
        province: z
          .string()
          .min(1, { message: "Province of birth is required" }),
        region: z.string().min(1, { message: "Region of birth is required" }),
      }),
    }),
    education: z.enum(educationalAttainments, {
      errorMap: () => ({
        message: "Please select a valid educational attainment.",
      }),
    }),
    parent: z.object({
      name: z.object({
        firstName: z
          .string()
          .min(1, { message: "Parent's first name is required" }),
        middleName: z.string().optional(),
        lastName: z
          .string()
          .min(1, { message: "Parent's last name is required" }),
      }),
      completeMailingAddress: z.object({
        street: z.string().min(1, { message: "Street is required" }),
        barangay: z.string().min(1, { message: "Barangay is required" }),
        district: z.string().min(1, { message: "District is required" }),
        city: z.string().min(1, { message: "City is required" }),
        province: z.string().min(1, { message: "Province is required" }),
        region: z.string().min(1, { message: "Region is required" }),
      }),
    }),
    clientClassification: z.enum(clientClassifications, {
      errorMap: () => ({ message: "Please select a valid classification." }),
    }),
    course: z.string().min(1, { message: "Course is required" }),
    hasScholarType: z.boolean(),
    employmentStatus: z
      .string()
      .min(1, { message: "Employment status is required zod" }),
  })
  .and(scholarTypeSchema)
  .and(employmentTypeSchema)
  .and(clientClassificationSchema);

// Default values can be defined as follows:
const registrantDefaultValues = {
  name: {
    firstName: "",
    middleName: "",
    lastName: "",
    extension: "",
  },
  completeMailingAddress: {
    street: "",
    barangay: "",
    district: "",
    city: "",
    province: "",
    region: "",
  },
  contact: {
    email: "",
    mobileNumber: "",
  },
  personalInformation: {
    sex: "", // Default value or could be optional based on your requirements
    civilStatus: "", // Default value or could be optional based on your requirements
    nationality: "",
    birthdate: null,
    age: "",
    birthplace: {
      city: "",
      province: "",
      region: "",
    },
  },
  education: "",
  employmentStatus: "", // CHECK
  employmentType: "",
  parent: {
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    completeMailingAddress: {
      street: "",
      barangay: "",
      district: "",
      city: "",
      province: "",
      region: "",
    },
  },
  clientClassification: "", // Default value
  course: "",
  hasScholarType: false,
};

export { registrantSchema, registrantDefaultValues };
