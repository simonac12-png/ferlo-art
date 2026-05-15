import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

export const config = { runtime: "nodejs" };

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  ageRange: z.enum(["under-3", "3-5", "6-8", "9-12", "multiple"]),
  message: z.string().trim().max(2000).optional().default(""),
  // honeypot — real users leave this blank
  website: z.string().max(0).optional().default(""),
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Honeypot tripped — pretend success, drop the request.
  if (parsed.data.website.length > 0) {
    return res.status(200).json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.WAITLIST_TO;
  const from = process.env.WAITLIST_FROM ?? "FerLo Waitlist <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error("[waitlist] Missing RESEND_API_KEY or WAITLIST_TO env var");
    return res.status(500).json({ error: "Email not configured" });
  }

  const { name, email, ageRange, message } = parsed.data;
  const resend = new Resend(apiKey);

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Child age range: ${ageRange}`,
    "",
    message ? `Message:\n${message}` : "(no message)",
  ];

  const htmlLines = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Child age range:</strong> ${escapeHtml(ageRange)}</p>`,
    message
      ? `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`
      : "<p><em>No message</em></p>",
  ];

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `New FerLo waitlist signup — ${name}`,
    text: lines.join("\n"),
    html: htmlLines.join(""),
  });

  if (error) {
    console.error("[waitlist] Resend send failed", error);
    return res.status(502).json({ error: "Failed to send" });
  }

  return res.status(200).json({ ok: true });
}
