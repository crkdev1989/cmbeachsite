import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  date,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const jobCategoryEnum = pgEnum("job_category", [
  "Mass Grading",
  "Fine Grading",
  "Site Utilities",
  "Demolition",
  "Clean Up",
  "Snow Removal",
  "Other",
]);

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: jobCategoryEnum("category").notNull(),
  location: text("location"),
  jobDate: date("job_date").notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const mediaTypeEnum = pgEnum("media_type", ["photo", "video"]);

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  type: mediaTypeEnum("type").notNull(),
  storageUrl: text("storage_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  caption: text("caption"),
  displayOrder: integer("display_order").notNull().default(0),
  uploadedBy: uuid("uploaded_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const applicationPositionEnum = pgEnum("application_position", [
  "Utility",
  "Mass Grading",
  "Fine Grading",
  "Demolition",
  "Equipment Operator",
  "General Labor",
  "Other",
]);

export const availabilityEnum = pgEnum("availability", [
  "Full-time",
  "Part-time",
  "Seasonal",
]);

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  position: applicationPositionEnum("position").notNull(),
  yearsExperience: varchar("years_experience", { length: 50 }).notNull(),
  experienceDescription: text("experience_description").notNull(),
  hasLicense: boolean("has_license").notNull(),
  hasCdl: boolean("has_cdl").notNull(),
  availability: availabilityEnum("availability").notNull(),
  notes: text("notes"),
  // Stores the R2 object key, not a permanent public URL — resumes contain
  // applicant PII, so the bucket stays private and download links are
  // generated as short-lived presigned URLs on demand (see lib/storage/r2.ts).
  resumeUrl: text("resume_url").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  projectType: jobCategoryEnum("project_type").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
