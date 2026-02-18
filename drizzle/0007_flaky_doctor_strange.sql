CREATE TABLE "brand_decks" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"current_step" integer DEFAULT 0 NOT NULL,
	"intake" text,
	"identity" text,
	"audience" text,
	"voice" text,
	"visuals" text,
	"applications" text,
	"motion" text,
	"images" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "brand_decks_slug_idx" ON "brand_decks" USING btree ("slug");