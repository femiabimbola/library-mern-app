import { Request, Response, NextFunction } from "express";
import { signUpSchema } from "../validator/auth";

// Middleware to validate sign-up request body
export const validateSignUp = (req: Request, res: Response, next: NextFunction): void => {
  const result = signUpSchema.safeParse(req.body);
  
  if (!result.success) {
    // Send response without returning it
    res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map(issue => ({
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