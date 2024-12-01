import { z } from "zod";
import {
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  civilStatues,
  clientClassifications,
} from "../utils/enums/registrant.enums.js";

export const userEditSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  extension: z.string().optional(),

  // Contact Information
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(10, "Mobile number is required"),
  telephoneNumber: z.string().optional(),

  // Address Information
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  region: z.string().min(1, "Region is required"),
  zipCode: z.string().min(4, "Zip code is required"),

  // Additional Details
  nationality: z.string().min(1, "Nationality is required"),
  sex: z.enum(["Male", "Female"], "Sex must be Male or Female"),
  civilStatus: z.enum(civilStatues, "Invalid civil status"),
  birthdate: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), "Invalid date"),
  age: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Age must be positive"),

  // Employment and Classification
  employmentStatus: z.enum(employmentStatuses, "Invalid employment status"),
  employmentType: z.enum(employmentTypes, "Invalid employment type"),
  education: z.enum(educationalAttainments, "Invalid education level"),
  clientClassification: z.enum(
    clientClassifications,
    "Invalid client classification"
  ),

  // Role (for admin editing)
  role: z.enum(["client", "admin", "superadmin"]).optional(),
  updatedBy: z.string().optional(),
});
