import { pgTable, text, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";

export const contentSectionsTable = pgTable("content_sections", {
  sectionKey: text("section_key").primaryKey(),
  draftData: jsonb("draft_data").$type<Record<string, unknown> | null>(),
  publishedData: jsonb("published_data").$type<Record<string, unknown> | null>(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedBy: uuid("updated_by"),
});

export type ContentSection = typeof contentSectionsTable.$inferSelect;
export type InsertContentSection = typeof contentSectionsTable.$inferInsert;
