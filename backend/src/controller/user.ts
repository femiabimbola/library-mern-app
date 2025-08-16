import { Request, Response, NextFunction } from "express";


// Endpoint to get the authenticated user's data
export const getUser = async ( req: Request, res: any, next: NextFunction) => {
  if (req.user) {
    // Return user data if authenticated
    res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.fullName, // Adjust based on your user model
        email: req.user.email,
      },
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
}
