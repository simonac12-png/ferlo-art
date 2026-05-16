import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import type { Route } from "../../_lib/router.js";

/**
 * Idempotent first-run bootstrap. Creates the 4 tables, seeds default
 * content, and seeds the admin user from ADMIN_EMAIL + ADMIN_PASSWORD env
 * vars. Refuses to run a second time once an admin user already exists.
 *
 * Why this exists: Vercel Postgres env vars are encrypted and not pullable
 * by `vercel env pull`, so the admin can't run drizzle-kit / seed scripts
 * locally. This endpoint runs inside Vercel where the env vars are
 * accessible.
 */

const defaults: Record<string, unknown> = {
  navbar: {
    logo: { url: "/ferlo-favicon.png", alt: "FerLo Logo", width: 40, height: 40 },
    navLinks: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Waitlist", href: "#waitlist" },
    ],
    ctaLabel: "Join waitlist",
    ctaHref: "#waitlist",
  },
  hero: {
    logo: { url: "/ferlo-logo.png", alt: "FerLo", width: 1021, height: 304 },
    headlineLine1: "Where children's",
    headlineHighlight: "creations",
    headlineLine2: "come to life",
    subheading:
      "FerLo transforms children's handmade art into story characters and personalized AI-powered stories that honor every handmade detail.",
    primaryCta: { label: "Join the waitlist", href: "#waitlist" },
    secondaryCta: { label: "See how it works", href: "#how-it-works" },
    leftImage: { url: "/child-drawing.jpg", alt: "Child's original drawing", width: 1200, height: 1600 },
    rightImage: { url: "/ferlo-character.jpg", alt: "FerLo Character", width: 1200, height: 1800 },
  },
  how_it_works: {
    heading: "How it works",
    subheading: "From a physical craft to a magical story in three simple steps.",
    steps: [
      { number: "01", title: "Upload a creation", description: "Take a photo of a drawing, clay figure, nature build, or any handmade project.", accent: "primary" },
      { number: "02", title: "FerLo brings it to life", description: "AI transforms the creation into a beautiful character while preserving the child's original shapes and imperfections. We honor every handmade detail.", accent: "secondary" },
      { number: "03", title: "Receive a personalized story", description: "The character stars in a gentle story that sparks imagination and helps children understand AI in an age-appropriate way.", accent: "accent" },
    ],
  },
  showcase: {
    heading: "Honoring every detail",
    subheading: "We don't fix their art. We bring their exact imagination to life.",
    cards: [
      { caption: "Ferdi's watercolor monster became a friendly giant", beforeImage: { url: "/showcase-ferdi-original.jpg", alt: "Ferdi original" }, afterImage: { url: "/showcase-ferdi-character.png", alt: "Ferdi character" }, beforeGradient: "from-amber-100/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/20", afterGradient: "from-accent/10 to-primary/10" },
      { caption: "Leo's clay rabbit became a brave forest guardian", beforeImage: { url: "/showcase-leo-original.jpg", alt: "Leo original" }, afterImage: { url: "/showcase-leo-character.png", alt: "Leo character" }, beforeGradient: "from-emerald-100/80 to-green-50/80 dark:from-emerald-900/30 dark:to-green-900/20", afterGradient: "from-primary/10 to-secondary/10" },
      { caption: "Max's cardboard spaceship became a real explorer", beforeImage: { url: "/showcase-max-original.jpg", alt: "Max original" }, afterImage: { url: "/showcase-max-character.png", alt: "Max character" }, beforeGradient: "from-sky-100/80 to-blue-50/80 dark:from-sky-900/30 dark:to-blue-900/20", afterGradient: "from-secondary/10 to-primary/10" },
    ],
  },
  story_examples: {
    heading: "More than a picture",
    subheading: "Every character stars in a personalized story that sparks imagination and teaches gentle lessons.",
    stories: [
      { title: "The Robot Who Learned to Feel", character: "Beepo", source: "a child's clay robot", theme: "What is AI?", preview: "Beepo was built with shiny metal and a very big heart. But when he met a sad little bird, he didn't know how to compute sadness. With a little help, Beepo learns that some things can't be calculated—they just have to be felt." },
      { title: "The Wobbly Tower", character: "Stony", source: "a pebble tower", theme: "Creativity & Problem Solving", preview: "Stony was the tallest tower in the garden, but the wind kept knocking him down! Instead of giving up, Stony figures out a new way to stack himself, learning that building something new sometimes means looking at the pieces differently." },
      { title: "The Rainbow Weaver", character: "Lumie", source: "a yarn craft", theme: "Kindness", preview: "Lumie loved spinning bright, colorful threads. When the town lost its colors to a gloomy storm, Lumie realized that sharing her colorful threads made the world bright again. A story about giving and the warmth of sharing." },
    ],
  },
  mission: {
    icon: { url: "/ferlo-icon.png", alt: "FerLo Icon", width: 80, height: 80 },
    quote: "FerLo brings children's handcrafted creations to life through AI-powered characters and stories. It helps children feel proud of their imagination while gently teaching them what AI is, how it works, and how it can support human creativity.",
  },
  coming_next: {
    heading: "Coming Next",
    subheading: "We are building a magical platform that grows with your child's creativity. This is just the beginning.",
    items: [
      { title: "Narrated stories", description: "In the child's voice" },
      { title: "Multilingual", description: "Story generation in any language" },
      { title: "Animated shorts", description: "Cartoon videos of their characters" },
      { title: "Family library", description: "A shared shelf of all creations" },
    ],
  },
  waitlist: {
    heading: "Be the first to experience FerLo",
    subheading: "Join our pre-launch waitlist. Spaces are limited as we carefully craft our first stories.",
    submitLabel: "Join the FerLo waitlist",
    submitPending: "Joining...",
    successHeading: "Welcome to the magic",
    successBody: "Thank you for joining the waitlist! We'll be in touch soon when it's time to bring your child's creations to life.",
    errorBody: "Something went wrong. Please try again, or email us directly.",
  },
  footer: {
    icon: { url: "/ferlo-icon.png", alt: "FerLo Icon", width: 40, height: 40 },
    tagline: "Where art meets AI",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Instagram", href: "#" },
    ],
    copyright: "© 2025 FerLo. All rights reserved.",
  },
};

