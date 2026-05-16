import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Tiny method+path matcher for the catch-all admin route.
 *
 * Patterns use `:param` segments, e.g. "/content/:key". The matched params
 * are passed to the handler. Returns true if a route matched and was
 * dispatched (response has been sent), false otherwise.
 */

export type RouteParams = Record<string, string>;
export type RouteHandler = (
  req: VercelRequest,
  res: VercelResponse,
  params: RouteParams,
) => Promise<void> | void;

export type Route = {
  method: string;
  pattern: string;
  handler: RouteHandler;
};

function matchPattern(
  pattern: string,
  path: string,
): RouteParams | null {
  const patSegs = pattern.split("/").filter(Boolean);
  const pathSegs = path.split("/").filter(Boolean);
  if (patSegs.length !== pathSegs.length) return null;
  const params: RouteParams = {};
  for (let i = 0; i < patSegs.length; i++) {
    const p = patSegs[i];
    const v = pathSegs[i];
    if (p.startsWith(":")) {
      params[p.slice(1)] = decodeURIComponent(v);
    } else if (p !== v) {
      return null;
    }
  }
  return params;
}

export function getAdminPath(req: VercelRequest): string {
  const url = req.url || "/";
  const pathOnly = url.split("?")[0];
  // strip leading "/api/admin"
  const stripped = pathOnly.replace(/^\/api\/admin/, "");
  return stripped || "/";
}

export async function dispatch(
  routes: Route[],
  req: VercelRequest,
  res: VercelResponse,
): Promise<boolean> {
  const method = (req.method || "GET").toUpperCase();
  const path = getAdminPath(req);

  for (const route of routes) {
    if (route.method !== method) continue;
    const params = matchPattern(route.pattern, path);
    if (!params) continue;
    await route.handler(req, res, params);
    return true;
  }
  return false;
}

export function noStore(res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
}
