ALTER TABLE "event_checkins" ADD COLUMN "event_name" varchar(255) DEFAULT 'general' NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX "checkin_email_event_idx" ON "event_checkins" USING btree ("email","event_name");
