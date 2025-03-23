import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const eventsTable = sqliteTable("event", {
  id: int().primaryKey({ autoIncrement: true }),
  color: text().notNull(),
  locked: int({ mode: "boolean" }),
  start: int({ mode: "timestamp" }).notNull(),
  end: int({ mode: "timestamp" }).notNull(),
  title: text(),
});
