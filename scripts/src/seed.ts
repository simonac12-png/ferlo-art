import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import {
  db,
  adminUsersTable,
  contentSectionsTable,
} from "@workspace/db";
import { defaultContent, SECTION_KEYS } from "@workspace/api-zod";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "[seed] ADMIN_EMAIL or ADMIN_PASSWORD missing — skipping admin seed.",
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db
    .insert(adminUsersTable)
    .values({ email, passwordHash })
    .onConflictDoUpdate({
      target: adminUsersTable.email,
      set: { passwordHash },
    });

  console.log(`[seed] Admin user upserted: ${email}`);
}

async function seedContent() {
  for (const key of SECTION_KEYS) {
    const data = defaultContent[key] as Record<string, unknown>;
    await db
      .insert(contentSectionsTable)
      .values({
        sectionKey: key,
        publishedData: data,
        draftData: null,
        publishedAt: new Date(),
      })
      .onConflictDoNothing({ target: contentSectionsTable.sectionKey });
  }
  console.log(
    `[seed] Content sections ensured for: ${SECTION_KEYS.join(", ")}`,
  );
}

async function main() {
  await seedAdmin();
  await seedContent();
  // neon-http has no connection to close
  console.log("[seed] Done.");
}

main().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});

// Silence "unused" linter if sql happens to be needed in future expansion
void sql;
