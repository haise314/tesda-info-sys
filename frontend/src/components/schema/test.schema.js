import { z } from "zod";

// Test Validation Schema
export const testSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  instruction: z.string().min(1, "Instruction is required"),
  questions: z
    .array(
      z.object({
        questionText: z.string().min(1, "Question text is required"),
        options: z
          .array(
            z.object({
              text: z.string().min(1, "Option text is required"),
              isCorrect: z.boolean(),
            })
          )
          .length(4, "Exactly 4 options are required"),
      })
    )
    .min(1, "At least one question is required"),
});
