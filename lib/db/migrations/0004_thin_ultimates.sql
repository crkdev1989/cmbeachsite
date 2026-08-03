CREATE TABLE "job_categories" (
	"job_id" uuid NOT NULL,
	"category" "job_category" NOT NULL,
	CONSTRAINT "job_categories_job_id_category_pk" PRIMARY KEY("job_id","category")
);
--> statement-breakpoint
ALTER TABLE "job_categories" ADD CONSTRAINT "job_categories_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "job_categories" ("job_id", "category") SELECT "id", "category" FROM "jobs" WHERE "category" IS NOT NULL ON CONFLICT DO NOTHING;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "category";