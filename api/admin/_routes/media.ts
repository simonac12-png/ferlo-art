import { eq, sql as drizzleSql } from "drizzle-orm";
import { z } from "zod";
import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import {
  db,
  contentSectionsTable,
  mediaTable,
  popupsTable,
} from "@workspace/db";

import { requireSession } from "../../_lib/auth";
import { parseBody } from "../../_lib/json";
import type { Route } from "../../_lib/router";

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const routes: Route[] = [
  {
    method: "GET",
    pattern: "/media",
    handler: async (req, res) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const rows = await db
        .select()
        .from(mediaTable)
        .orderBy(drizzleSql`${mediaTable.uploadedAt} desc`);
      res.status(200).json({ media: rows });
    },
  },
  {
    /**
     * Endpoint used by `@vercel/blob/client` `upload()`. The SDK calls this
     * twice for each upload:
     *   1. type=blob.generate-client-token → server mints a short-lived token
     *      with content-type + size restrictions enforced.
     *   2. type=blob.upload-completed → server records the resulting blob in
     *      the `media` table.
     */
    method: "POST",
    pattern: "/media/upload",
    handler: async (req, res) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const body = req.body as HandleUploadBody;

      try {
        const jsonResponse = await handleUpload({
          body,
          // Vercel `req` is duck-type compatible with the Request the lib reads.
          request: req as unknown as Request,
          onBeforeGenerateToken: async () => ({
            allowedContentTypes: ALLOWED_MIME,
            addRandomSuffix: true,
            maximumSizeInBytes: 10 * 1024 * 1024,
            tokenPayload: JSON.stringify({ userId: session.userId }),
          }),
          onUploadCompleted: async ({ blob, tokenPayload }) => {
            let userId: string | null = null;
            try {
              userId = JSON.parse(tokenPayload ?? "{}").userId ?? null;
            } catch {
              userId = null;
            }
            await db.insert(mediaTable).values({
              blobUrl: blob.url,
              blobPathname: blob.pathname,
              alt: "",
              uploadedBy: userId ?? undefined,
            });
          },
        });
        res.status(200).json(jsonResponse);
      } catch (err) {
        console.error("[media] upload error", err);
        res
          .status(400)
          .json({ error: err instanceof Error ? err.message : "Upload error" });
      }
    },
  },
  {
    method: "PATCH",
    pattern: "/media/:id",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const body = parseBody(
        z.object({ alt: z.string().max(500).optional() }),
        req,
        res,
      );
      if (!body) return;

      await db
        .update(mediaTable)
        .set({ alt: body.alt ?? "" })
        .where(eq(mediaTable.id, params.id));
      res.status(200).json({ ok: true });
    },
  },
  {
    method: "DELETE",
    pattern: "/media/:id",
    handler: async (req, res, params) => {
      const session = await requireSession(req, res);
      if (!session) return;

      const rows = await db
        .select()
        .from(mediaTable)
        .where(eq(mediaTable.id, params.id))
        .limit(1);
      const media = rows[0];
      if (!media) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const refsBySection = await db
        .select({ key: contentSectionsTable.sectionKey })
        .from(contentSectionsTable)
        .where(
          drizzleSql`(${contentSectionsTable.draftData}::text LIKE ${"%" + media.id + "%"})
            OR (${contentSectionsTable.publishedData}::text LIKE ${"%" + media.id + "%"})`,
        );

      const popupRefs = await db
        .select({ id: popupsTable.id })
        .from(popupsTable)
        .where(eq(popupsTable.imageMediaId, media.id));

      if (refsBySection.length > 0 || popupRefs.length > 0) {
        res.status(409).json({
          error: "This image is in use. Remove it from the sections/popups below first.",
          referencedBy: {
            sections: refsBySection.map((r) => r.key),
            popups: popupRefs.map((r) => r.id),
          },
        });
        return;
      }

      try {
        await del(media.blobUrl);
      } catch (err) {
        console.error("[media] blob delete failed", err);
      }
      await db.delete(mediaTable).where(eq(mediaTable.id, media.id));

      res.status(200).json({ ok: true });
    },
  },
];
