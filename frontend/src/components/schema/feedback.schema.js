import { z } from "zod";

// Feedback Validation Schema
export const feedbackSchema = z.object({
  name: z.string().optional(),
  age: z.union([z.number(), z.string()]).optional(),
  sex: z.enum(["Male", "Female", "Other", ""]).optional(),
  address: z.string().optional(),
  mobileNumber: z.string().optional(),
  emailAddress: z.string().optional(),
  feedbackQuestions: z.array(
    z.object({
      question: z.string(),
      rating: z.number().int().min(1).max(5),
    })
  ),
  recommendInstitution: z.boolean().optional(),
  suggestion: z.string().optional(),
});
