import { z } from "zod";
import dayjs from "dayjs";
import {
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  civilStatues,
  clientClassifications,
} from "../../components/utils/enums/registrant.enums";

const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  extension: z.string().optional(),
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

export const registrationSchema = z
  .object({
    // Account Details
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),

    // Personal Information
    name: nameSchema,
    sex: z.enum(["Male", "Female"], {
      required_error: "Sex is required",
    }),
    civilStatus: z.enum(civilStatues, {
      required_error: "Civil status is required",
    }),
    birthdate: z
      .string()
      .min(1, "Birthdate is required")
      .refine(
        (value) => {
          const age = dayjs().diff(dayjs(value), "year");
          return age >= 17;
        },
        {
          message: "You must be at least 17 years old to register.",
        }
      ),
    age: z.string().optional().or(z.number()),
    nationality: z.string().min(1, "Nationality is required"),
    birthplace: z.object({
      city: z.string().min(1, "City of birth is required"),
      province: z.string().min(1, "Province of birth is required"),
      region: z.string().min(1, "Region of birth is required"),
    }),

    // Contact & Address
    contact: z.object({
      telephoneNumber: z.string().optional(),
      mobileNumber: z.string().min(1, "Mobile number is required"),
      email: z.string().email("Invalid email address"),
      fax: z.string().optional(),
      others: z.string().optional(),
    }),
    completeMailingAddress: addressSchema,

    // Employment & Education
    employmentStatus: z.enum(employmentStatuses, {
      required_error: "Employment status is required",
    }),
    employmentType: z
      .enum(employmentTypes, {
        required_error: "Employment type is required",
      })
      .optional(),
    education: z.enum(educationalAttainments, {
      required_error: "Educational attainment is required",
    }),

    // Family Information
    motherName: nameSchema,
    fatherName: nameSchema,
    clientClassification: z.enum(clientClassifications, {
      required_error: "Client classification is required",
    }),
    otherClientClassification: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.employmentStatus === "Employed") {
        return !!data.employmentType;
      }
      return true;
    },
    {
      message:
        "Employment type is required when employment status is 'Employed'",
      path: ["employmentType"],
    }
  )
  .refine(
    (data) => {
      if (data.clientClassification === "Other") {
        return !!data.otherClientClassification;
      }
      return true;
    },
    {
      message: "Please specify the other client classification",
      path: ["otherClientClassification"],
    }
  );
