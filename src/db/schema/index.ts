import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

/* User Table */

export const UserTable = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 512 }).unique().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex(`${'users'}_email_idx`).on(table.email),
    };
  },
);
export const users = UserTable;

export type User = typeof UserTable.$inferSelect;
export type NewUser = typeof UserTable.$inferInsert;
