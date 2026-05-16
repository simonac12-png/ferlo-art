import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "ferlo_admin";
const COOKIE_PATH = "/api/admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET must be set (>= 16 chars). See CMS_SETUP.md.",
    );
  }
  return new TextEncoder().encode(secret);
}

export type Session = {
  userId: string;
  email: string;
};

export async function signSession(session: Session): Promise<string> {
  return await new SignJWT({ email: session.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { userId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return header.split(/; */).reduce<Record<string, string>>((acc, pair) => {
    const eq = pair.indexOf("=");
    if (eq === -1) return acc;
    const key = pair.slice(0, eq).trim();
    const val = pair.slice(eq + 1).trim();
    if (key) acc[key] = decodeURIComponent(val);
    return acc;
  }, {});
}

export async function readSession(
  req: VercelRequest,
): Promise<Session | null> {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return await verifySession(token);
}

function isProduction(req: VercelRequest): boolean {
  const proto = (req.headers["x-forwarded-proto"] as string) || "";
  return process.env.NODE_ENV === "production" || proto === "https";
}

export function setSessionCookie(
  res: VercelResponse,
  req: VercelRequest,
  token: string,
) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Path=${COOKIE_PATH}`,
    `Max-Age=${SESSION_TTL_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isProduction(req)) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(res: VercelResponse, req: VercelRequest) {
  const parts = [
    `${COOKIE_NAME}=`,
    `Path=${COOKIE_PATH}`,
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isProduction(req)) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

export async function requireSession(
  req: VercelRequest,
  res: VercelResponse,
): Promise<Session | null> {
  const session = await readSession(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return session;
}
