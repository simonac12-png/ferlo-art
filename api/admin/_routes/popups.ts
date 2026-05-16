import { eq, sql as drizzleSql } from "drizzle-orm";
import { z } from "zod";
import { db, popupsTable } from "@workspace/db";
import { popupSchema } from "@workspace/api-zod";

import { requireSession } from "../../_lib/auth";
import { parseBody } from "../../_lib/json";
import type { Route } from "../../_lib/router";

const updateSchema = popupSchema.partial();

function toRow(input: z.infer<typeof popupSchema>) {
  return {
    name: input.name,
    title: input.title,
    body: input.body,
    imageMediaId: input.image?.mediaId ?? null,
    ctaLabel: input.ctaLabel ?? null,
    ctaUrl: input.ctaUrl ?? null,
    triggerType: input.triggerType,
    triggerValue: input.triggerValue ?? null,
    isActive: input.isActive,
    dismissCookieDays: input.dismissCookieDays,
  };
}

export const routes: Route[] = [
  {
    method: "GET",
    pattern: "/popups",
    handler: async (req, res) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const rows = await db
        .select()
        .from(popupsTable)
        .orderBy(drizzleSql`${popupsTable.createdAt} desc`);
      res.status(200).json({ popups: rows });
    },
  },
  {
    method: "GET",
    pattern: "/popups/:id",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const rows = await db
        .select()
        .from(popupsTable)
        .where(eq(popupsTable.id, params.id))
        .limit(1);
      const popup = rows[0];
      if (!popup) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json({ popup });
    },
  },
  {
    method: "POST",
    pattern: "/popups",
    handler: async (req, res) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const body = parseBody(popupSchema, req, res);
      if (!body) return;

      const [row] = await db
        .insert(popupsTable)
        .values(toRow(body))
        .returning();
      res.status(201).json({ popup: row });
    },
  },
  {
    method: "PUT",
    pattern: "/popups/:id",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const body = parseBody(updateSchema, req, res);
      if (!body) return;

      const update: Record<string, unknown> = { updatedAt: new Date() };
      if (body.name !== undefined) update.name = body.name;
      if (body.title !== undefined) update.title = body.title;
      if (body.body !== undefined) update.body = body.body;
      if (body.image !== undefined) {
        update.imageMediaId = body.image?.mediaId ?? null;
      }
      if (body.ctaLabel !== undefined) update.ctaLabel = body.ctaLabel ?? null;
      if (body.ctaUrl !== undefined) update.ctaUrl = body.ctaUrl ?? null;
      if (body.triggerType !== undefined) update.triggerType = body.triggerType;
      if (body.triggerValue !== undefined)
        update.triggerValue = body.triggerValue ?? null;
      if (body.isActive !== undefined) update.isActive = body.isActive;
      if (body.dismissCookieDays !== undefined)
        update.dismissCookieDays = body.dismissCookieDays;

      const [row] = await db
        .update(popupsTable)
        .set(update)
        .where(eq(popupsTable.id, params.id))
        .returning();
      if (!row) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json({ popup: row });
    },
  },
  {
    method: "DELETE",
    pattern: "/popups/:id",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      await db.delete(popupsTable).where(eq(popupsTable.id, params.id));
      res.status(200).json({ ok: true });
    },
  },
];
