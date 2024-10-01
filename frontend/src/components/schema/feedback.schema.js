import { z } from "zod";

// Feedback Validation Schema
export const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().int().positive("Age must be a positive integer"),
  sex: z.enum(["Male", "Female", "Other"]),
  address: z.string().min(1, "Address is required"),
  mobileNumber: z.string(),
  emailAddress: z.string().email("Invalid email address"),
  feedbackQuestions: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      rating: z.number().int().min(1).max(5),
    })
  ),
  recommendInstitution: z.boolean(),
  suggestion: z.string().optional(),
});
