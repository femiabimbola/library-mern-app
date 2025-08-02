import { eq } from "drizzle-orm";
import { db } from "../database/connectdb";
import { users } from "../database/schema"; // Assuming your schema is defined here

export const findAUserByEmail = async (email: string) => {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Return the first user if found, otherwise null
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null; // or throw the error depending on your use case
  }
};

export const findAUserByID = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    // Return the first user if found, otherwise null
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null; // or throw the error depending on your use case
  }
};