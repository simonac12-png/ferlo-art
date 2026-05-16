import {
  SECTION_KEYS,
  defaultContent,
  type SectionKey,
} from "@workspace/api-zod";

export type AdminSectionRow = {
  sectionKey: SectionKey;
  draftData: unknown;
  publishedData: unknown;
  publishedAt: string | null;
  updatedAt: string | null;
  hasDraft: boolean;
};

async function adminFetch(input: string, init?: RequestInit) {
  const res = await fetch(input, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res;
}

export async function listSections(): Promise<AdminSectionRow[]> {
  const res = await adminFetch("/api/admin/content");
  const data = (await res.json()) as { sections: AdminSectionRow[] };
  return data.sections;
}

export async function getSection(key: SectionKey): Promise<AdminSectionRow> {
  const res = await adminFetch(`/api/admin/content/${key}`);
  return (await res.json()) as AdminSectionRow;
}

export async function saveSectionDraft(
  key: SectionKey,
  data: unknown,
): Promise<void> {
  await adminFetch(`/api/admin/content/${key}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}

export async function publishSection(key: SectionKey): Promise<void> {
  await adminFetch(`/api/admin/content/${key}/publish`, { method: "POST" });
}

export async function discardSectionDraft(key: SectionKey): Promise<void> {
  await adminFetch(`/api/admin/content/${key}/discard-draft`, {
    method: "POST",
  });
}

/**
 * Pick the best initial value for the editor: prefer a saved draft, then
 * the published version, finally the hardcoded default.
 */
export function initialEditorValue(row: AdminSectionRow): unknown {
  if (row.draftData != null) return row.draftData;
  if (row.publishedData != null) return row.publishedData;
  return defaultContent[row.sectionKey];
}

export function isKnownSectionKey(key: string): key is SectionKey {
  return (SECTION_KEYS as readonly string[]).includes(key);
}