function getConn(): string | null {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.FERLO_POSTGRES_URL ||
    process.env.FERLO_DATABASE_URL ||
    process.env.FERLO_POSTGRES_PRISMA_URL ||
    null
  );
}

export const routes: Route[] = [
  {
    method: "POST",
    pattern: "/setup",
    handler: async (_req, res) => {
      const conn = getConn();
      if (!conn) {
        res.status(500).json({ error: "No Postgres connection configured" });
        return;
      }
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminEmail || !adminPassword) {
        res.status(500).json({
          error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set in Vercel env",
        });
        return;
      }

      const sql = neon(conn);

      try {
        await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

        await sql`
          CREATE TABLE IF NOT EXISTS admin_users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            email text NOT NULL UNIQUE,
            password_hash text NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS content_sections (
            section_key text PRIMARY KEY,
            draft_data jsonb,
            published_data jsonb,
            published_at timestamptz,
            updated_at timestamptz NOT NULL DEFAULT now(),
            updated_by uuid
          )
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS media (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            blob_url text NOT NULL,
            blob_pathname text NOT NULL,
            alt text NOT NULL DEFAULT '',
            width integer,
            height integer,
            size_bytes integer,
            mime text,
            uploaded_at timestamptz NOT NULL DEFAULT now(),
            uploaded_by uuid
          )
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS popups (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name text NOT NULL,
            title text NOT NULL,
            body text NOT NULL DEFAULT '',
            image_media_id uuid,
            cta_label text,
            cta_url text,
            trigger_type text NOT NULL,
            trigger_value text,
            is_active boolean NOT NULL DEFAULT false,
            dismiss_cookie_days integer NOT NULL DEFAULT 7,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
          )
        `;

        const existing = await sql`SELECT COUNT(*)::int AS n FROM admin_users`;
        const adminCount = (existing[0] as { n: number } | undefined)?.n ?? 0;
        if (adminCount > 0) {
          res.status(403).json({
            error: "Already initialized",
            adminCount,
          });
          return;
        }

        const hash = await bcrypt.hash(adminPassword, 12);
        await sql`
          INSERT INTO admin_users (email, password_hash)
          VALUES (${adminEmail}, ${hash})
          ON CONFLICT (email) DO NOTHING
        `;

        for (const [key, data] of Object.entries(defaults)) {
          await sql`
            INSERT INTO content_sections (section_key, published_data, draft_data, published_at)
            VALUES (${key}, ${JSON.stringify(data)}::jsonb, NULL, now())
            ON CONFLICT (section_key) DO NOTHING
          `;
        }

        res.status(200).json({
          ok: true,
          tablesCreated: true,
          adminCreated: adminEmail,
          sectionsSeeded: Object.keys(defaults),
        });
      } catch (err) {
        console.error("[setup] failed", err);
        res
          .status(500)
          .json({ error: err instanceof Error ? err.message : "Setup failed" });
      }
    },
  },
];
