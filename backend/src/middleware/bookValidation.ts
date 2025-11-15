import { Request, Response, NextFunction } from "express";
import { bookSchema } from "../validator/book";

// Middleware to validate sign-up request body
export const validateBook = (req: Request, res: Response, next: NextFunction): void => {
  const result = bookSchema.safeParse(req.body);

  if (!result.success) {
    // Send response without returning it
    res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return; // Explicitly return void
  }

  // Attach validated data to request for use in route handler
  req.body = result.data;
  next();
};
