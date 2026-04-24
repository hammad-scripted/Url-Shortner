import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './user.model.js';

export const urlsTable = pgTable('urls', {
  id: uuid().primaryKey().default(),
  shortUrl: varchar('short_url', { length: 155 }).notNull().unique(),
  targetUrl: text('target_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: uuid('user_id')
    .references(() => usersTable.id)
    .notNull(),
});
