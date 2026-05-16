import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, contentSectionsTable } from "@workspace/db";
import {
  SECTION_KEYS,
  sectionSchemas,
  type SectionKey,
} from "@workspace/api-zod";
import type { Route } from "../../_lib/router.js";
import { requireSession } from "../../_lib/auth.js";
import { parseBody } from "../../_lib/json.js";

const sectionKeySchema = z.enum(SECTION_KEYS);

function isSectionKey(value: string): value is SectionKey {
  return (SECTION_KEYS as readonly string[]).includes(value);
}

export const routes: Route[] = [
  {
    method: "GET",
    pattern: "/content",
    handler: async (req, res) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const rows = await db.select().from(contentSectionsTable);
      const byKey = new Map(rows.map((r) => [r.sectionKey, r]));

      const sections = SECTION_KEYS.map((key) => {
        const row = byKey.get(key);
        return {
          sectionKey: key,
          draftData: row?.draftData ?? null,
          publishedData: row?.publishedData ?? null,
          publishedAt: row?.publishedAt ?? null,
          updatedAt: row?.updatedAt ?? null,
          hasDraft: row?.draftData != null,
        };
      });

      res.status(200).json({ sections });
    },
  },
  {
    method: "GET",
    pattern: "/content/:key",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const keyParse = sectionKeySchema.safeParse(params.key);
      if (!keyParse.success) {
        res.status(404).json({ error: "Unknown section" });
        return;
      }
      const key = keyParse.data;

      const rows = await db
        .select()
        .from(contentSectionsTable)
        .where(eq(contentSectionsTable.sectionKey, key))
        .limit(1);

      const row = rows[0];
      res.status(200).json({
        sectionKey: key,
        draftData: row?.draftData ?? null,
        publishedData: row?.publishedData ?? null,
        publishedAt: row?.publishedAt ?? null,
        updatedAt: row?.updatedAt ?? null,
      });
    },
  },
  {
    method: "PUT",
    pattern: "/content/:key",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      if (!isSectionKey(params.key)) {
        res.status(404).json({ error: "Unknown section" });
        return;
      }
      const key = params.key;
      const schema = sectionSchemas[key];

      const body = parseBody(z.object({ data: schema }), req, res);
      if (!body) return;

      const data = body.data as Record<string, unknown>;
      await db
        .insert(contentSectionsTable)
        .values({
          sectionKey: key,
          draftData: data,
          updatedBy: session.userId,
        })
        .onConflictDoUpdate({
          target: contentSectionsTable.sectionKey,
          set: {
            draftData: data,
            updatedAt: new Date(),
            updatedBy: session.userId,
          },
        });

      res.status(200).json({ ok: true });
    },
  },
  {
    method: "POST",
    pattern: "/content/:key/publish",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      if (!isSectionKey(params.key)) {
        res.status(404).json({ error: "Unknown section" });
        return;
      }
      const key = params.key;
      const schema = sectionSchemas[key];

      const rows = await db
        .select()
        .from(contentSectionsTable)
        .where(eq(contentSectionsTable.sectionKey, key))
        .limit(1);
      const row = rows[0];

      const candidate = row?.draftData ?? row?.publishedData;
      const parsed = schema.safeParse(candidate);
      if (!parsed.success) {
        res.status(400).json({
          error: "Draft is invalid — fix errors before publishing.",
          details: parsed.error.flatten(),
        });
        return;
      }

      const now = new Date();
      await db
        .insert(contentSectionsTable)
        .values({
          sectionKey: key,
          publishedData: parsed.data as Record<string, unknown>,
          draftData: null,
          publishedAt: now,
          updatedAt: now,
          updatedBy: session.userId,
        })
        .onConflictDoUpdate({
          target: contentSectionsTable.sectionKey,
          set: {
            publishedData: parsed.data as Record<string, unknown>,
            draftData: null,
            publishedAt: now,
            updatedAt: now,
            updatedBy: session.userId,
          },
        });

      res.status(200).json({ ok: true, publishedAt: now });
    },
  },
  {
    method: "POST",
    pattern: "/content/:key/discard-draft",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      if (!isSectionKey(params.key)) {
        res.status(404).json({ error: "Unknown section" });
        return;
      }
      const key = params.key;

      await db
        .update(contentSectionsTable)
        .set({
          draftData: null,
          updatedAt: new Date(),
          updatedBy: session.userId,
        })
        .where(eq(contentSectionsTable.sectionKey, key));

      res.status(200).json({ ok: true });
    },
  },
];
