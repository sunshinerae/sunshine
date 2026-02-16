CREATE TABLE "sponsor_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"sponsor_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"sponsor_id" integer NOT NULL,
	"package_id" integer,
	"deal_value" integer NOT NULL,
	"in_kind_value" integer DEFAULT 0 NOT NULL,
	"in_kind_description" text,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"suggested_value" integer,
	"benefits" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(50),
	"website" text,
	"instagram" varchar(100),
	"category" varchar(100),
	"location" varchar(255),
	"stage" varchar(50) DEFAULT 'prospect' NOT NULL,
	"starred" boolean DEFAULT false NOT NULL,
	"brand_fit_score" integer,
	"brand_fit_rationale" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_contacted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "sponsor_activities" ADD CONSTRAINT "sponsor_activities_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_deals" ADD CONSTRAINT "sponsor_deals_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_deals" ADD CONSTRAINT "sponsor_deals_package_id_sponsor_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."sponsor_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sponsor_activities_sponsor_id_idx" ON "sponsor_activities" USING btree ("sponsor_id");--> statement-breakpoint
CREATE INDEX "sponsor_deals_sponsor_id_idx" ON "sponsor_deals" USING btree ("sponsor_id");--> statement-breakpoint
CREATE INDEX "person_notes_person_id_idx" ON "person_notes" USING btree ("person_id");