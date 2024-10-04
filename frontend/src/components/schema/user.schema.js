import { z } from "zod";

export const registrationSchema = z
  .object({
    uli: z
      .string()
      .regex(/^[A-Z]{3}-\d{2}-\d{3}-03907-001$/, "Invalid ULI format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
