import { z } from "zod";

export const citizensCharterSchema = z.object({
  region: z.string().nonempty("Region is required"),
  office: z.string().nonempty("Office is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  name: z.string().nonempty("Name is required"),
  gender: z.string().nonempty("Gender is required"),
  age: z
    .number()
    .positive("Age must be a positive number")
    .min(1, "Age is required"),
  citizenCharterServiceType: z.string().nonempty("Service type is required"),
  clientType: z.string().nonempty("Client type is required"),
  transactionType: z.enum([
    "Assessment at Certification",
    "Program Registration",
    "Training",
    "Scholarship",
    "administrative",
    "Others",
  ]),
  citizenCharterKnowledge: z.string().nonempty("This field is required"),
  serviceQualityDimensions: z.object({
    satisfaction: z.string().nonempty("Satisfaction is required"),
    processingTime: z.string().nonempty("Processing time is required"),
    documentCompliance: z.string().nonempty("Document compliance is required"),
    processSimplicity: z.string().nonempty("Process simplicity is required"),
    informationAccessibility: z
      .string()
      .nonempty("Information accessibility is required"),
    transactionCost: z.string().nonempty("Transaction cost is required"),
    fairness: z.string().nonempty("Fairness is required"),
    staffRespect: z.string().nonempty("Staff respect is required"),
    serviceDelivery: z.string().nonempty("Service delivery is required"),
  }),
  suggestions: z.string().optional(),
  employeeName: z.string().optional(),
});
