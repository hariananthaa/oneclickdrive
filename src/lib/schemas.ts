import { z } from "zod";

export const editCarSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  year: z
    .number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  category: z.enum([
    "SUV",
    "Sedan",
    "Hatchback",
    "Coupe",
    "Convertible",
    "Truck",
    "Van",
  ]),
  dailyRate: z.number().min(0, "Daily rate must be positive"),
  monthlyRate: z.number().min(0, "Monthly rate must be positive"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["approved", "pending", "rejected"]),
  isPremium: z.boolean(),
  availableForRent: z.boolean(),
});

export type EditCarFormData = z.infer<typeof editCarSchema>;
