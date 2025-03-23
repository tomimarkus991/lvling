import { eventsTable } from "./schema";

export type SelectEvent = typeof eventsTable.$inferSelect;
export type CreateEvent = typeof eventsTable.$inferInsert;
