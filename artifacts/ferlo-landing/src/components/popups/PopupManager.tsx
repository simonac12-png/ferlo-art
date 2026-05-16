import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PublicPopup = {
  id: string;
  title: string;
  body: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  triggerType: "on_load" | "after_delay" | "exit_intent" | "on_click";
  triggerValue: string | null;
  dismissCookieDays: number;
  imageUrl: string | null;
  imageAlt: string | null;
};

const DISMISS_PREFIX = "ferlo_popup_dismissed:";

function isDismissed(id: string): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_PREFIX + id);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return ts > Date.now();
  } catch {
    return false;
  }
}

function rememberDismiss(id: string, days: number) {
  try {
    const expiresAt = Date.now() + Math.max(0, days) * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_PREFIX + id, String(expiresAt));
  } catch {
    /* ignore */
  }
}

export function PopupManager() {
  const { data } = useQuery({
    queryKey: ["site-popups"],
    queryFn: async () => {
      const res = await fetch("/api/popups", {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return { popups: [] as PublicPopup[] };
      return (await res.json()) as { popups: PublicPopup[] };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const popups = data?.popups ?? [];
  const eligible = useMemo(
    () => popups.filter((p) => !isDismissed(p.id)),
    [popups],
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!eligible.length) return;
    const cleanups: Array<() => void> = [];

    for (const popup of eligible) {
      switch (popup.triggerType) {
        case "on_load": {
          const t = window.setTimeout(() => setActiveId(popup.id), 200);
          cleanups.push(() => window.clearTimeout(t));
          break;
        }
        case "after_delay": {
          const secs = Number(popup.triggerValue) || 5;
          const t = window.setTimeout(
            () => setActiveId(popup.id),
            secs * 1000,
          );
          cleanups.push(() => window.clearTimeout(t));
          break;
        }
        case "exit_intent": {
          const handler = (e: MouseEvent) => {
            if (e.clientY <= 0) setActiveId(popup.id);
          };
          document.addEventListener("mouseleave", handler);
          cleanups.push(() =>
            document.removeEventListener("mouseleave", handler),
          );
          break;
        }
        case "on_click": {
          const sel = popup.triggerValue;
          if (!sel) break;
          const handler = (e: Event) => {
            const target = e.target as Element | null;
            if (target && target.closest(sel)) setActiveId(popup.id);
          };
          document.addEventListener("click", handler, true);
          cleanups.push(() =>
            document.removeEventListener("click", handler, true),
          );
          break;
        }
      }
    }

    return () => cleanups.forEach((c) => c());
  }, [eligible]);

  const active = eligible.find((p) => p.id === activeId) ?? null;

  const dismiss = () => {
    if (active) rememberDismiss(active.id, active.dismissCookieDays);
    setActiveId(null);
  };

  return (
    <Dialog
      open={!!active}
      onOpenChange={(open) => {
        if (!open) dismiss();
      }}
    >
      {active && (
        <DialogContent className="max-w-md">
          {active.imageUrl && (
            <img
              src={active.imageUrl}
              alt={active.imageAlt ?? ""}
              className="w-full h-40 object-cover rounded-md"
              loading="lazy"
            />
          )}
          <DialogHeader>
            <DialogTitle>{active.title}</DialogTitle>
            {active.body && (
              <DialogDescription className="whitespace-pre-line">
                {active.body}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            {active.ctaUrl && active.ctaLabel && (
              <Button asChild>
                <a href={active.ctaUrl} onClick={dismiss}>
                  {active.ctaLabel}
                </a>
              </Button>
            )}
            <Button variant="outline" onClick={dismiss}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
