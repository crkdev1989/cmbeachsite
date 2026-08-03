CREATE TYPE "public"."application_position" AS ENUM('Utility', 'Mass Grading', 'Fine Grading', 'Demolition', 'Equipment Operator', 'General Labor', 'Other');--> statement-breakpoint
CREATE TYPE "public"."availability" AS ENUM('Full-time', 'Part-time', 'Seasonal');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"position" "application_position" NOT NULL,
	"years_experience" varchar(50) NOT NULL,
	"experience_description" text NOT NULL,
	"has_license" boolean NOT NULL,
	"has_cdl" boolean NOT NULL,
	"availability" "availability" NOT NULL,
	"notes" text,
	"resume_url" text NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
