import type { VercelRequest, VercelResponse } from "@vercel/node";
import { dispatch, noStore, type Route } from "../_lib/router";
import { routes as authRoutes } from "./_routes/auth";
import { routes as contentRoutes } from "./_routes/content";
import { routes as mediaRoutes } from "./_routes/media";
import { routes as popupRoutes } from "./_routes/popups";

export const config = { runtime: "nodejs" };

const routes: Route[] = [
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
