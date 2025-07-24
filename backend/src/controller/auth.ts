import { Request, Response, NextFunction } from "express";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";
import { db } from "../database/connectdb";

export const createUser = async (
  req: Request, res: any, next: NextFunction
) => {
  const { fullName, email, password, universityCard, universityId} = req.body
  try {
    const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  } catch (error) {
    
  }
}