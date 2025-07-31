import { Request, Response, NextFunction } from "express";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";
import { db } from "../database/connectdb";
import { hash, compare } from "bcryptjs";

export const createUser = async ( req: Request, res: any, next: NextFunction
) => {

  const { fullName, email, password, universityCard, universityId} = req.body

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) { }
    const hashedPassword = await hash(password, 10);
    return res.status(201).send({ msg: "You have successfully created" });
  } catch (error) {
    return res.status(201).send({ msg: "Could not create user" });
  }
}