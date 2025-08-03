import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .nonempty({ message: "Full name is required" }),
  email: z.email({ message: "Invalid email format" }).nonempty({ message: "Email is required" }),
  universityId: z.coerce.number().positive({ message: "University ID must be a positive number" }),
  universityCard: z.string()
    .nonempty({ message: "University card ID is required" })
    .min(5, { message: "University card ID must be at least 5 characters long" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .nonempty({ message: "Password is required" }),
});

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email format" }).nonempty({ message: "Email is required" }),
  password: z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .nonempty({ message: "Password is required" }),
})