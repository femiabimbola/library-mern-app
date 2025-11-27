import { Request, Response, NextFunction } from "express";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";
import { db } from "../database/connectdb";
import { hash, compare } from "bcryptjs";
import Passport from "passport";

export const createUser = async (req: Request, res: any, next: NextFunction) => {
  const { fullName, email, password, universityCard, universityId } = req.body;

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) return res.status(401).send({ message: "User already exist" });
    const hashedPassword = await hash(password, 10);

    const newUser = await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
      universityCard,
      universityId,
    });

    return res.status(201).send({ msg: "You have successfully created" });
  } catch (error) {
    return res.status(404).send({ msg: "Could not create user" });
  }
};

export const PassportLocal = (req: Request, res: Response, next: NextFunction) => {
  Passport.authenticate("local", (err: any, user: any, info: { message?: string }) => {
    if (err) return next(err); // Handle errors (e.g., database issues)

    if (!user) {
      return res.status(401).json({ message: info.message || "Authentication failed" });
    }
    // Authentication succeeded, log the user in
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.status(201).json({ msg: "Successfully logged in", user });
    });
  })(req, res, next);
};

export const logOut = (req: Request, res: Response, next: NextFunction) => {
  console.log("Logout route hit");

  // 1. Passport Logout: Removes req.user and clears login session
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed during passport cleanup" });
    }

    // 2. Destroy Session: Removes the session data from the store (Redis/Mongo/Memory)
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return res.status(500).json({ message: "Logout failed during session destruction" });
      }

      // 3. Clear Cookie: Tells the browser to delete the session cookie
      // IMPORTANT: 'connect.sid' is the default name
      res.clearCookie("connect.sid", { path: "/" });

      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
