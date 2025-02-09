import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("specialties").default(sql`'[]'::jsonb`).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  cityIdx: uniqueIndex("city_idx").on(table.city),
  lastNameIdx: uniqueIndex("last_name_idx").on(table.lastName),
  uniqueFullNameCity: uniqueIndex("unique_full_name_city").on(table.firstName, table.lastName, table.city),
  checkYearsOfExperience: sql`CHECK (years_of_experience >= 0)`,
  checkNonEmptyFirstName: sql`CHECK (char_length(first_name) > 0)`,
  checkNonEmptyLastName: sql`CHECK (char_length(last_name) > 0)`,
  checkNonEmptyCity: sql`CHECK (char_length(city) > 0)`,
  checkNonEmptyDegree: sql`CHECK (char_length(degree) > 0)`,
}));


export { advocates };
