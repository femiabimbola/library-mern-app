import { pgTable,  integer, text, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  universityId: integer("university_id").notNull(),
  universityCard: text("university_card").notNull(),
  password: text("password").notNull(),
  role: text("role").default("USER"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})