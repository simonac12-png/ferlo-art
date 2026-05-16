import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, contentSectionsTable } from "@workspace/db";

export const config = { runtime: "nodejs" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rows = await db
      .select({
        sectionKey: contentSectionsTable.sectionKey,
        publishedData: contentSectionsTable.publishedData,
      })
      .from(contentSectionsTable);

    const sections: Record<string, unknown> = {};
    for (const row of rows) {
      if (row.publishedData != null) {
        sections[row.sectionKey] = row.publishedData;
      }
    }

    res.setHeader(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300",
    );
    res.status(200).json({ sections });
  } catch (err) {
    console.error("[content] read failed", err);
    res.status(500).json({ error: "Failed to load content" });
  }
}
