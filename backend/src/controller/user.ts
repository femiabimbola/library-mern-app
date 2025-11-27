import { Request, Response, NextFunction } from "express";
import { AppUser } from "../../types/express";

// Endpoint to get the authenticated user's data

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user: AppUser = req.user as AppUser; // Type assertion
    res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        universityId: user.universityId,
        universityCard: user.universityCard,
        role: user.role,
        lastActivityDate: user.lastActivityDate,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};
