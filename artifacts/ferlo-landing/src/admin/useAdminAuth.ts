import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type AdminUser = { id: string; email: string };

async function fetchMe(): Promise<AdminUser | null> {
  const res = await fetch("/api/admin/me", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`me failed: ${res.status}`);
  const data = (await res.json()) as { user: AdminUser };
  return data.user;
}

export function useAdminAuth() {
  const query = useQuery({
    queryKey: ["admin-me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 60 * 1000,
  });
  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useAdminLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Login failed (${res.status})`);
      }
      return (await res.json()) as { user: AdminUser };
    },
    onSuccess: (data) => {
      qc.setQueryData(["admin-me"], data.user);
    },
  });
}

export function useAdminLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    },
    onSuccess: () => {
      qc.setQueryData(["admin-me"], null);
      qc.invalidateQueries({ queryKey: ["admin-me"] });
    },
  });
}
