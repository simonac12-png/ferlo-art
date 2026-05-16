import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError, type ZodTypeAny } from "zod";

export function parseBody<T extends ZodTypeAny>(
  schema: T,
  req: VercelRequest,
  res: VercelResponse,
): import("zod").infer<T> | null {
  try {
    const parsed = schema.parse(req.body ?? {});
    return parsed;
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: "Invalid input", details: err.flatten() });
    } else {
      res.status(400).json({ error: "Invalid input" });
    }
    return null;
  }
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]) {
  res.setHeader("Allow", allowed.join(", "));
  res.status(405).json({ error: "Method not allowed" });
}
