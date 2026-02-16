import { pgTable, serial, text, timestamp, varchar, uniqueIndex, index, boolean, integer } from 'drizzle-orm/pg-core';

// Contact form submissions
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Newsletter and other subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // newsletter, sms, glow-notes, guide, waitlist, launch
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Prevent duplicate email+type combinations
  emailTypeIdx: uniqueIndex('email_type_idx').on(table.email, table.type),
}));

// Event check-ins (QR code sign-in at events)
export const eventCheckins = pgTable('event_checkins', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  eventName: varchar('event_name', { length: 255 }).notNull(),
  checkedInAt: timestamp('checked_in_at').defaultNow().notNull(),
}, (table) => ({
  checkinEmailEventIdx: uniqueIndex('checkin_email_event_idx').on(table.email, table.eventName),
}));

// ─── Admin Tool: "Know Your People" ─────────────────────────────

// Master person record — deduplicated by email across all tables
export const people = pgTable('people', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  photoUrl: text('photo_url'),
  starred: boolean('starred').default(false).notNull(),
  lastReachedOut: timestamp('last_reached_out'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('people_email_idx').on(table.email),
}));

// Free-form notes attached to a person
export const personNotes = pgTable('person_notes', {
  id: serial('id').primaryKey(),
  personId: integer('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  personIdIdx: index('person_notes_person_id_idx').on(table.personId),
}));

// Tag library — freeform, created on the fly
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  nameIdx: uniqueIndex('tags_name_idx').on(table.name),
}));

// Many-to-many: people ↔ tags
export const personTags = pgTable('person_tags', {
  id: serial('id').primaryKey(),
  personId: integer('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  personTagIdx: uniqueIndex('person_tag_idx').on(table.personId, table.tagId),
}));

// ─── Admin Tool: Sponsor Management ─────────────────────────────

// Sponsorship tiers / packages
export const sponsorPackages = pgTable('sponsor_packages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  suggestedValue: integer('suggested_value'),
  benefits: text('benefits'), // JSON array of benefit strings
  isActive: boolean('is_active').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Main sponsor record
export const sponsors = pgTable('sponsors', {
  id: serial('id').primaryKey(),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  website: text('website'),
  instagram: varchar('instagram', { length: 100 }),
  category: varchar('category', { length: 100 }),
  location: varchar('location', { length: 255 }),
  stage: varchar('stage', { length: 50 }).default('prospect').notNull(),
  starred: boolean('starred').default(false).notNull(),
  brandFitScore: integer('brand_fit_score'),
  brandFitRationale: text('brand_fit_rationale'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastContactedAt: timestamp('last_contacted_at'),
});

// Sponsor interaction timeline
export const sponsorActivities = pgTable('sponsor_activities', {
  id: serial('id').primaryKey(),
  sponsorId: integer('sponsor_id').notNull().references(() => sponsors.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  sponsorIdIdx: index('sponsor_activities_sponsor_id_idx').on(table.sponsorId),
}));

// Confirmed sponsorship deals
export const sponsorDeals = pgTable('sponsor_deals', {
  id: serial('id').primaryKey(),
  sponsorId: integer('sponsor_id').notNull().references(() => sponsors.id, { onDelete: 'cascade' }),
  packageId: integer('package_id').references(() => sponsorPackages.id),
  dealValue: integer('deal_value').notNull(),
  inKindValue: integer('in_kind_value').default(0).notNull(),
  inKindDescription: text('in_kind_description'),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  sponsorIdIdx: index('sponsor_deals_sponsor_id_idx').on(table.sponsorId),
}));

// ─── Admin Tool: AI Prospector ───────────────────────────────────

// Prospects found via AI-powered search
export const prospects = pgTable('prospects', {
  id: serial('id').primaryKey(),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  website: text('website'),
  instagram: varchar('instagram', { length: 100 }),
  category: varchar('category', { length: 100 }),
  location: varchar('location', { length: 255 }),
  relevanceScore: integer('relevance_score'),
  aiRationale: text('ai_rationale'),
  suggestedOutreach: text('suggested_outreach'),
  status: varchar('status', { length: 50 }).default('new').notNull(), // new, contacted, responded, converted, dismissed
  source: text('source'), // the search query that found them
  convertedToSponsorId: integer('converted_to_sponsor_id').references(() => sponsors.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
