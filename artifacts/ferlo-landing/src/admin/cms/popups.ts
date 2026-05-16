import type { PopupTriggerType } from "@workspace/api-zod";

export type PopupRow = {
  id: string;
  name: string;
  title: string;
  body: string;
  imageMediaId: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  triggerType: PopupTriggerType;
  triggerValue: string | null;
  isActive: boolean;
  dismissCookieDays: number;
  createdAt: string;
  updatedAt: string;
};

export type PopupInputDTO = {
  name: string;
  title: string;
  body: string;
  image?: { url: string; alt: string; mediaId?: string };
  ctaLabel?: string;
  ctaUrl?: string;
  triggerType: PopupTriggerType;
  triggerValue?: string;
  isActive: boolean;
  dismissCookieDays: number;
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
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res;
}

export async function listPopups(): Promise<PopupRow[]> {
  const res = await adminFetch("/api/admin/popups");
  const data = (await res.json()) as { popups: PopupRow[] };
  return data.popups;
}

export async function getPopup(id: string): Promise<PopupRow> {
  const res = await adminFetch(`/api/admin/popups/${id}`);
  const data = (await res.json()) as { popup: PopupRow };
  return data.popup;
}

export async function createPopup(input: PopupInputDTO): Promise<PopupRow> {
  const res = await adminFetch("/api/admin/popups", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as { popup: PopupRow };
  return data.popup;
}

export async function updatePopup(
  id: string,
  input: Partial<PopupInputDTO>,
): Promise<PopupRow> {
  const res = await adminFetch(`/api/admin/popups/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as { popup: PopupRow };
  return data.popup;
}

export async function deletePopup(id: string): Promise<void> {
  await adminFetch(`/api/admin/popups/${id}`, { method: "DELETE" });
}
