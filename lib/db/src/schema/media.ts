import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const mediaTable = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  blobUrl: text("blob_url").notNull(),
  blobPathname: text("blob_pathname").notNull(),
  alt: text("alt").notNull().default(""),
  width: integer("width"),
  height: integer("height"),
  sizeBytes: integer("size_bytes"),
  mime: text("mime"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  uploadedBy: uuid("uploaded_by"),
});

export type Media = typeof mediaTable.$inferSelect;
export type InsertMedia = typeof mediaTable.$inferInsert;
