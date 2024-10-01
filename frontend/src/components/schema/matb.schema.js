import { z } from "zod";

// Define the schema for the form
export const answerSheetSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleInitial: z.string().max(1).optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.number().min(0, "Age must be a positive number"),
  sex: z.enum(["male", "female", "other"]),
  civilStatus: z.string().min(1, "Civil status is required"),
  highestEducationalAttainment: z
    .string()
    .min(1, "Highest educational attainment is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
  school: z.string().min(1, "School is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  date: z.string().min(1, "Date is required"),
  testId: z.string().min(1, "Test ID is required"),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOption: z.string(),
    })
  ),
});

export const answerSheetDefaultValues = {
  firstName: "",
  lastName: "",
  middleInitial: "",
  dateOfBirth: "",
  age: "",
  sex: "",
  civilStatus: "",
  highestEducationalAttainment: "",
  contactNumber: "",
  address: "",
  school: "",
  qualifications: "",
  date: new Date().toISOString().split("T")[0],
  testId: testId,
  answers: [],
};
