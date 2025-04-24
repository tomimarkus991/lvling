import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const eventsTable = sqliteTable("event", {
  id: int().primaryKey({ autoIncrement: true }),
  color: text().notNull(),
  locked: int({ mode: "boolean" }),
  start: text().notNull(),
  end: text().notNull(),
  title: text().notNull(),
});

export const presetsTable = sqliteTable("preset", {
  id: int().primaryKey({ autoIncrement: false }),
  title: text().notNull(),
  color: text().notNull(),
  locked: int({ mode: "boolean" }).default(false),
});
