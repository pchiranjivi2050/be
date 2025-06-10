"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffValidation = exports.adminValidation = void 0;
const zod_1 = require("zod");
exports.adminValidation = zod_1.z.object({
    userName: zod_1.z.string().min(1, "Username is required"),
    userEmail: zod_1.z.string().email("Invalid email format"),
    userPassword: zod_1.z
        .string()
        .min(8, "Password must be minimum 8 characters")
        .max(20, "Password cannot exceed more than 20 characters"),
    userContact: zod_1.z
        .string()
        .min(10, "Contact number should be 10 characters")
        .max(10, "Contact number cannot exceed more than 10 characters"),
});
exports.staffValidation = zod_1.z.object({
    userName: zod_1.z.string().min(1, "Username is required"),
    userEmail: zod_1.z.string().email("Invalid email format"),
    userDesignation: zod_1.z.string({
        required_error: "Designation is required",
        invalid_type_error: "Designation must be string",
    }),
    userExperience: zod_1.z.coerce.number({
        required_error: "Experience is required",
        invalid_type_error: "Experience must be a number",
    }),
    staffImage: zod_1.z.string().optional(),
});
