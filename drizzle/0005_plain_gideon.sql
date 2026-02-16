CREATE TABLE "prospects" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(50),
	"website" text,
	"instagram" varchar(100),
	"category" varchar(100),
	"location" varchar(255),
	"relevance_score" integer,
	"ai_rationale" text,
	"suggested_outreach" text,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"source" text,
	"converted_to_sponsor_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_converted_to_sponsor_id_sponsors_id_fk" FOREIGN KEY ("converted_to_sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE no action ON UPDATE no action;