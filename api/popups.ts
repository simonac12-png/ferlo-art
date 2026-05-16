import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, mediaTable, popupsTable } from "@workspace/db";

export const config = { runtime: "nodejs" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rows = await db
      .select({
        id: popupsTable.id,
        title: popupsTable.title,
        body: popupsTable.body,
        ctaLabel: popupsTable.ctaLabel,
        ctaUrl: popupsTable.ctaUrl,
        triggerType: popupsTable.triggerType,
        triggerValue: popupsTable.triggerValue,
        dismissCookieDays: popupsTable.dismissCookieDays,
        imageUrl: mediaTable.blobUrl,
        imageAlt: mediaTable.alt,
      })
      .from(popupsTable)
      .leftJoin(mediaTable, eq(popupsTable.imageMediaId, mediaTable.id))
      .where(eq(popupsTable.isActive, true));

    res.setHeader(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300",
    );
    res.status(200).json({ popups: rows });
  } catch (err) {
    console.error("[popups] read failed", err);
    res.status(500).json({ error: "Failed to load popups" });
  }
}
