import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, adminUsersTable } from "@workspace/db";
import { parseBody } from "../../_lib/json.js";
import { rateLimit, clientIp } from "../../_lib/rate-limit.js";
import {
  clearSessionCookie,
  readSession,
  setSessionCookie,
  signSession,
} from "../../_lib/auth.js";
import type { Route } from "../../_lib/router.js";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export const routes: Route[] = [
  {
    method: "POST",
    pattern: "/auth/login",
    handler: async (req, res) => {
      const ip = clientIp(req);
      const rl = rateLimit(`login:${ip}`, {
        max: 8,
        windowMs: 10 * 60 * 1000,
      });
      if (!rl.allowed) {
        res.setHeader(
          "Retry-After",
          String(Math.ceil(rl.retryAfterMs / 1000)),
        );
        res.status(429).json({ error: "Too many attempts. Try again later." });
        return;
      }

      const body = parseBody(loginSchema, req, res);
      if (!body) return;

      const rows = await db
        .select()
        .from(adminUsersTable)
        .where(eq(adminUsersTable.email, body.email))
        .limit(1);

      const user = rows[0];
      // Run bcrypt against a real-looking dummy hash when the user is missing,
      // so login response time doesn't leak whether the email is registered.
      const DUMMY_HASH =
        "$2a$12$abcdefghijklmnopqrstuOWxYZabcdefghijklmnopqrstuvwxyz0123";
      const ok = await bcrypt
        .compare(body.password, user?.passwordHash ?? DUMMY_HASH)
        .catch(() => false);

      if (!user || !ok) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const token = await signSession({ userId: user.id, email: user.email });
      setSessionCookie(res, req, token);
      res.status(200).json({ user: { id: user.id, email: user.email } });
    },
  },
  {
    method: "POST",
    pattern: "/auth/logout",
    handler: async (req, res) => {
      clearSessionCookie(res, req);
      res.status(200).json({ ok: true });
    },
  },
  {
    method: "GET",
    pattern: "/me",
    handler: async (req, res) => {
      const session = await readSession(req);
      if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res
        .status(200)
        .json({ user: { id: session.userId, email: session.email } });
    },
  },
];
