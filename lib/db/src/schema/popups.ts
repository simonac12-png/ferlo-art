import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const POPUP_TRIGGER_TYPES = [
  "on_load",
  "after_delay",
  "exit_intent",
  "on_click",
] as const;

export type PopupTriggerType = (typeof POPUP_TRIGGER_TYPES)[number];

export const popupsTable = pgTable("popups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  imageMediaId: uuid("image_media_id"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  triggerType: text("trigger_type").$type<PopupTriggerType>().notNull(),
  triggerValue: text("trigger_value"),
  isActive: boolean("is_active").notNull().default(false),
  dismissCookieDays: integer("dismiss_cookie_days").notNull().default(7),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Popup = typeof popupsTable.$inferSelect;
export type InsertPopup = typeof popupsTable.$inferInsert;
