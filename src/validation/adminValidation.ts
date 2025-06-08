import { z } from "zod";

export const adminValidation = z.object({
  userName: z.string().min(1, "Username is required"),
  userEmail: z.string().email("Invalid email format"),
  userPassword: z
    .string()
    .min(8, "Password must be minimum 8 characters")
    .max(20, "Password cannot exceed more than 20 characters"),
  userContact: z
    .string()
    .min(10, "Contact number should be 10 characters")
    .max(10, "Contact number cannot exceed more than 10 characters"),
});

export const staffValidation = z.object({
  userName: z.string().min(1, "Username is required"),
  userEmail: z.string().email("Invalid email format"),
  userDesignation: z.string({
    required_error: "Designation is required",
    invalid_type_error: "Designation must be string",
  }),
  userExperience: z.coerce.number({
    required_error: "Experience is required",
    invalid_type_error: "Experience must be a number",
  }),
  staffImage: z.string().optional(),
});
