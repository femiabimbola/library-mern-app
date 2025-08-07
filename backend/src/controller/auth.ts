import { Request, Response, NextFunction } from "express";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";
import { db } from "../database/connectdb";
import { hash, compare } from "bcryptjs";
import Passport from "passport";

export const createUser = async (
  req: Request, res: any, next: NextFunction
) => {
  const { fullName, email, password, universityCard, universityId } = req.body;

  try {
   
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) return res.status(401).send({ message: "User already exist" });
    const hashedPassword = await hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        fullName, email, password: hashedPassword, universityCard, universityId,
      });

    return res.status(201).send({ msg: "You have successfully created" });
  } catch (error) {
    return res.status(404).send({ msg: "Could not create user" });
  }
};

export const loginUser = async ( req: Request, res: any, next: NextFunction) => {
  return res.status(201).send({msg: "successfully log in"});
}


export const PassportLocal = (req: Request, res: Response, next: NextFunction) => {
  
  Passport.authenticate('local', (err: any, user: any, info: { message?: string }) => {

    if (err)  return next(err); // Handle errors (e.g., database issues)
    
    if (!user) {
      // Authentication failed, return the specific error message
      return res.status(401).json({ message: info.message || 'Authentication failed' });
    }
    // Authentication succeeded, log the user in
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.status(201).json({ msg: 'Successfully logged in', user });
    });
  })(req, res, next);
};