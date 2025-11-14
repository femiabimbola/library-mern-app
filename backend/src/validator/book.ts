import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),

  author: z
    .string()
    .trim()
    .min(1, { message: "Author is required" })
    .min(2, { message: "Author name must be at least 2 characters long" })
    .max(100, { message: "Author name cannot exceed 100 characters" }),

  genre: z
    .string()
    .trim()
    .min(1, { message: "Genre is required" })
    .min(2, { message: "Genre must be at least 2 characters long" })
    .max(50, { message: "Genre cannot exceed 50 characters" }),

  rating: z.coerce
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating cannot exceed 5" }),

  totalCopies: z.coerce
    .number()
    .int({ message: "Total copies must be a whole number" })
    .positive({ message: "Total copies must be greater than 0" })
    .lte(10000, { message: "Total copies cannot exceed 10,000" }),

  coverUrl: z.string().url({ message: "Cover URL must be a valid URL" }).min(1, { message: "Cover URL is required" }),

  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i, {
      message: "Cover color must be a valid hex code (e.g., #FF5733)",
    })
    .min(1, { message: "Cover color is required" }),

  videoUrl: z.string().url({ message: "Video URL must be a valid URL" }).optional().or(z.literal("")),

  summary: z
    .string()
    .trim()
    .min(1, { message: "Summary is required" })
    .min(10, { message: "Summary must be at least 10 characters long" }),
});
