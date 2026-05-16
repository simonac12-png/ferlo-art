import { upload } from "@vercel/blob/client";

export type MediaRow = {
  id: string;
  blobUrl: string;
  blobPathname: string;
  alt: string;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  mime: string | null;
  uploadedAt: string;
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

export async function listMedia(): Promise<MediaRow[]> {
  const res = await adminFetch("/api/admin/media");
  const data = (await res.json()) as { media: MediaRow[] };
  return data.media;
}

export async function uploadMedia(file: File): Promise<{ url: string; pathname: string }> {
  // Streams the file straight to Vercel Blob; bypasses the 4.5 MB Vercel
  // function body limit. Server mints a short-lived token first.
  const result = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/admin/media/upload",
  });
  return { url: result.url, pathname: result.pathname };
}

export async function deleteMedia(id: string): Promise<void> {
  await adminFetch(`/api/admin/media/${id}`, { method: "DELETE" });
}

export async function updateMediaAlt(id: string, alt: string): Promise<void> {
  await adminFetch(`/api/admin/media/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ alt }),
  });
}
