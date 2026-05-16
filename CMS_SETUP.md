# FerLo CMS — Setup

One-time steps to wire the admin CMS on a fresh Vercel project.

## 1. Provision Vercel Postgres + Vercel Blob

In the Vercel dashboard, project **Storage** tab:

1. **Create Postgres** (Neon-backed). Connect it to the project. Vercel auto-injects `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, etc.
2. **Create Blob** store. Connect it to the project. Vercel auto-injects `BLOB_READ_WRITE_TOKEN`.

## 2. Manual environment variables

In **Settings → Environment Variables**, add (all three environments: Production, Preview, Development):

| Name | Purpose | How to generate |
|---|---|---|
| `JWT_SECRET` | Signs the admin auth cookie | `openssl rand -base64 48` |
| `ADMIN_EMAIL` | Admin login email | Your email |
| `ADMIN_PASSWORD` | Admin login password (hashed at seed time) | Strong password you'll remember |
| `ADMIN_COOKIE_NAME` *(optional)* | Cookie name | Defaults to `ferlo_admin` |

Existing vars (unchanged): `RESEND_API_KEY`, `WAITLIST_TO`, `WAITLIST_FROM`.

## 3. Create the tables

From a machine with `POSTGRES_URL` exported (pull it from `vercel env pull .env.local`):

```bash
pnpm --filter @workspace/db run push
```

This applies `lib/db/src/schema/` to the live database (creates `admin_users`, `content_sections`, `media`, `popups`).

## 4. Seed the admin user + initial content

With the same env loaded:

```bash
pnpm --filter @workspace/scripts run seed
```

This is idempotent:

- Upserts an admin user (re-running with a new `ADMIN_PASSWORD` will update the hash).
- Inserts a row per section in `content_sections` with `published_data` set to the current hardcoded site copy. Existing rows are left alone.

## 5. Deploy and log in

After deploying, visit `/admin/login` with the email + password from step 2.

## Local dev

```bash
vercel env pull .env.local           # pulls all env vars into .env.local
pnpm --filter @workspace/ferlo-landing dev
# in another tab:
vercel dev                            # runs the serverless API locally
```
