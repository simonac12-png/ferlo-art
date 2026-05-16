import type { VercelRequest, VercelResponse } from "@vercel/node";
import { dispatch, noStore, type Route } from "../_lib/router.js";
import { routes as authRoutes } from "./_routes/auth.js";
import { routes as contentRoutes } from "./_routes/content.js";
import { routes as mediaRoutes } from "./_routes/media.js";
import { routes as popupRoutes } from "./_routes/popups.js";
import { routes as setupRoutes } from "./_routes/setup.js";

export const config = { runtime: "nodejs" };

const routes: Route[] = [
  ...setupRoutes,
  ...authRoutes,
  ...contentRoutes,
  ...mediaRoutes,
  ...popupRoutes,
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  noStore(res);
  try {
    const matched = await dispatch(routes, req, res);
    if (!matched) {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    console.error("[admin] handler error", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
