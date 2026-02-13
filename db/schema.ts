import { pgTable, serial, text, timestamp, varchar, uniqueIndex } from 'drizzle-orm/pg-core';

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
