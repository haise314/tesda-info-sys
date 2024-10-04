// validations/trainingProgramValidation.js
import { z } from "zod";

export const trainingProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  duration: z.number().min(1, "Duration should be at least 1 hour"),
  qualificationLevel: z.string().min(1, "Qualification level is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  trainer: z.string().min(1, "Trainer is required"),
  slotsAvailable: z.number().min(1, "At least one slot must be available"),
  scholarshipAvailable: z.boolean(),
});
