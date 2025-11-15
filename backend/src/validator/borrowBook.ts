import { z } from "zod";

//  userId, bookId
export const borrwBookSchema = z.object({
  userId: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  bookId: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),
});
